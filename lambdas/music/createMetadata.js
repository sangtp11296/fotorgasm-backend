import { S3Client,  GetObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import { Album } from '/opt/nodejs/database/models/Album.js';
import * as mm from 'music-metadata'
import util from 'util';


const s3 = new S3Client({ region: process.env.region});

export async function createMetadata (event, context, callback) {

  // Read options from the event parameter and get the source bucket
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  const fileName = srcKey.split('/').pop();
  const tilteName = srcKey.split('/')[1];

  // Connect to the database
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  
  // Get metadata of each song
  try {
    console.log('Get the song from the source bucket.');
    const getObjectParams = {
      Bucket: srcBucket,
      Key: srcKey,
    }
    const getObjectResponse = await s3.send(new GetObjectCommand(getObjectParams));
    // Convert the audio file to an ArrayBuffer
    const arrayBuffer = new Uint8Array(await streamToBuffer(getObjectResponse.Body));
  
    // Parse the metadata
    const metadata = await mm.parseBuffer(arrayBuffer, srcKey);
    const songMetadata = metadata.common;
    console.log('File:', fileName);
    console.log('Metadata:', metadata.common);

    // After getting metadata, push them to Album Schema
    const song = {
      title: songMetadata.title,
      trackNum: songMetadata.track.no,
      artists: songMetadata.artists,
      album: songMetadata.album,
      composers: songMetadata.composer,
      genres: songMetadata.genre,
      year: songMetadata.year,
      date: songMetadata.date,
      picture: songMetadata.picture,
      srcKey: srcKey
    }
    const album = await Album.findOne({title: tilteName});
    if(!album){
      console.log('Cannot find album or album is not existed');
      return
    } else {
      // Push the song object into the songs array
      album.songs.push(song);

      // Save the updated album to the database
      await album.save();

      console.log('Album updated with song metadata:', album);
    }
  } catch (err){
    console.log(err)
    return
  }
}


// Helper function to convert a readable stream to a buffer
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }