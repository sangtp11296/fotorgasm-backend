import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

export const deletePost = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Post.findByIdAndRemove(event.pathParameters.id)
        .then(post => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed post with id: ' + post._id, post: post })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not delete the post.'
        }));
    });
};