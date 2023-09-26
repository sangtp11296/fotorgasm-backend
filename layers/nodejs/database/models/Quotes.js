import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
    author:{
        type: String,
        required: true
    },
    quote:{
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true});

const Quote = mongoose.model('Quote', QuoteSchema);
export { Quote }
