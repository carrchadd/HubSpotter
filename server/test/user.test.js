const {MongoClient} = require('mongodb');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');

require('dotenv').config();

describe('Inserting user document into MongoDB', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(process.env.DBNAME);

    await users.deleteOne({_id: 'some-user-id'});
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    const users = db.collection('users');
    await users.deleteOne({_id: 'some-user-id'});
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {
        _id: 'some-user-id',
        firstName: 'John',
        username:'john123',
        email: 'j123@gmail.com',
        password: 'john123',
    };
    
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});


describe('Login User Endpoint', () => {
  let userId;
  let email;
  let password;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteOne({ email: 'j123@gmail.com' });
    
    const mockUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: 'John',
      email: 'j123@gmail.com',
      password: '123',
      defaultLocation: '123 Test St',
    });
    await mockUser.save();
    userId = mockUser._id;
    email = mockUser.email;
    password = "123";
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'j123@gmail.com' });
    await mongoose.connection.close();
  });

  it('should login a user with valid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ 
        email, 
        password
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Successfully log in');
    expect(response.body.token).toBeDefined();
  });

  it('should return an error for incorrect credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ 
        email, 
        password: '1234' 
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Incorrect credentials');
  });

  it('should return an error for non-existent user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ 
        email: 'j@example.com', 
        password 
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User not found');
  });
});