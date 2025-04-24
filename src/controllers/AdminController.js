import AdminService from "../services/AdminService.js";

class AdminController {
  getDashboardMetrics = async (req, res, next) => {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminController();
