const { supabase, supabaseAdmin } = require('../config/supabaseClient');

// Giriş yapmış kullanıcının kendi profil bilgilerini getirir
async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profil bulunamadı.' });
    }

    res.status(200).json({ user: data });
  } catch (err) {
    console.error('getMe hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

// Giriş yapmış kullanıcının profil bilgilerini günceller
async function updateMe(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, ...rest } = req.body;

    // id ve email gibi alanların dışarıdan değiştirilmesini engelliyoruz
    delete rest.id;
    delete rest.email;

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, ...rest, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Profil güncellendi.', user: data });
  } catch (err) {
    console.error('updateMe hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

module.exports = { getMe, updateMe };
