import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
let isConnected = null;

export const connectToDatabase = async () => {

    if (isConnected == null){
        console.log('=> using new database connection')
        return mongoose.connect(process.env.DB)
        .then(db => { 
            isConnected = db.connections[0].readyState;
        });
        await isConnected; 
    }
    console.log('=> using existing database connection');
    return Promise.resolve();
}
