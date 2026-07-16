# Supabase Auth API

Node.js + Express + Supabase Auth ile hazırlanmış kayıt/giriş API'si.

## Kurulum

### 1. Supabase projesi oluştur
- [supabase.com](https://supabase.com) üzerinden yeni bir proje oluştur.
- Dashboard > **Project Settings > API** sekmesinden şunları al:
  - `Project URL` → `SUPABASE_URL`
  - `anon public` key → `SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (gizli, sadece backend'de kullanılır)

### 2. Veritabanı tablosunu oluştur
`supabase_setup.sql` dosyasındaki SQL'i Supabase Dashboard > **SQL Editor**'de çalıştır.
Bu, `profiles` tablosunu ve Row Level Security (RLS) politikalarını oluşturur.

> Not: E-posta doğrulamasını Supabase Dashboard > Authentication > Providers > Email
> kısmından açıp kapatabilirsin. Test aşamasında kapatman işini kolaylaştırır.

### 3. Ortam değişkenlerini ayarla
```bash
cp .env.example .env
```
`.env` dosyasını kendi Supabase bilgilerinle doldur.

### 4. Bağımlılıkları yükle ve çalıştır
```bash
npm install
npm run dev   # nodemon ile
# veya
npm start
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Endpoint'ler

### Auth

| Method | Endpoint             | Açıklama                          | Body                              |
|--------|-----------------------|------------------------------------|-------------------------------------|
| POST   | `/api/auth/register`  | Yeni kullanıcı kaydı               | `{ email, password, full_name }`   |
| POST   | `/api/auth/login`     | Giriş yap, token al                | `{ email, password }`              |
| POST   | `/api/auth/logout`    | Çıkış yap (token gerekli)          | -                                   |
| POST   | `/api/auth/refresh`   | access_token'ı yenile              | `{ refresh_token }`                |

### Kullanıcı

| Method | Endpoint         | Açıklama                       | Header                              |
|--------|-------------------|----------------------------------|--------------------------------------|
| GET    | `/api/users/me`   | Kendi profilini getir            | `Authorization: Bearer <access_token>` |
| PUT    | `/api/users/me`   | Kendi profilini güncelle         | `Authorization: Bearer <access_token>` |

## Örnek kullanım (curl)

**Kayıt:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ege@example.com","password":"123456","full_name":"Ege Öğütücü"}'
```

**Giriş:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ege@example.com","password":"123456"}'
```
Dönen `access_token`'ı kopyala.

**Profil bilgisi al:**
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>"
```

**Profil güncelle:**
```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Yeni İsim"}'
```

## Proje yapısı
```
supabase-auth-api/
├── server.js
├── src/
│   ├── config/
│   │   └── supabaseClient.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       └── user.js
├── supabase_setup.sql
├── .env.example
└── package.json
```

## Notlar
- Kimlik doğrulama tamamen **Supabase Auth** üzerinden yapılıyor (şifreler Supabase tarafında hash'leniyor, kendi JWT sistemi kurmana gerek yok).
- Ek kullanıcı bilgileri (`full_name` vb.) `profiles` tablosunda tutuluyor ve RLS ile korunuyor.
- `SUPABASE_SERVICE_ROLE_KEY`'i **asla** frontend'e veya public repoya koyma.
