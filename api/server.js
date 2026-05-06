const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database sementara
let userData = {
  nama: "Sarah Aliyah",
  saldo: 25000,
  statusPinjam: "selesai",
  pinjaman: null
};

// Endpoint Check User
app.get('/api/user', (req, res) => {
  res.json(userData);
});

// Endpoint Pinjam
app.post('/api/pinjam', (req, res) => {
  const { stationId } = req.body;
  if (userData.statusPinjam === "aktif") {
    return res.status(400).json({ message: "Kamu masih meminjam payung!" });
  }
  if (userData.saldo < 3000) {
    return res.status(400).json({ message: "Saldo minimal Rp 3.000 untuk pinjam." });
  }

  userData.statusPinjam = "aktif";
  userData.pinjaman = { idPayung: "PYG-8821", lokasiAmbil: stationId };
  res.json({ message: "Berhasil! Silakan ambil payung.", data: userData });
});

// Endpoint Kembali
app.post('/api/kembali', (req, res) => {
  if (userData.statusPinjam === "selesai") {
    return res.status(400).json({ message: "Tidak ada peminjaman aktif." });
  }
  userData.saldo -= 3000;
  userData.statusPinjam = "selesai";
  userData.pinjaman = null;
  res.json({ message: "Payung dikembalikan. Saldo terpotong Rp 3.000", saldoBaru: userData.saldo });
});

// Ekspor app untuk Vercel
module.exports = app;
