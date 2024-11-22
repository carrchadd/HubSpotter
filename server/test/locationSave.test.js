const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');
const Location = require('../models/locationModel');

require('dotenv').config();

describe('Saving location and inserting to user savedLocations', () => {
  let userId;
  let email = '';
  let password = '';

  beforeAll(async () => {
    server = app.listen(0);
    PORT = server.address().port;
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteOne({email: 'john@example.com'});

    const mockUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: 'John',
      email: 'john@example.com',
      password: '123',
      defaultLocation: '123 Test St',
    });
    await mockUser.save();
    userId = mockUser._id;
    email = mockUser.email;
    password = '123';
  });

  afterAll(async () => {
    await User.deleteOne({email: 'john@example.com'});
    await Location.deleteOne({name: 'Test Place'});
    await mongoose.connection.close();
  });

  it('should save a location and add it to the user\'s saved locations', async () => {

    const logInUser = await fetch(`http://localhost:${PORT}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
             email, 
             password }),
      });
    
    const { token } = await logInUser.json();
    jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValue({ id: userId });

    const mockLocation = {
      name: 'Test Place',
      address: '123 Test St',
      rating: 5,
      phone: '123-456-7890',
      website: 'https://test.com',
      placeId: 'testplaceid',
    };

    const response = await request(app)
      .post('/location/save')
      .set('Authorization', `Bearer ${token}`)
      .send(mockLocation);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Location saved and added to user');

    const savedLocation = await Location.findOne({ name: 'Test Place' });
    expect(savedLocation).toBeTruthy();
    expect(savedLocation.address).toBe(mockLocation.address);

    const user = await User.findById(userId);
    expect(user.savedLocations).toContainEqual(savedLocation._id);
  });
});
