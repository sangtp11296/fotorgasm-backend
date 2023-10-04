import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Team } from '/opt/nodejs/database/models/Team.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'


export const getMembers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  try{
    const { teamName } = event.queryStringParameters;
    const teamMembers = await Team.find({ teamName });

    console.log('Team members are gotten successfully!', teamMembers);
    return Responses._200({ teamMembers: teamMembers});
  } catch (err){
    console.log('Members cannot be created!', err)
    return Responses._500({ message: 'Fail to get team members! ' + err});
  }
}
export const getMember = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  try{
    const { authorName } = event.queryStringParameters;
    const author = await Team.findOne({ name: authorName });

    console.log('Author are gotten successfully!', author);
    return Responses._200({ author: author});
  } catch (err){
    console.log('Member cannot be gotten!', err)
    return Responses._500({ message: 'Fail to get team member! ' + err});
  }
}