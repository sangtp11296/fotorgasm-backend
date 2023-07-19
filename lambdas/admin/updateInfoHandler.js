import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import bcrypt from 'bcryptjs'

export const updateInfoHandler = async (event, context, callback) => {
  console.log(event);
  const req = JSON.parse(event.body);
  console.log(req);
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase()
    .then(() => {
      User.findByIdAndUpdate(event.body.userID, JSON.parse(event.body), { new: true })
        .then(user => callback(null, {
          statusCode: 200,
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not update the user.'
        }));
    });
};