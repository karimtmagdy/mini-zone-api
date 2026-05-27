// export class AuthController {

//   /**
//    * Request password reset
//    * 🔄 يستخدم JwtUtil + EmailService
//    */
//   static async requestPasswordReset(
//     req: Request,
//     res: Response
//   ): Promise<void> {
//     try {
//       const { email } = req.body;

//       if (!email) {
//         res.status(400).json({ error: "Email is required" });
//         return;
//       }

//   static async logout(req: Request, res: Response): Promise<void> {
//     try {
//       const { refreshToken } = req.body;

//       if (!refreshToken) {
//         res.status(400).json({ error: "Refresh token is required" });
//         return;
//       }

//       const revoked = await AuthService.logout(refreshToken);

//       res.json({
//         message: revoked ? "Logout successful" : "Token not found",
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: error instanceof Error ? error.message : "Logout failed",
//       });
//     }
//   }
