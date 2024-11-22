const e = require('express');
const {MongoClient} = require('mongodb');

require('dotenv').config();

describe('Inserting feedback document into MongoDB', () => {
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

  afterEach(async () => {
    const feedbacks = db.collection('feedbacks');
    await feedbacks.deleteOne({_id: 'some-feedback-id'});
  });

  it('should insert a doc into collection', async () => {
    const feedbacks = db.collection('feedbacks');

    const mockFeeback = {
        _id: 'some-feedback-id',
        rating: 3,
        feedback:'some feedback should be here',
    };
    
    await feedbacks.insertOne(mockFeeback);

    const insertedFeedback = await feedbacks.findOne({_id: 'some-feedback-id'});
    expect(insertedFeedback).toEqual(mockFeeback);
  });
});