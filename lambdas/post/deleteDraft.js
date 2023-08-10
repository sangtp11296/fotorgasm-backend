import { S3Client, ListObjectsV2Command, DeleteObjectsCommand  } from '@aws-sdk/client-s3';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';


// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmImagesUploadBucket;
const folderKey = `draft/`;

export const deleteDraft = async (event) => {
    try{
        
        const listParams = {
            Bucket: uploadBucket,
            Prefix: folderKey
        }
        const listCommand = await s3.send(new ListObjectsV2Command(listParams));
        
        if (listCommand.length === 0) {
            return Responses._200({
                message: 'Folder is empty already!'
            })
        }
        const listedObjects = listCommand.Contents.map(obj => ({
            Key: obj.Key
        }));
        const deleteParams = {
            Bucket: uploadBucket,
            Delete: {
                Objects: listedObjects,
            }
        }

        await s3.send(new DeleteObjectsCommand(deleteParams))
        return Responses._200({
            message: 'Objects in folder deleted successfully!'
        })
    } catch (err) {
        console.log(err);
        return Responses._500({
            error: 'Error deleting objects ' + err
        })
    };
};
