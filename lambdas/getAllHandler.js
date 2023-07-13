import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

export const getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Post.find()
        .then(posts => callback(null, {
          statusCode: 200,
          body: JSON.stringify(posts)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the posts.'
        }))
    });
}