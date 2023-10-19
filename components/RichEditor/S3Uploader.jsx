
// const S3Uploader = ({ loader }) => {
//     const draft = useAppSelector((state) => state.draft);
//     const upload = async () => {
//         const data = await loader.file;

//         const reqUpPresignedUrl = await fetch('https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-image', {
//             method: 'POST',
//             body: JSON.stringify({
//                 postSlug: draft.slug,
//                 fileName: draft.slug + `.${data.type.split('/')[1]}`,
//                 fileType: data.type,
//             }),
//         });
//         const reqData = await reqUpPresignedUrl.json();
//         const { presignedUrl, key} = JSON.parse(reqData.body);

//         // Upload draft image to presigned Url
//         const uploadImage = await fetch(presignedUrl.presignedUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': data.type,
//             },
//             body: data
//         })

//         // Getting draft image from presigned Url
//         const getDraftImage = await fetch('https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
//             method: 'GET',
//             body: JSON.stringify({
//                 key: key
//             }),
//         });
//         const getData = await getDraftImage.json();
//         const imageUrl = getData.presignedUrl;
//         return {
//             default: imageUrl
//         }
//     }
//     console.log("Upload function created");
//     return upload;
// }


class S3Uploader {
    constructor(loader) {
        this.loader = loader;
    }
    
    async upload() {
        const data = await this.loader.file;
        const reqUpPresignedUrl = await fetch('https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-image', {
            method: 'POST',
            body: JSON.stringify({
                fileName: data.name,
                fileType: data.type,
            }),
        });
        const reqData = await reqUpPresignedUrl.json();
        const presignedUrl = reqData.presignedUrl;
        const key = reqData.key;

        // Upload draft image to presigned Url
        const uploadImage = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': data.type,
            },
            body: data,
        });

        if (uploadImage.status === 200) {
            // Getting draft image from presigned Url
            const getDraftImage = await fetch('https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
                method: 'POST',
                body: JSON.stringify({
                    key: key,
                }),
            });
            const getData = await getDraftImage.json();
            const presignedUrl = getData.presignedUrl;
            return {
                default: presignedUrl,
            };
        }
    }
}
export default S3Uploader