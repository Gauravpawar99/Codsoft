import express from "express";
import { auth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();
router.use(auth);

// Create project
router.post("/", async (req, res) => {
  const { name, description, members = [] } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  const uniqueMembers = [...new Set([req.user.id, ...members])];
  const project = await Project.create({ name, description, owner: req.user.id, members: uniqueMembers });
  res.status(201).json(project);
});

// List my projects (owner or member)
router.get("/", async (req, res) => {
  const uid = req.user.id;
  const projects = await Project.find({ $or: [{ owner: uid }, { members: uid }] }).sort({ updatedAt: -1 });
  res.json(projects);
});

// Get project + quick stats
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Not found" });

  const uid = req.user.id;
  const isMember = project.owner.toString() === uid || project.members.map(m => m.toString()).includes(uid);
  if (!isMember) return res.status(403).json({ message: "Forbidden" });

  const [total, done, inProg, todo] = await Promise.all([
    Task.countDocuments({ project: id }),
    Task.countDocuments({ project: id, status: "done" }),
    Task.countDocuments({ project: id, status: "in-progress" }),
    Task.countDocuments({ project: id, status: "todo" })
  ]);

  res.json({ project, stats: { total, done, inProg, todo } });
});

// Update project (owner only)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!project) return res.status(404).json({ message: "Not found or not owner" });
  res.json(project);
});

// Delete project (owner only) + cascade delete tasks
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const p = await Project.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!p) return res.status(404).json({ message: "Not found or not owner" });
  await Task.deleteMany({ project: id });
  res.json({ message: "Deleted" });
});

export default router;
