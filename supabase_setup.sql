-- Bu SQL'i Supabase Dashboard > SQL Editor içinde çalıştır.

-- 1) Kullanıcı ek bilgilerini tutan profiles tablosu
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Row Level Security'i aç
alter table public.profiles enable row level security;

-- 3) Kullanıcı sadece kendi profilini görebilsin
create policy "Kullanıcı kendi profilini görebilir"
on public.profiles for select
using (auth.uid() = id);

-- 4) Kullanıcı sadece kendi profilini güncelleyebilsin
create policy "Kullanıcı kendi profilini güncelleyebilir"
on public.profiles for update
using (auth.uid() = id);

-- 5) Insert işlemi backend'de service_role key ile yapılacağı için
--    normal kullanıcıların insert yapmasına izin vermiyoruz.
--    (Eğer service role kullanmak istemiyorsan, aşağıdaki policy'yi aç:)
-- create policy "Kullanıcı kayıt olurken kendi profilini oluşturabilir"
-- on public.profiles for insert
-- with check (auth.uid() = id);
