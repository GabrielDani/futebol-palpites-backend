import GroupService from "../services/GroupService.js";
import {
  createGroupSchema,
  groupIdSchema,
} from "../validations/groupValidation.js";

class GroupController {
  async createGroup(req, res) {
    const { name, isPublic } = req.body;
    const userId = req.user.id;

    const validation = createGroupSchema.safeParse({ name, isPublic });

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      const group = await GroupService.createGroup(name, isPublic, userId);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllGroups(req, res) {
    const userId = req.user.id;

    try {
      const groups = await GroupService.getAllGroups(userId);
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async joinGroup(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;

    const validation = groupIdSchema.safeParse(groupId);
    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      await GroupService.joinGroup(groupId, userId);
      res.status(200).json({ message: "Entrou no grupo com sucesso." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async leaveGroup(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;

    const validation = groupIdSchema.safeParse(groupId);
    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      await GroupService.leaveGroup(groupId, userId);
      res.status(200).json({ message: "Saiu do grupo com sucesso. " });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteGroup(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;

    const validation = groupIdSchema.safeParse(groupId);
    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      await GroupService.deleteGroup(groupId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new GroupController();
