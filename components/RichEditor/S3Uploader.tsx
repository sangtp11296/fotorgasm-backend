import React from 'react'

interface PostMetaData {
    format: string,
    title: string,
    slug: string,
    author: string,
    category: string,
    description: string,
    tags: string[],
}
const S3Uploader: React.FC<{ loader: any, postMetaData: PostMetaData}> = ({ loader, postMetaData }) => {
  const upload = async () => {
    const data = await loader.file;

    const reqPresignedUrl = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
        method: 'POST',
        body: JSON.stringify({
            reqType: 'draft',
            postSlug: postMetaData.slug,
            fileName: postMetaData.slug + `.${data.type.split('/')[1]}`,
            fileType: data.type,
        }),
    });
    const reqData = await reqPresignedUrl.json();
    const presignedUrl = JSON.parse(reqData.body);

    // Upload avatar to presigned Url
    const uploadImage = await fetch(presignedUrl.presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': data.type,
        },
        body: data
    })
  }
}

export default S3Uploader