const Task = require('../models/task');

// GET tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST tasks
exports.createTask = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task(req.body);
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { title, description, priority, status, completed, isArchived } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) {
      if (!['low','medium','high'].includes(priority))
        return res.status(400).json({ message: 'Invalid priority' });
      task.priority = priority;
    }
    if (status !== undefined) {
      if (!['todo','doing','done'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });
      task.status = status;
    }
    if (completed !== undefined) task.completed = completed;
    if (isArchived !== undefined) task.isArchived = isArchived;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};