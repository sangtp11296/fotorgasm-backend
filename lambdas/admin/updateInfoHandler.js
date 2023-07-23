import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

export const updateInfoHandler = async (event, context, callback) => {
  const req = JSON.parse(event.body);
  if(event.pathParameters.id === req.userID){
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try{
      const res = await User.findByIdAndUpdate(
        req.userID,
        { $set: req }, 
        { new: true }
      );
      if (res){
        console.log('User updated!', res);
        return Responses._200({ message: JSON.stringify(res)});
      } else {
        console.log('User not found!')
      }
    } catch (err){
      console.log('User cannot be updated!', err)
      return Responses._500({ message: 'Fail to update User information! ' + err});
    }
  } else {
    return Responses._503({ message: 'Authorization Fail!' });
  }
};