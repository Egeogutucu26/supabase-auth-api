const { supabase, supabaseAdmin } = require('../config/supabaseClient');

// -------------------- KAYIT (REGISTER) --------------------
async function register(req, res) {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email ve password zorunludur.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı.' });
    }

    // 1) Supabase Auth üzerinde kullanıcı oluştur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name || null }, // user_metadata içine yazılır
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    // 2) Ek kullanıcı bilgilerini "profiles" tablosuna yaz
    //    (service role key varsa RLS bypass edilerek admin client ile yazılır)
    if (user) {
      const client = supabaseAdmin || supabase;
      const { error: profileError } = await client.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: full_name || null,
      });

      if (profileError) {
        console.error('Profil oluşturma hatası:', profileError.message);
        // Kayıt işlemi başarısız sayılmaz, sadece loglanır.
      }
    }

    // E-posta doğrulama açıksa session null döner, kullanıcı e-postasını onaylamalı
    return res.status(201).json({
      message: data.session
        ? 'Kayıt başarılı.'
        : 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.',
      user: {
        id: user?.id,
        email: user?.email,
      },
      session: data.session, // access_token, refresh_token vs. (varsa)
    });
  } catch (err) {
    console.error('Register hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

// -------------------- GİRİŞ (LOGIN) --------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email ve password zorunludur.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    }

    res.status(200).json({
      message: 'Giriş başarılı.',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

// -------------------- ÇIKIŞ (LOGOUT) --------------------
async function logout(req, res) {
  try {
    const { error } = await supabase.auth.signOut(req.token);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: 'Çıkış yapıldı.' });
  } catch (err) {
    console.error('Logout hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

// -------------------- TOKEN YENİLEME (REFRESH) --------------------
async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'refresh_token zorunludur.' });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
      return res.status(401).json({ error: 'Token yenilenemedi.' });
    }

    res.status(200).json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    console.error('Refresh hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

module.exports = { register, login, logout, refreshToken };
