const Comment = require('../models/comment');
const Task = require('../models/task');

exports.getCommentsByTaskId = async (req, res, next) => {
  try {
    const taskExists = await Task.exists({ _id: req.params.taskId });
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comments = await Comment.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const taskExists = await Task.exists({ _id: req.body.taskId });

    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    const comment = await Comment.create({
      taskId: req.body.taskId,
      userId: req.user._id,
      commentText: req.body.commentText
    });

    return res.status(201).json(comment);
  } catch (error) {
    return next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.commentText = req.body.commentText;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
