import {Responses} from './common/API_Responses'
import * as fileType from '/opt/nodejs/node_modules/file-type/index.js'
import {v4 as uuid} from '/opt/nodejs/node_modules/uuid/dist/index.js'
import * as AWS from '/opt/nodejs/node_modules/aws-sdk/index.js'

const s3 = new AWS.S3();

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

exports.handler = async event => {
    try {
        const body = JSON.parse(event.body)

        if (!body || !body.image || !body.mine) {
            return Responses._400({ message: 'Incorrect body on request' });
        }

        if (!allowedMimes.includes(body.mime)) {
            return Responses._400({ message: 'mime is not allowed' })
        }

        let imageData = body.image;
        if (body.image.substr(0,7) === 'base64,') {
            imageData = body.image.substr(7, body.image.length)
        }

        const buffer = Buffer.from(imageData, 'base64');
        const fileInfo = await fileType.fromBuffer(buffer)
        const detectedExt = fileInfo.ext;
        const dectectedMime = fileInfo.mime;
        
        if (dectectedMime !== body.mime) {
            return Responses._400({ message: 'mime types dont match' })
        }

        const name = uuid();
        const key = `${name}.${detectedExt}`;

        console.log(`writing image to bucket called ${key}`)

        await s3.putObject({
            Body: buffer,
            Key: key,
            ContentType: body.mime,
            Bucket: process.env.fotorgasmImageUploadBucket,
            ACL: 'public-read',
        }).promise();

        const url = `https://${process.env.fotorgasmImageUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;
        return Responses._200({
            imageURL: url
        })
    } catch (err){
        console.log('error: ', err)
        return Responses._400({ message: err.message || 'failed to upload image' })
    }
}