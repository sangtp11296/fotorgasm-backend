import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'


export const updateMemberHandler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  try{
    const req = JSON.parse(event.body);
    const user = await User.findById(req.userID);
    if (user && req.name && req.role){
      // Add the new team member to the user's team
        const memberID = { 'team._id': req.memberID};
        const updateMemberInfo = {
            'team.$.name': req.name,
            'team.$.role': req.role.split(',').map(role => role.trim()),
        }
        const updatedMember = await User.updateOne(
            memberID,
            { $set: {
                updateMemberInfo
            }},
            {new: true}
        );
        if(updatedMember) {
            console.log('Team member info is uploaded successfully!', updatedMember);
        }
        
        return Responses._200({ newMember: JSON.stringify(updatedMember)});
        } else {
        console.log('User not found!');
        return Responses._500({ message: 'User not found!'});
    }
  } catch (err){
    console.log('Member info cannot be updated!', err)
    return Responses._500({ message: 'Fail to updated member info! ' + err});
  }
}