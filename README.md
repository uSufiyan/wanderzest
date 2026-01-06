# WanderZest — Full-Stack Property Listing Platform

WanderZest is a production-oriented full-stack web application that demonstrates real-world backend engineering concepts including authentication, authorization, image lifecycle management, geospatial data handling, and production deployment.

The project prioritizes backend correctness, secure resource ownership, and clear system design over visual polish.

---

## 🧭 Overview

WanderZest allows users to browse, create, and manage property listings with image uploads, map-based locations, and reviews.

The application follows a clean MVC architecture, uses server-side rendering with EJS, and implements secure, session-based authentication.

---

## ✨ Key Features

- User authentication and session management (signup / login / logout)
- Create, edit, and delete property listings with ownership enforcement
- Secure image uploads and storage using Cloudinary
- Location-based listings with Mapbox maps and geocoding
- Search by destination and filter by category
- Reviews and ratings with strict authorization checks
- Role-based access control (only owners can modify/delete resources)
- Persistent UI preferences using localStorage (price before/after tax)

---

## 🛠 Tech Stack

### Backend
- Node.js, Express.js
- MongoDB, Mongoose

### Authentication & Security
- Passport.js
- express-session
- connect-mongo
- Joi validation

### Media & Maps
- Multer, Cloudinary
- Mapbox Geocoding API, Mapbox GL JS

### Frontend
- EJS (server-side rendering)
- Bootstrap, CSS, Vanilla JavaScript

---

## 🧱 System Architecture

The application follows the MVC (Model–View–Controller) pattern:
<p align="center">
  <img 
    src="https://res.cloudinary.com/dixfklr5d/image/upload/v1767696434/IMG_20260106_161609_tw0qit.png"
    alt="System Architecture"
    width="500"
    height="400"
  />
</p>

Requests pass through middleware for cross-cutting concerns, then controllers handle business logic, interact with models for data, and render views or responses back to the client.

---

## 🧠 Engineering Highlights

- Ownership-based authorization enforced at both route and UI levels
- Cascading deletes between listings and reviews to maintain data integrity
- Centralized async error handling to avoid unhandled promise failures
- Environment-isolated configuration for development vs production
- Cloudinary image lifecycle handling (upload and deletion)
- Session persistence using MongoDB-backed session store
  
These decisions were made to mirror real production constraints, not demo shortcuts.

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/uSufiyan/wanderzest.git
cd wanderzest
npm install  #install dependencies
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
```

.env is excluded from version control for security reasons.

---

## ▶️ Running the Application

Start the server (production mode):
```bash
npm start
```
Start the server with auto-reload (development):
```bash
npm run dev
```
Open your browser and visit:
```bash
http://localhost:8080/listings
```

---

## 🚀 Production Notes

- Session-based authentication with MongoDB session store
- Secure handling of secrets via environment variables
- Cloud-hosted image storage
- Deployed on Render with production-ready start scripts

---

## 🌐 Live Demo

   https://wanderzest.onrender.com/listings
