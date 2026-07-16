const { supabase } = require('../config/supabaseClient');

/**
 * İstek header'ındaki "Authorization: Bearer <access_token>" değerini
 * Supabase'e doğrulatır ve geçerliyse req.user'a kullanıcıyı ekler.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme token\'ı eksik.' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token.' });
    }

    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    console.error('Auth middleware hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

module.exports = { requireAuth };
