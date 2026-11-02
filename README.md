# GameHaven Backend API

REST API backend untuk aplikasi GameHaven berbasis Express.js, TypeScript, MySQL, dan Cloudinary. Dilengkapi dengan otentikasi JWT dan otorisasi berbasis peran (*role-based access control*).

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript via tsx)
- **Database:** MySQL (mysql2/promise)
- **Authentication:** JWT (jsonwebtoken) & bcrypt
- **File Upload:** Multer (memory storage) & Cloudinary SDK
- **Cross-Origin:** CORS

---

## 🚀 Memulai Proyek

### 1. Install Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilai konfigurasi di dalam file `.env`:
```env
PORT=3000
JWT_SECRET=rahasia_jwt_super_aman

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_database_kamu
DB_DATABASE=db_express

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Skema Database
Pastikan database MySQL memiliki tabel `users` dan `games`:
```sql
CREATE DATABASE IF NOT EXISTS db_express;
USE db_express;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  profile_photo VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  developer VARCHAR(150) NOT NULL,
  rating DECIMAL(3,1) NOT NULL
);
```

### 4. Menjalankan Server (Development)
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`.

---

## 📡 Daftar Endpoint API

### 🔐 Autentikasi
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/register` | Publik | Mendaftarkan akun baru |
| `POST` | `/api/login` | Publik | Login dan mendapatkan Bearer token |

### 👤 Profile
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/profile` | Authenticated | Mengambil data profil user yang login |
| `POST` | `/api/profile/photo` | Authenticated | Upload foto profil ke Cloudinary (maks 2MB) |

### 🎮 Katalog Game (CRUD)
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/games` | Authenticated | Mengambil daftar semua game |
| `POST` | `/api/games` | Admin | Menambahkan game baru |
| `PUT` | `/api/games/:id` | Admin | Mengubah data game berdasarkan ID |
| `DELETE` | `/api/games/:id` | Admin | Menghapus game berdasarkan ID |

### 👥 Manajemen User (Admin Only)
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/users` | Admin | Mengambil seluruh data user |
| `DELETE` | `/api/users/:id` | Admin | Menghapus user berdasarkan ID |

---

## 📄 Lisensi
ISC
