const Project = require('../models/project');
const User = require('../models/user');

async function usersExist(userIds) {
  if (!userIds || userIds.length === 0) {
    return true;
  }

  const uniqueIds = [...new Set(userIds.map((id) => String(id)))];
  const count = await User.countDocuments({ _id: { $in: uniqueIds } });
  return count === uniqueIds.length;
}

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    return next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (error) {
    return next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const ownerId = req.body.ownerId || req.user?._id;

    if (!ownerId) {
      return res.status(400).json({ message: 'ownerId is required' });
    }

    const ownerExists = await User.exists({ _id: ownerId });
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner user not found' });
    }

    if (!(await usersExist(req.body.members || []))) {
      return res.status(404).json({ message: 'One or more members were not found' });
    }

    const project = await Project.create({
      projectName: req.body.projectName,
      description: req.body.description || '',
      ownerId,
      members: req.body.members || []
    });

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.body.ownerId) {
      const ownerExists = await User.exists({ _id: req.body.ownerId });
      if (!ownerExists) {
        return res.status(404).json({ message: 'Owner user not found' });
      }
      project.ownerId = req.body.ownerId;
    }

    if (req.body.members) {
      if (!(await usersExist(req.body.members))) {
        return res.status(404).json({ message: 'One or more members were not found' });
      }
      project.members = req.body.members;
    }

    if (req.body.projectName !== undefined) {
      project.projectName = req.body.projectName;
    }

    if (req.body.description !== undefined) {
      project.description = req.body.description;
    }

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
