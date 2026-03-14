const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/user');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const projectExists = await Project.exists({ _id: req.body.projectId });
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.body.assignedUserId) {
      const assignedUserExists = await User.exists({ _id: req.body.assignedUserId });
      if (!assignedUserExists) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
      assignedUserId: req.body.assignedUserId || null
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.projectId) {
      const projectExists = await Project.exists({ _id: req.body.projectId });
      if (!projectExists) {
        return res.status(404).json({ message: 'Project not found' });
      }
      task.projectId = req.body.projectId;
    }

    if (req.body.assignedUserId !== undefined) {
      if (req.body.assignedUserId === null) {
        task.assignedUserId = null;
      } else {
        const assignedUserExists = await User.exists({ _id: req.body.assignedUserId });
        if (!assignedUserExists) {
          return res.status(404).json({ message: 'Assigned user not found' });
        }
        task.assignedUserId = req.body.assignedUserId;
      }
    }

    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      task.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      task.status = req.body.status;
    }

    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    }

    if (req.body.dueDate !== undefined) {
      task.dueDate = req.body.dueDate;
    }

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
