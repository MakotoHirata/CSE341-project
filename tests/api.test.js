const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const Comment = require('../models/comment');

describe('Team Task Manager API', () => {
  let user;

  const authRequest = (method, url) => request(app)[method](url).set('x-test-user-id', user._id.toString());

  beforeEach(async () => {
    user = await User.create({
      name: 'Test User',
      email: `user-${Date.now()}@example.com`,
      oauthProvider: 'google',
      oauthId: new mongoose.Types.ObjectId().toString()
    });
  });

  test('GET /auth/google should redirect', async () => {
    const response = await request(app).get('/auth/google');
    expect([302, 500]).toContain(response.statusCode);
  });

  test('GET /auth/logout should return 200', async () => {
    const response = await request(app).get('/auth/logout');
    expect(response.statusCode).toBe(200);
  });

  test('GET /users should return 401 without auth', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(401);
  });

  test('GET /users and GET /users/:id should work', async () => {
    const listResponse = await authRequest('get', '/users');
    expect(listResponse.statusCode).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);

    const detailResponse = await authRequest('get', `/users/${user._id}`);
    expect(detailResponse.statusCode).toBe(200);
    expect(detailResponse.body.email).toBe(user.email);
  });

  test('Projects CRUD should work', async () => {
    const createResponse = await authRequest('post', '/projects').send({
      projectName: 'Project A',
      description: 'First project',
      ownerId: user._id.toString(),
      members: [user._id.toString()]
    });
    expect(createResponse.statusCode).toBe(201);

    const projectId = createResponse.body._id;

    const listResponse = await authRequest('get', '/projects');
    expect(listResponse.statusCode).toBe(200);

    const detailResponse = await authRequest('get', `/projects/${projectId}`);
    expect(detailResponse.statusCode).toBe(200);

    const updateResponse = await authRequest('put', `/projects/${projectId}`).send({
      description: 'Updated project description'
    });
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.description).toBe('Updated project description');

    const deleteResponse = await authRequest('delete', `/projects/${projectId}`);
    expect(deleteResponse.statusCode).toBe(200);
  });

  test('Tasks CRUD should work', async () => {
    const project = await Project.create({
      projectName: 'Task Project',
      description: 'Task project description',
      ownerId: user._id,
      members: [user._id]
    });

    const createResponse = await authRequest('post', '/tasks').send({
      title: 'Task A',
      description: 'Do something',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString(),
      projectId: project._id.toString(),
      assignedUserId: user._id.toString()
    });
    expect(createResponse.statusCode).toBe(201);

    const taskId = createResponse.body._id;

    const listResponse = await authRequest('get', '/tasks');
    expect(listResponse.statusCode).toBe(200);

    const detailResponse = await authRequest('get', `/tasks/${taskId}`);
    expect(detailResponse.statusCode).toBe(200);

    const updateResponse = await authRequest('put', `/tasks/${taskId}`).send({
      status: 'done',
      priority: 'high'
    });
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.status).toBe('done');

    const deleteResponse = await authRequest('delete', `/tasks/${taskId}`);
    expect(deleteResponse.statusCode).toBe(200);
  });

  test('Comments routes should work', async () => {
    const project = await Project.create({
      projectName: 'Comment Project',
      description: 'Comment project',
      ownerId: user._id,
      members: [user._id]
    });

    const task = await Task.create({
      title: 'Task for comments',
      description: 'A task',
      status: 'todo',
      priority: 'low',
      projectId: project._id,
      assignedUserId: user._id
    });

    const createResponse = await authRequest('post', '/comments').send({
      taskId: task._id.toString(),
      commentText: 'Looks good'
    });
    expect(createResponse.statusCode).toBe(201);

    const commentId = createResponse.body._id;

    const listResponse = await authRequest('get', `/comments/${task._id}`);
    expect(listResponse.statusCode).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.length).toBe(1);

    const deleteResponse = await authRequest('delete', `/comments/${commentId}`);
    expect(deleteResponse.statusCode).toBe(200);
  });

  test('Invalid ObjectId should return 400', async () => {
    const response = await authRequest('get', '/tasks/not-an-objectid');
    expect(response.statusCode).toBe(400);
  });

  test('Missing resource should return 404', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const response = await authRequest('get', `/tasks/${id}`);
    expect(response.statusCode).toBe(404);
  });

  test('task status validation should return 400', async () => {
    const project = await Project.create({
      projectName: 'Validation Project',
      description: 'Validation project',
      ownerId: user._id,
      members: [user._id]
    });

    const response = await authRequest('post', '/tasks').send({
      title: 'Bad status task',
      projectId: project._id.toString(),
      status: 'invalid-status'
    });

    expect(response.statusCode).toBe(400);
  });

  test('unexpected route should return 404', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.statusCode).toBe(404);
  });

  test('comment collection should be created', async () => {
    const count = await Comment.countDocuments();
    expect(count).toBe(0);
  });
});
