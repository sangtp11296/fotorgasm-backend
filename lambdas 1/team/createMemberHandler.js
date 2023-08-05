import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'


export const createMemberHandler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  try{
    const req = JSON.parse(event.body);
    const user = await User.findById(req.userID);
    if (user && req.name && req.role){
      // Add the new team member to the user's team
      const newTeamMember = {
        name: req.name,
        role: req.role.split(',').map(role => role.trim()),
      }
      user.team.push(newTeamMember);

      // Save the updated user to the database
      await user.save();

      // Retrieve the newly added team member's information
      const addedTeamMemberIndex = user.team.findIndex(member => member.name === newTeamMember.name && JSON.stringify(member.role) === JSON.stringify(newTeamMember.role));
      // Retrieve the newly added team member's information using the index
      const addedTeamMember = user.team[addedTeamMemberIndex];
      
      console.log('Team member info is added successfully!', addedTeamMember);
      return Responses._200({ newMember: JSON.stringify(addedTeamMember)});
    } else {
      console.log('User not found!');
      return Responses._500({ message: 'User not found!'});
    }
  } catch (err){
    console.log('Member cannot be created!', err)
    return Responses._500({ message: 'Fail to create team member! ' + err});
  }
}