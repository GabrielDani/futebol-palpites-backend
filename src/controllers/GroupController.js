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
