require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api', (req, res) => {
  res.json({ message: 'Supabase Auth API çalışıyor 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 yakalayıcı
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı.' });
});

// Genel hata yakalayıcı
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
