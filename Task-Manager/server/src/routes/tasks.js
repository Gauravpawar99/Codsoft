import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// All routes here require auth
router.use(auth);

// List tasks with filters
router.get("/", async (req, res) => {
  const { status, priority, q, project, assignee } = req.query;
  const filter = { createdBy: req.user.id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;
  if (assignee) filter.assignee = assignee;
  if (q) filter.title = { $regex: q, $options: "i" };

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create
router.post("/", async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignee } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    project,
    assignee,
    createdBy: req.user.id
  });
  res.status(201).json(task);
});

// Update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted" });
});

export default router;
