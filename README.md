# Tourist Destination App (MERN Stack)

A premium, full-stack tourist destination application featuring modern design, interactive maps, and complete destination management.

## 🏗️ Project Structure
- `client/`: React frontend (Vite + Tailwind CSS)
- `server/`: Node.js + Express backend

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### 2. Environment Setup
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 3. Installation
From the root directory, run:
```bash
npm run install-all
```

### 4. Seed Database (Optional)
To populate the database with sample destinations:
```bash
cd server
node seeds.js
```

### 5. Run Application
From the root directory:
```bash
npm run dev
```

## ✨ Key Features
- **Modern UI**: Built with Tailwind CSS and Framer Motion for a premium feel.
- **Interactive Maps**: Destinations displayed using Leaflet.js.
- **Smart Filtering**: Filter by category, rating, or search by keyword.
- **Auth System**: Secure JWT authentication with role-based access (User/Admin).
- **Admin Dashboard**: Full CRUD functionality for destinations.
- **Reviews**: Guest reviews with star ratings.
- **Image Uploads**: Direct upload to Cloudinary.

## 📦 Tech Stack
- **Frontend**: React, Redux Toolkit, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js, Express, Mongoose, Multer, Cloudinary, JWT.
- **Database**: MongoDB.
