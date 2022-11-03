'use strict';
import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import dotenv from '/opt/nodejs/node_modules/dotenv/lib/main.js'
dotenv.config({ path: '../variables.env' });

export const update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Post.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(post => callback(null, {
          statusCode: 200,
          body: JSON.stringify(post)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not update the post.'
        }));
    });
};