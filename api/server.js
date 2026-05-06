const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Izin agar frontend GitHub Pages bisa akses
app.use(express.json());

let userData = {
  nama: "Sarah Aliyah",
  saldo: 25000,
  statusPinjam: "selesai", // 'aktif' atau 'selesai'
  pinjaman: null
};

// 1. Endpoint untuk ambil data Profil & Saldo
app.get('/api/user', (req, res) => {
  res.json(userData);
});

// 2. Endpoint Logika Scan QR (Mulai Pinjam)
app.post('/api/pinjam', (req, res) => {
  const { stationId } = req.body;

  if (userData.statusPinjam === "aktif") {
    return res.status(400).json({ message: "Kamu masih meminjam payung!" });
  }

  if (userData.saldo < 3000) {
    return res.status(400).json({ message: "Saldo minimal Rp 3.000 untuk pinjam." });
  }

  userData.statusPinjam = "aktif";
  userData.pinjaman = {
    idPayung: "PYG-8821",
    lokasiAmbil: stationId,
    waktuMulai: new Date()
  };

  res.json({ message: "Berhasil! Silakan ambil payung.", data: userData });
});

// 3. Endpoint Kembalikan Payung (Potong Saldo)
app.post('/api/kembali', (req, res) => {
  if (userData.statusPinjam === "selesai") {
    return res.status(400).json({ message: "Tidak ada peminjaman aktif." });
  }

  const biaya = 3000;
  userData.saldo -= biaya;
  userData.statusPinjam = "selesai";
  userData.pinjaman = null;

  res.json({ 
    message: `Payung dikembalikan. Saldo terpotong Rp ${biaya.toLocaleString('id-ID')}`, 
    saldoBaru: userData.saldo 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Payungin aktif di port ${PORT}`);
});
