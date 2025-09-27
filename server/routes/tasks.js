const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// Create task
router.post('/', protect, async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const task = await Task.create({
    title, description, dueDate, priority,
    assignedTo: assignedTo || req.user._id,
    createdBy: req.user._id
  });
  res.status(201).json(task);
});

// Get tasks (supports pagination, filters)
router.get('/', protect, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  // If not admin, show tasks assigned to user only
  if (req.user.role !== 'admin') filter.assignedTo = req.user._id;

  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.status) filter.status = req.query.status;

  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('assignedTo', 'name email').sort({ dueDate: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filter)
  ]);
  res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
});

// Single task details
router.get('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('createdBy','name email');
  if (!task) return res.status(404).json({ message: 'Not found' });
  // if not admin and not assigned to user, block
  if (req.user.role !== 'admin' && (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString()))
    return res.status(403).json({ message: 'Forbidden' });
  res.json(task);
});

// Update task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });

  const { title, description, dueDate, priority, status, assignedTo } = req.body;
  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.status = status ?? task.status;
  if (assignedTo) task.assignedTo = assignedTo;
  await task.save();
  res.json(task);
});

// Delete task (with confirmation on frontend)
router.delete('/:id', protect, async (req, res) => {
  // only creator or admin can delete
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Update status (toggle)
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  task.status = status || task.status;
  await task.save();
  res.json(task);
});

// Update priority (used when moving between lists)
router.patch('/:id/priority', protect, async (req, res) => {
  const { priority } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  task.priority = priority;
  await task.save();
  res.json(task);
});

module.exports = router;
