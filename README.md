
# Shorty: Modern URL Shortener

Welcome to Shorty, a modern URL shortener designed to secure your links with passwords, set expirations, and keep everything organized in one place. Shorten smartly with Shorty!

## Overview
Shorty is a full-stack application that provides advanced features for URL shortening while ensuring security and scalability. Key features include:
- Password-protected short URLs.
- Expiry settings for links.
- Custom authentication system (no third-party login).
- Spam-proof sign-up system.

### Technologies Used
**Frontend:**
- Shadcn for styling.
- React Query for efficient data caching.

**Backend:**
- Node.js and Express for server-side logic.
- Arject for seamless performance and security.

---

## Getting Started

### Steps to Run the Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Steps to Run the Backend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm start
   ```

---

## Environment Variables in backend
Create a `.env` file in the root directory and include the following variables:
```env
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=your_arcjet_environment
GMAIL_PASS=your_gmail_password
EMAIL_USER=your_email_user
MONGO_URL=your_mongodb_connection_url
```
These variables are required for the project to function properly.

---

## Features
- **Sign Up:** Users can create an account.
- **Login:** Users can log in with their credentials.
- **Password Reset:** Users can reset their password securely.
- **Short URL Creation:**
  - Add password protection for enhanced security.
  - Set an expiration date for temporary links.

---

## by mordenwendev(mordenwebdeveloper@gmail.com)

