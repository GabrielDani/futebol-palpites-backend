import GroupService from "../services/GroupService.js";
import { checkSchema } from "../utils/validationUtils.js";
import {
  createGroupSchema,
  groupIdSchema,
} from "../validations/groupValidation.js";

class GroupController {
  createGroup = async (req, res, next) => {
    try {
      const { name, isPublic } = checkSchema(req.body, createGroupSchema);
      const group = await GroupService.createGroup(name, isPublic, req.user.id);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  };

  getAllGroups = async (req, res, next) => {
    const userId = req.user.id;
    try {
      const groups = await GroupService.getAllGroups(userId);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  joinGroup = async (req, res, next) => {
    try {
      const groupId = checkSchema(req.params.groupId, groupIdSchema);
      await GroupService.joinGroup(groupId, req.user.id);
      res.status(200).json({ message: "Entrou no grupo com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  leaveGroup = async (req, res, next) => {
    try {
      const groupId = checkSchema(req.params.groupId, groupIdSchema);
      await GroupService.leaveGroup(groupId, req.user.id);
      res.status(200).json({ message: "Saiu do grupo com sucesso. " });
    } catch (error) {
      next(error);
    }
  };

  deleteGroup = async (req, res, next) => {
    try {
      const groupId = checkSchema(req.params.groupId, groupIdSchema);
      await GroupService.deleteGroup(groupId, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new GroupController();
