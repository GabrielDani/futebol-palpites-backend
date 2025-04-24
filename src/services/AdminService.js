import prisma from "../repositories/prisma.js";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

class AdminService {
  async getDashboardMetrics() {
    try {
      return await prisma.$transaction(async (tx) => {
        const now = new Date();
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);
        const lastWeekStart = subDays(now, 7);

        const [todayMatches, usersCount, lastWeekUsersCount, teamsCount] =
          await Promise.all([
            tx.match.count({
              where: { date: { gte: todayStart, lte: todayEnd } },
            }),
            tx.user.count(),
            tx.user.count({
              where: {
                createdAt: {
                  gte: lastWeekStart,
                  lt: todayStart,
                },
              },
            }),
            tx.team.count(),
          ]);

        return {
          todayMatches,
          usersCount: {
            actual: usersCount,
            changeFromLastWeek: usersCount - lastWeekUsersCount,
          },
          teamsCount,
        };
      });
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
      handlePrismaError(error);
      // throw error;
    }
  }
}

export default new AdminService();
