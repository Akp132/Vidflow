# Vidflow

Vidflow is a full-stack video sharing platform built with React (frontend), Express.js (backend), MongoDB, and Cloudinary for media storage. Users can sign up, log in, upload videos, and view a feed of all uploaded videos.

---

## Features

- **User Authentication**: Signup, login, JWT-based authentication, and protected routes.
- **Video Upload**: Authenticated users can upload MP4 videos, which are stored on Cloudinary.
- **Video Feed**: All users can view a feed of uploaded videos with titles, descriptions, and uploader info.
- **Modern UI**: Built with React and Vite for fast development and a clean interface.
- **Security**: Uses Helmet, CORS, rate limiting, and secure password hashing.

---

## Project Structure

```
Vidflow/
├── backend/           # Express.js API server
│   ├── config/        # Cloudinary config
│   ├── middleware/    # Auth and error handling
│   ├── models/        # Mongoose models (User, Video)
│   ├── routes/        # API routes (auth, videos)
│   ├── server.js      # Entry point
│   └── .env           # Backend environment variables
└── frontend/          # React + Vite client
    ├── public/        # Static assets
    ├── src/           # React source code
    │   ├── pages/     # Feed, Login, Signup, Upload
    │   ├── api.js     # Axios instance
    │   └── App.jsx    # Main layout
    ├── index.html     # HTML entry
    ├── .env           # Frontend environment variables
    └── vite.config.js # Vite config
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone the repository
```sh
git clone <repo-url>
cd Vidflow
```

### 2. Backend Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/` (see `.env` example below):
   ```env
   # Mongo
   MONGO_URI=your_mongodb_uri
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=2d
   # Cloudinary
   CLOUD_NAME=your_cloud_name
   CLOUD_API_KEY=your_cloud_api_key
   CLOUD_API_SECRET=your_cloud_api_secret
   ```
3. Start the backend server:
   ```sh
   npm run dev
   # or
   npm start
   ```
   The server runs on `http://localhost:5050` by default.

### 3. Frontend Setup

1. Install dependencies:
   ```sh
   cd ../frontend
   npm install
   ```
2. Create a `.env` file in `frontend/`:
   ```env
   VITE_API=http://localhost:5050/api
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default.

---

## Usage

- **Signup/Login**: Create an account or log in.
- **Upload Video**: Go to the Upload page (must be logged in), select an MP4 file, add a title/description, and upload.
- **Feed**: View all uploaded videos on the Feed page.
- **Logout**: Click the Logout button in the navbar.

---

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get current user profile (JWT required)

### Videos
- `POST /api/videos/upload` — Upload a video (JWT + multipart/form-data)
- `GET /api/videos` — List all videos

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2d
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
```

### Frontend (`frontend/.env`)
```
VITE_API=http://localhost:5050/api
```

---

## Tech Stack
- **Frontend**: React 19, Vite, Axios, React Router
- **Backend**: Express 5, Mongoose, Cloudinary, Multer, JWT
- **Database**: MongoDB Atlas
- **Media Storage**: Cloudinary

---

## Security & Best Practices
- Passwords are hashed with bcryptjs.
- JWT is used for authentication.
- Helmet, CORS, and rate limiting are enabled.
- Centralized error handling for API responses.

---

## License

This project is licensed under the ISC License.

---

## Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Cloudinary](https://cloudinary.com/)

---

## Screenshots

_Add screenshots of the app UI here if desired._

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Troubleshooting
- Ensure MongoDB and Cloudinary credentials are correct.
- Check that both backend and frontend servers are running.
- For CORS or upload issues, verify `.env` and server logs.

---

## Contact

For questions or support, please open an issue on GitHub.
