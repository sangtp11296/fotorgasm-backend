
// const S3Uploader = ({ loader }) => {
//     const draft = useAppSelector((state) => state.draft);
//     const upload = async () => {
//         const data = await loader.file;

//         const reqUpPresignedUrl = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-image', {
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
//         const getDraftImage = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
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
    constructor(loader, draftData) {
        this.loader = loader;
        this.draft = draftData;
    }

    async upload() {
        const data = await this.loader.file;
        console.log(this.draft.slug)

        const reqUpPresignedUrl = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-image', {
            method: 'POST',
            body: JSON.stringify({
                postSlug: this.draft.slug,
                fileName: this.draft.slug + `.${data.type.split('/')[1]}`,
                fileType: data.type,
            }),
        });
        const reqData = await reqUpPresignedUrl.json();
        const { presignedUrl, key} = JSON.parse(reqData.body);
        console.log(presignedUrl);
        console.log(key)

        // Upload draft image to presigned Url
        const uploadImage = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': data.type,
            },
            body: data,
        });

        // if (uploadImage.res.status === 200) {
        //     // Getting draft image from presigned Url
        //     const getDraftImage = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             key: key,
        //         }),
        //     });
        //     const getData = await getDraftImage.json();
        //     const imageUrl = getData.presignedUrl;
        //     return {
        //         default: imageUrl,
        //     };
        // }
    }
}
export default S3Uploader