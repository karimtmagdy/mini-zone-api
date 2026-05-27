import { Brand } from "../../models/brand.model";
import { logger } from "../lib/logger.js";

export class BrandCleanupService {
  /**
   * مسح الـ Brands المحذوفة (Soft Delete) اللي عدى عليها أكتر من المدة المحددة
   * @param daysOld عدد الأيام (default: 30)
   * @returns عدد الـ records اللي اتمسحت
   */
  async cleanupOldDeletedBrands(daysOld: number = 30): Promise<number> {
    try {
      // حساب التاريخ القديم
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // مسح كل الـ brands اللي deletedAt أقدم من التاريخ ده
      const result = await Brand.deleteMany({
        deletedAt: { $ne: null, $lt: cutoffDate },
      });

      const deletedCount = result.deletedCount || 0;

      if (deletedCount > 0) {
        logger.log(
          `🗑️  Cleanup: Permanently deleted ${deletedCount} brand(s) older than ${daysOld} days`,
        );
      }

      return deletedCount;
    } catch (error) {
      logger.error("❌ Error during brand cleanup:", error);
      throw error;
    }
  }

  /**
   * جلب عدد الـ Brands المحذوفة اللي مستنية المسح
   * @param daysOld عدد الأيام (default: 30)
   * @returns عدد الـ brands المحذوفة القديمة
   */
  async countOldDeletedBrands(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await Brand.countDocuments({
      deletedAt: { $ne: null, $lt: cutoffDate },
    });
  }
}

export const brandCleanupService = new BrandCleanupService();
