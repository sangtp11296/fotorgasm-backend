import React from 'react'

const S3Uploader = ({ loader, postMetaData }) => {
    const upload = async () => {
        const data = await loader.file;

        const reqUpPresignedUrl = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-image', {
            method: 'POST',
            body: JSON.stringify({
                postSlug: postMetaData.slug,
                fileName: postMetaData.slug + `.${data.type.split('/')[1]}`,
                fileType: data.type,
            }),
        });
        const reqData = await reqUpPresignedUrl.json();
        const { presignedUrl, key} = JSON.parse(reqData.body);

        // Upload draft image to presigned Url
        const uploadImage = await fetch(presignedUrl.presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': data.type,
            },
            body: data
        })

        // Getting draft image from presigned Url
        const getDraftImage = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
            method: 'GET',
            body: JSON.stringify({
                key: key
            }),
        });
        const getData = await getDraftImage.json();
        const imageUrl = getData.presignedUrl;
        return {
            default: imageUrl
        }
    }
    return upload;
}

export default S3Uploader