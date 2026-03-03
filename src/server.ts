// import express from "express";
// import { GlobalErrorHandler } from "./global/GlobalErrorHandler";
// const app = express();
// const PORT = 8000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("<h1></h1>");
// });
// GlobalErrorHandler(app);
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// export { app };
// // {
// //   "version": 2,
// //   "builds": [{ "src": "dist/server.js", "use": "@vercel/node" }],
// //   "routes": [{ "src": "/(.*)", "dest": "dist/server.js" }],
// //   "crons": [{ "path": "/src/index.ts", "schedule": "0 10 * * *" }]
// // }
