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

### 🏷️ Brands (`/brands`)
- Full **CRUD** operations for Brands.
- Includes support for Soft Delete and Restore operations.

### 🗂️ Categories (`/categories`) & Subcategories (`/subcategories`)
- Full **CRUD** operations for Categories and Subcategories.
- Includes support for Soft Delete and Restore operations.
