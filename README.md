# Mini Zone API

Welcome to the **Mini Zone API**! This is the backend service built with Node.js, Express.js, TypeScript, and MongoDB (Mongoose), designed for the Mini Zone application.

## 🚀 Technologies

- **Node.js** & **Express.js**: Core framework for handling HTTP requests.
- **TypeScript**: Typed JavaScript for better code quality and developer experience.
- **MongoDB** & **Mongoose**: NoSQL Database and Object Data Modeling (ODM).
- **JWT (JSON Web Tokens)**: Secure authentication and authorization.
- **Cloudinary**: Cloud-based image and media management.
- **Zod**: Schema validation for API requests.
- **Nodemailer**: Email sending service.

## 📁 API Endpoints

The API is versioned and mounted under the `/api/v1` prefix.

### 🔐 Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user account.
- `POST /login` - Login to account.
- `POST /session/logout` - Logout and clear session.
- `GET /profile` - Get logged-in user profile.
- `GET /verify-email/:token` - Verify user email address.
- `POST /2fa/setup` - Set up Two-Factor Authentication.
- *(Other endpoints for password reset and 2FA verification)*

### 🛒 Products Management (`/api/v1/products`)
- **CRUD Operations**: Create, Read, Update, and Delete products.
- **Soft Deletion**: `DELETE /trash/:id` to soft delete a product.
- **Restore**: `PATCH /restore/:id` to restore a soft-deleted product.
- **Trash**: `GET /trash` to view deleted products.

### 🗂️ Categories (`/api/v1/categories`) & Subcategories (`/api/v1/subcategories`)
- Full **CRUD** operations for Categories and Subcategories.
- Includes support for Soft Delete and Restore operations.

### 🏷️ Brands (`/api/v1/brands`)
- Full **CRUD** operations for Brands.
- Includes support for Soft Delete and Restore operations.

### 📊 Dashboard (`/api/v1/dashboard`)
- Endpoints to retrieve application statistics and dashboard metrics.

### 👤 Profile (`/api/v1/profile`)
- **Update Profile**: Update user details.
- **Account Deletion**: Soft delete or permanently delete account.

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/karimtmagdy/mini-zone-api.git
cd mini-zone-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the `.env.local` or environment template, and set up your variables including:
- MongoDB URI (`ZONE_MONGODB_URI`)
- JWT Secrets
- Cloudinary Credentials
- Nodemailer configurations

### 4. Run the Development Server
```bash
npm run dev
```
The server will start using `nodemon` and automatically restart on file changes.

## ☁️ Deployment (Vercel)

This project is configured to run on Vercel as a Serverless API.

Deploy manually via Vercel CLI:
```bash
npm i -g vercel
vercel build --prod
vercel --prod
```
