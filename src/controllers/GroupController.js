import GroupService from "../services/GroupService.js";

class GroupController {
  createGroup = async (req, res, next) => {
    try {
      const group = await GroupService.createGroup(req.user.id, req.body);
      res.status(201).json(group);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllGroups = async (req, res, next) => {
    try {
      const groups = await GroupService.getAllGroups(req.user.id);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  getPublicGroups = async (req, res, next) => {
    try {
      const groups = await GroupService.getPublicGroups();
      console.log("[GroupController][getPublicGroups] Grupos:", groups);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  getPrivateGroups = async (req, res, next) => {
    try {
      const groups = await GroupService.getPrivateGroups();
      console.log("[GroupController][getPrivateGroups] Grupos:", groups);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  getMyGroups = async (req, res, next) => {
    try {
      const groups = await GroupService.getMyGroups(req.user.id);
      console.log("[GroupController][getMyGroups] Grupos:", groups);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  getGroupDetails = async (req, res, next) => {
    try {
      const details = await GroupService.getGroupDetails(req.params.groupId);
      console.log("[GroupController][getGroupDetails] Grupo:", details);
      res.status(200).json(details);
    } catch (error) {
      next(error);
    }
  };

  joinGroup = async (req, res, next) => {
    try {
      await GroupService.joinGroup(req.params.groupId, req.user.id);
      res.status(200).json({ message: "Entrou no grupo com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  leaveGroup = async (req, res, next) => {
    try {
      await GroupService.leaveGroup(req.params.groupId, req.user.id);
      res.status(200).json({ message: "Saiu do grupo com sucesso. " });
    } catch (error) {
      next(error);
    }
  };

  deleteGroup = async (req, res, next) => {
    try {
      await GroupService.deleteGroup(req.params.groupId, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new GroupController();
