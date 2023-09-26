import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Quote} from '/opt/nodejs/database/models/Quotes.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'


export const createQuote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
    const data = JSON.parse(event.body);
    console.log(data)
    try {
        // Save each quote in the quotes array to the database
        for (const quote of data) {
            // Check if a quote with the same content already exists in the database
            const existingQuote = await Quote.findOne({
              author: quote.author,
              quote: quote.quote,
            });
      
            if (!existingQuote) {
              const newQuote = new Quote({
                author: quote.author,
                quote: quote.quote,
              });
              await newQuote.save();
            }
          }

        console.log('Quotes saved to the database successfully.');
        return Responses._200 ({
            message: 'New quotes created successfully',
        })
    } catch (error) {
        console.error('Error saving quotes to the database:', error);
        return Responses._500 ({
            message: 'Error creating post', 
            error: error.message 
        })
    }
};