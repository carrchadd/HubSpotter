const e = require('express');
const {MongoClient} = require('mongodb');

require('dotenv').config();

describe('Inserting user document into MongoDB', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(process.env.DBNAME);
  });

  afterAll(async () => {
    await connection.close();
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