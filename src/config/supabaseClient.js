require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL ve SUPABASE_ANON_KEY .env dosyasında tanımlı olmalı.');
}

// anon key ile client -> register/login gibi normal kullanıcı işlemleri için
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// service role key ile client -> admin işlemleri / RLS'i bypass eden sunucu tarafı işlemler için
// (örn. profil satırı oluşturma, kullanıcı silme). Sadece backend içinde kullanılır.
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

module.exports = { supabase, supabaseAdmin };
