'use client'
import React, { useEffect, useState } from 'react'
import styles from './TeamContainer.module.css'
import { signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/redux/hooks'
import axios from 'axios'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'

type User = {
    id: string;
    avatar: string;
    role: string;
    team: {
        name: string;
        role: string[];
        avatar: string;
        _id: string;
    }[];
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}

const Editor = dynamic(() => import('@/components/RichEditor/RichEditor'), { ssr: false });

const TeamContainer: React.FC = () => {
    const editorMode = useAppSelector((state) => state.draft.toggle);
    const format = useAppSelector((state) => state.draft.format);
    const slug = useAppSelector((state) => state.draft.slug);
    const session = useSession();
    const user: User | undefined = session.data?.user;
    
    // Update or detete existed team member info
    const [funcDot, setFuncdot] = useState<{[key: string]: boolean}>({});
    const [updateID, setUpdateID] = useState<string | null>(null);
    const [updateName, setUpdateName] = useState<string>('');
    const [updateRole, setUpdateRole] = useState<string>('');
    const [updateAvatar, setUpdateAvatar] = useState<File | null>(null);

    const handleUpdateAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0] || null;
        setUpdateAvatar(image);
    }
    const handleUpdateMemberInfo = async (e: React.MouseEvent<HTMLButtonElement>, name: string, role: string[]) => {
        e.preventDefault();
        // Upload team member info first
        try{
            if (name !== updateName || role.join(', ') !== updateRole){
                const res = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/team', {
                    method: 'PUT',
                    body: JSON.stringify({
                        userID: user?.id,
                        memberID: updateID,
                        name: updateName,
                        role: updateRole
                    })
                })
                if (!res.ok) {
                    // Handle any HTTP errors
                    throw new Error('Network response was not ok.');
                }
            };
            if (updateAvatar) {
                console.log(updateAvatar)
                const req = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
                    method: 'POST',
                    body: JSON.stringify({
                        userID: updateID,
                        fileName: updateName + `-avatar.${updateAvatar.type.split('/')[1]}`,
                        fileType: updateAvatar.type,
                    }),
                });
                const reqData = await req.json();
                const presignedUrl = JSON.parse(reqData.body);

                // Upload avatar to presigned Url
                const uploadAvatar = await fetch(presignedUrl.presignedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': updateAvatar.type,
                    },
                    body: updateAvatar
                })
            };
            signOut();
        } catch (err) {
            console.log('Cannot upload team memmber info!', err)
        }
    }


    // Add new member section
    const [addNew, setAddNew] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newRole, setNewRole] = useState<string>('');
    const [selectedAva, setSelectedAva] = useState<File | null>(null);
    const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0] || null;
        setSelectedAva(image);
    }
    const handleAddMemberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Upload team member info first
        try{
            const res = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/team', {
                method: 'POST',
                body: JSON.stringify({
                    userID: user?.id,
                    name: newName,
                    role: newRole
                })
            })
            if (!res.ok) {
                // Handle any HTTP errors
                throw new Error('Network response was not ok.');
            }
            const data = await res.json();
            const newMemberData = JSON.parse(data.newMember);
            if (selectedAva) {
                const req = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
                    method: 'POST',
                    body: JSON.stringify({
                        userID: newMemberData._id,
                        fileName: newMemberData.name + `-avatar.${selectedAva.type.split('/')[1]}`,
                        fileType: selectedAva.type,
                    }),
                });
                const reqData = await req.json();
                const presignedUrl = JSON.parse(reqData.body);

                // Upload avatar to presigned Url
                const uploadAvatar = await fetch(presignedUrl.presignedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': selectedAva.type,
                    },
                    body: selectedAva
                })
                uploadAvatar.status === 200 && signOut();
            }
        } catch (err) {
            console.log('Cannot upload team memmber info!', err)
        }

    }

    // Handle Upload File
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploadId, setUploadId] = useState<{ [key: string]: string }>({});
    
    useEffect(() => {
        if(!editorMode){
            setFiles([]);
        }
    }, [editorMode])
    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const fileList = e.target.files;
        if(fileList){
            const fileArray = Array.from(fileList).map(file => {
                handleUploadFile(file);
                return file
            });
            setFiles(prevSelectedFiles => [...prevSelectedFiles, ...fileArray]);
        }   
    }
    const handleUploadFile = async (file: File) => {
        // Split File into parts
        const fileParts = await splitFileIntoParts(file);
        // Request Multipart Upload
        const reqMultiPart = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/start-multipart-upload', {
            method: "POST",
            body: JSON.stringify({ 
                numberOfFiles: fileParts.length,
                fileName: file.name
            })
        });
        const responseBody = await reqMultiPart.json();

        type PresignedUrl = {
            partNumber: number;
            url: string;
        };
        const presignedUrls: PresignedUrl[] = responseBody.presignedUrls;
        const uploadId = responseBody.uploadId;
        setUploadId((prev) => ({
            ...prev,
            [file.name]: uploadId
        }))

        // Upload parts to S3 Bucket
        try{
            const uploadedPartETags = []; // To store ETags for completed parts
            for (const filePart of fileParts) {
                const partNumber = fileParts.indexOf(filePart) + 1;
                const presignedUrl = presignedUrls.find((url) => url.partNumber === partNumber);
                if (presignedUrl){
                    const uploadPart = await axios.put(presignedUrl.url, filePart.data, {
                        onUploadProgress: (progressEvent: any) => {
                            if (progressEvent) {
                                const progressPercentage = (progressEvent.loaded / progressEvent.total) * 100;
                                const cumulativeProgress = ((partNumber - 1) / fileParts.length) * 100 + (progressPercentage / fileParts.length);
                                // console.log(`Total Progress: ${cumulativeProgress.toFixed(2)}%`);
                                setUploadProgress((prev) => ({
                                    ...prev,
                                    [file.name]: Math.floor(cumulativeProgress)
                                }))
                            }

                        }
                    });
                    if (uploadPart.status === 200) {
                        const uploadedETag = uploadPart.headers.etag;
                        uploadedPartETags.push({ PartNumber: partNumber, ETag: uploadedETag });
                        console.log(`File part ${partNumber} uploaded successfully`);
                    } else {
                        console.error(`Error uploading file part ${partNumber}`);
                    }
                }
            }
            if (uploadedPartETags.length === fileParts.length){
                // Complete the multipart upload
                const completeUploadResponse = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/complete-multipart-upload', {
                    method: 'POST',
                    body: JSON.stringify({
                        uploadId: uploadId,
                        fileName: file.name,
                        parts: uploadedPartETags.sort((a, b) => {
                            return a.PartNumber - b.PartNumber;
                          })
                    })
                });
                if (completeUploadResponse.ok) {
                    console.log('Multipart upload completed successfully');
                } else {
                    console.error('Error completing multipart upload');
                }
            }
        } catch(error) {
            console.error('Error upload ' + file);
            console.log(error)
        }
    }
    async function splitFileIntoParts(file: File) {
        const fileParts = [];
        let offset = 0;
        let partNumber = 1;
        let partSize = 50 * 1024 * 1024 // 50MB
      
        while (offset < file.size) {
          const chunk = file.slice(offset, offset + partSize);
          fileParts.push({ partNumber, data: chunk });
      
          offset += partSize;
          partNumber += 1;
        }
      
        return fileParts;
    }

    // Handle Abort Uploading Files
    const handleAbortUpload =  async (fileToAbort: File) => {
        const abort = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/abort-multipart-upload', {
            method: "POST",
            body: JSON.stringify({
                fileName: fileToAbort.name,
                uploadId: uploadId[fileToAbort.name],
            })
        })
        if(abort.status === 200){
            setFiles(prevFiles => prevFiles.filter(file => file.name !== fileToAbort.name));
            setUploadProgress(prevUploadProgress => {
                const updatedUploadProgress = { ...prevUploadProgress };
                delete updatedUploadProgress[fileToAbort.name];
                return updatedUploadProgress;
            });
            setUploadId(prevUploadId => {
                const updatedUploadId = { ...prevUploadId };
                delete updatedUploadId[fileToAbort.name];
                return updatedUploadId;
            });
        }
    }
    // Handle Delete File 
    const handleDeleteFile = async (fileToDelete: File) => {
        const deleteReq = await fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/delete-file', {
            method: "DELETE",
            body: JSON.stringify({
                fileName: fileToDelete.name,
            })
        })
        if (deleteReq.status === 200){
            setFiles(prevFiles => prevFiles.filter(file => file.name !== fileToDelete.name));
            setUploadProgress(prevUploadProgress => {
                const updatedUploadProgress = { ...prevUploadProgress };
                delete updatedUploadProgress[fileToDelete.name];
                return updatedUploadProgress;
            });
            setUploadId(prevUploadId => {
                const updatedUploadId = { ...prevUploadId };
                delete updatedUploadId[fileToDelete.name];
                return updatedUploadId;
            });
        }
    }
  return (
      <div className={`${styles.teamContainer} ${styles.gridBlock}`}>
        {!editorMode ?
        <>
            <div className={styles.header}>
                <h2>Team</h2>
                <div className={styles.teamCount}>
                    <div>
                        <svg height='20px' fill="var(--primary)" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"></path></g></svg>

                    </div>
                    <span>{user?.team.length}</span>
                </div>
            </div>
            <div className={styles.teamMembers}>
                {
                    user?.team.map((member, ind) => {
                        return(
                            <div key={ind} className={styles.memberContainer}>
                                <div className={styles.avatarContainer}>
                                    <img src={member.avatar}></img>
                                    {
                                        updateID === member._id && 
                                        <button>
                                            <label htmlFor='updateAvatar'>
                                                <input id='updateAvatar' type="file" accept="image/*" onChange={handleUpdateAvatar} hidden></input>
                                                <svg  height='18px' fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7033 50.6023 C 45.8956 50.6023 56 40.4980 56 28.3056 C 56 16.1355 45.8735 6.0088 33.6809 6.0088 C 22.4539 6.0088 12.9559 14.6536 11.6086 25.5437 C 18.5918 25.6560 24.4523 30.7755 25.6648 37.4668 C 28.0449 36.4563 30.8068 35.8725 33.7033 35.8725 C 39.2269 35.8725 44.0994 37.9383 47.0632 41.1267 C 43.6952 44.6071 38.9575 46.8076 33.6809 46.8076 C 30.5822 46.8076 27.6632 46.0217 25.1034 44.6969 C 24.6993 45.8870 24.1604 47.0096 23.4194 48.0650 C 26.5405 49.6817 30.0209 50.6023 33.7033 50.6023 Z M 33.6809 32.1002 C 29.3921 32.1002 26.1363 28.3505 26.1363 23.6800 C 26.1363 19.2566 29.4595 15.4170 33.6809 15.4170 C 37.9246 15.4170 41.2703 19.2566 41.2478 23.6800 C 41.2478 28.3505 37.9920 32.1002 33.6809 32.1002 Z M 11.4066 51.4555 C 17.6039 51.4555 22.8132 46.2911 22.8132 40.0489 C 22.8132 33.8068 17.6712 28.6424 11.4066 28.6424 C 5.1644 28.6424 0 33.8068 0 40.0489 C 0 46.3360 5.1644 51.4555 11.4066 51.4555 Z M 11.4290 47.4587 C 10.6431 47.4587 9.9471 46.9198 9.9471 46.0666 L 9.9471 41.4186 L 5.6584 41.4186 C 4.8949 41.4186 4.2662 40.7899 4.2662 40.0489 C 4.2662 39.2855 4.8949 38.6568 5.6584 38.6568 L 9.9471 38.6568 L 9.9471 34.0088 C 9.9471 33.1780 10.6431 32.6391 11.4290 32.6391 C 12.1925 32.6391 12.8885 33.1780 12.8885 34.0088 L 12.8885 38.6568 L 17.1772 38.6568 C 17.9407 38.6568 18.5469 39.2855 18.5469 40.0489 C 18.5469 40.7899 17.9407 41.4186 17.1772 41.4186 L 12.8885 41.4186 L 12.8885 46.0666 C 12.8885 46.9198 12.1925 47.4587 11.4290 47.4587 Z"></path></g>
                                                </svg>
                                            </label>
                                        </button>
                                    }
                                </div>
                                <div className={styles.memberName}>
                                    {
                                        updateID === member._id ? <input defaultValue={member.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateName(e.target.value)} autoFocus placeholder={member.name}></input> : <h2>{member.name}</h2>
                                    }
                                    {/* Use ' • ' as the separator */}
                                    {
                                        updateID === member._id ? <input defaultValue={member.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateRole(e.target.value)} placeholder='What you want to be known as?'></input> : <h3>{member.role.join(' • ')}</h3>
                                    }
                                     
                                </div>
                                <div className={styles.functionDot}>
                                    <div className={`${styles.functionWrapper} ${funcDot[member.name] ? styles.active : styles.deactive}`}>
                                        <button className={styles.interactButton} style={{opacity: '1', backgroundColor: 'var(--surface-08)'}}>
                                            <svg height={17} width={17} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0" stroke="var(--on-background)"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0196 2.91016C8.7096 2.91016 6.0196 5.60016 6.0196 8.91016V11.8002C6.0196 12.4102 5.7596 13.3402 5.4496 13.8602L4.2996 15.7702C3.5896 16.9502 4.0796 18.2602 5.3796 18.7002C9.6896 20.1402 14.3396 20.1402 18.6496 18.7002C19.8596 18.3002 20.3896 16.8702 19.7296 15.7702L18.5796 13.8602C18.2796 13.3402 18.0196 12.4102 18.0196 11.8002V8.91016C18.0196 5.61016 15.3196 2.91016 12.0196 2.91016Z" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path> <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="1" d="M15.0195 19.0601C15.0195 20.7101 13.6695 22.0601 12.0195 22.0601C11.1995 22.0601 10.4395 21.7201 9.89953 21.1801C9.35953 20.6401 9.01953 19.8801 9.01953 19.0601" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10"></path> </g></svg>
                                        </button>
                                        <button className={styles.interactButton} style={{opacity: '1', backgroundColor: 'var(--surface-08)'}}>
                                            <svg height={17} width={17} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.9886 20.9463L12.88 19.9522L12.35 20.0101L12.1027 20.4825L12.9886 20.9463ZM6.45572 19.09L7.06966 19.8793L8.08109 19.0927L7.07226 18.3027L6.45572 19.09ZM4.23006 20.8211L3.61612 20.0317L3.61611 20.0317L4.23006 20.8211ZM20 12C20 16.1206 16.8838 19.5148 12.88 19.9522L13.0973 21.9404C18.1043 21.3933 22 17.1523 22 12H20ZM12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2V4ZM4 12C4 7.58172 7.58172 4 12 4V2C6.47715 2 2 6.47715 2 12H4ZM7.07226 18.3027C5.20015 16.8366 4 14.5587 4 12H2C2 15.1996 3.50381 18.0485 5.83917 19.8773L7.07226 18.3027ZM4.844 21.6104L7.06966 19.8793L5.84178 18.3006L3.61612 20.0317L4.844 21.6104ZM4.29145 20C5.1484 20 5.52041 21.0843 4.84401 21.6104L3.61611 20.0317C2.78939 20.6747 3.24408 22 4.29145 22V20ZM12 20H4.29145V22H12V20ZM12.9 20H12V22H12.9V20ZM12.1027 20.4825C12.2517 20.1979 12.5519 20 12.9 20V22C13.3252 22 13.6921 21.7586 13.8746 21.4102L12.1027 20.4825Z" fill="var(--on-background)"></path> <path d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z" fill="var(--on-background)"></path> <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" fill="var(--on-background)"></path> <path d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z" fill="var(--on-background)"></path> </g></svg>
                                        </button>
                                        <button onClick={() => {
                                                setUpdateID((prev) => (prev === member._id ? null : member._id))
                                                setUpdateName(member.name);
                                                setUpdateRole(member.role.join(', '));
                                            }} className={styles.updateInfo}>
                                            <svg height={20} width={20} viewBox="0 0 24 24" stroke="var(--on-background)" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Edit_Pencil_01"> <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                                        </button>
                                        {
                                            updateID === member._id ? 
                                            <button onClick={(e) => handleUpdateMemberInfo(e, member.name, member.role)}>
                                                <svg height={20} width={20} fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7169 50.6051 C 45.9141 50.6051 56.0000 40.4968 56.0000 28.2994 C 56.0000 16.1245 45.8920 5.9937 33.6944 5.9937 C 22.4180 5.9937 12.9611 14.6419 11.5909 25.5365 C 12.1749 25.5365 12.7365 25.5814 13.2981 25.6712 C 13.9944 25.7611 14.6908 25.9183 15.3646 26.1205 C 16.4204 16.9332 24.1926 9.8124 33.6944 9.8124 C 43.9598 9.8124 52.1812 18.0563 52.2037 28.2994 C 52.2037 33.0840 50.4294 37.3969 47.5090 40.6765 C 44.1171 37.8461 39.0406 35.9593 33.6944 35.9593 C 31.1785 35.9593 28.3258 36.4984 25.6751 37.4418 C 25.8324 38.2954 25.9222 39.1715 25.9222 40.0475 C 25.9222 42.9902 25.0012 45.7531 23.4513 48.0668 C 26.5287 49.6616 30.0329 50.6051 33.7169 50.6051 Z M 33.6944 32.0956 C 38.0073 32.0956 41.2644 28.3668 41.2644 23.6720 C 41.2644 19.2469 37.9399 15.4057 33.6944 15.4057 C 29.4714 15.4057 26.1244 19.2469 26.1244 23.6720 C 26.1244 28.3668 29.4040 32.0956 33.6944 32.0956 Z M 11.4112 51.4587 C 17.6783 51.4587 22.8224 46.3372 22.8224 40.0475 C 22.8224 33.8028 17.6783 28.6363 11.4112 28.6363 C 5.1665 28.6363 0 33.8028 0 40.0475 C 0 46.3372 5.1665 51.4587 11.4112 51.4587 Z M 10.0634 46.7415 C 9.7040 46.7415 9.2547 46.5842 8.9627 46.2698 L 4.6498 41.5301 C 4.4926 41.3504 4.3803 40.9685 4.3803 40.6540 C 4.3803 39.8903 4.9868 39.2838 5.7505 39.2838 C 6.1998 39.2838 6.5592 39.4860 6.8063 39.7555 L 9.9960 43.2148 L 15.9487 34.9709 C 16.1958 34.6115 16.6001 34.3644 17.0943 34.3644 C 17.8356 34.3644 18.4870 34.9484 18.4870 35.7122 C 18.4870 35.9593 18.3747 36.2513 18.1725 36.5433 L 11.2090 46.2248 C 10.9844 46.5393 10.5351 46.7415 10.0634 46.7415 Z"></path></g></svg>
                                            </button> :
                                            <button className={styles.deleteMember}>
                                                <svg height={20} width={20} fill="var(--on-background)" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7169 50.6051 C 45.9141 50.6051 56.0000 40.4968 56.0000 28.2994 C 56.0000 16.1245 45.8920 5.9937 33.6944 5.9937 C 22.4180 5.9937 12.9611 14.6419 11.5909 25.5365 C 12.1749 25.5365 12.7365 25.5814 13.2981 25.6712 C 13.9944 25.7611 14.6908 25.9183 15.3646 26.1205 C 16.4204 16.9332 24.1926 9.8124 33.6944 9.8124 C 43.9598 9.8124 52.1812 18.0563 52.2037 28.2994 C 52.2037 33.0840 50.4294 37.3969 47.5090 40.6765 C 44.1171 37.8461 39.0406 35.9593 33.6944 35.9593 C 31.1785 35.9593 28.3258 36.4984 25.6751 37.4418 C 25.8324 38.2954 25.9222 39.1715 25.9222 40.0475 C 25.9222 42.9902 25.0012 45.7531 23.4513 48.0668 C 26.5287 49.6616 30.0329 50.6051 33.7169 50.6051 Z M 33.6944 32.0956 C 38.0073 32.0956 41.2644 28.3668 41.2644 23.6720 C 41.2644 19.2469 37.9399 15.4057 33.6944 15.4057 C 29.4714 15.4057 26.1244 19.2469 26.1244 23.6720 C 26.1244 28.3668 29.4040 32.0956 33.6944 32.0956 Z M 11.4112 51.4587 C 17.6783 51.4587 22.8224 46.3372 22.8224 40.0475 C 22.8224 33.8028 17.6783 28.6363 11.4112 28.6363 C 5.1665 28.6363 0 33.8028 0 40.0475 C 0 46.3372 5.1665 51.4587 11.4112 51.4587 Z M 8.0866 45.3488 C 7.5251 45.9328 6.6940 45.8205 6.1548 45.3039 C 5.6382 44.7872 5.5483 43.9336 6.1099 43.3720 L 9.5018 39.9801 L 6.3795 36.8353 C 5.8853 36.3187 5.8853 35.4651 6.3795 34.9934 C 6.8737 34.5217 7.6823 34.4992 8.1990 34.9934 L 11.3662 38.1157 L 14.7357 34.7238 C 15.2973 34.1622 16.1508 34.2746 16.6675 34.7912 C 17.1841 35.3303 17.2965 36.1614 16.7349 36.7230 L 13.3430 40.1149 L 16.4653 43.2597 C 16.9595 43.7764 16.9595 44.6075 16.4653 45.0792 C 15.9711 45.5509 15.1400 45.5734 14.6234 45.0792 L 11.5010 41.9793 Z"></path></g>
                                                </svg>
                                            </button>
                                        }
                                    </div>
                                    {
                                        funcDot[member.name] ? 
                                        <button style={{backgroundColor: 'var(--surface-04)'}} onClick={() => {
                                            setFuncdot((prevDots) => ({ ...prevDots, [member.name]: !prevDots[member.name] }));
                                            if (member._id === updateID) {
                                                setUpdateID(null);
                                            }
                                        }}>
                                            <svg height={18} width={18} viewBox="0 0 24 24" stroke="#ffffff" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                                        </button>
                                        :
                                        <button style={{backgroundColor: 'var(--surface-08)'}} onClick={() => {setFuncdot((prevDots) => ({ ...prevDots, [member.name]: !prevDots[member.name] }))}}>
                                            <svg height='20px' fill="var(--on-background)" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Glyph" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"></path><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"></path><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"></path></g></svg>
                                        </button>
                                    }
                                    
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={`${styles.addMembers}`}>
                <div className={`${styles.addButton} ${addNew ? styles.active : styles.deactive}`} onClick={() => setAddNew(true)}>
                    <button className={`${styles.button}`}>
                        <svg height='30px' viewBox="0 0 24 24" fill="url(#gradient1)" xmlns="http://www.w3.org/2000/svg">
                            <linearGradient id="gradient1" x1="100%" y1="100%" x2="00%" y2="00%">
                            <stop offset="0%" stopColor='#ee25f7'/>
                            <stop offset="50%" stopColor='#560bad'/>
                            <stop offset="100%" stopColor='#294fb6'/>
                            </linearGradient>
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path> </g></svg>
                    </button>
                    <h2>Invite new team member</h2>
                </div>
                <div className={`${styles.addForm} ${addNew ? styles.active : styles.deactive}`}>
                    {
                        selectedAva ? 
                        <div className={`${styles.bubble} ${styles.avatarContainer}`}>
                            <img className={styles.avatar} alt='' src={URL.createObjectURL(selectedAva)}/>
                        </div> 
                        :
                        <button className={`${styles.bubble} ${styles.button}`}>
                            <label htmlFor='avatar'>
                                <input id='avatar' type="file" accept="image/*" onChange={handleAvatar} hidden></input>
                                <svg height='18px' fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7033 50.6023 C 45.8956 50.6023 56 40.4980 56 28.3056 C 56 16.1355 45.8735 6.0088 33.6809 6.0088 C 22.4539 6.0088 12.9559 14.6536 11.6086 25.5437 C 18.5918 25.6560 24.4523 30.7755 25.6648 37.4668 C 28.0449 36.4563 30.8068 35.8725 33.7033 35.8725 C 39.2269 35.8725 44.0994 37.9383 47.0632 41.1267 C 43.6952 44.6071 38.9575 46.8076 33.6809 46.8076 C 30.5822 46.8076 27.6632 46.0217 25.1034 44.6969 C 24.6993 45.8870 24.1604 47.0096 23.4194 48.0650 C 26.5405 49.6817 30.0209 50.6023 33.7033 50.6023 Z M 33.6809 32.1002 C 29.3921 32.1002 26.1363 28.3505 26.1363 23.6800 C 26.1363 19.2566 29.4595 15.4170 33.6809 15.4170 C 37.9246 15.4170 41.2703 19.2566 41.2478 23.6800 C 41.2478 28.3505 37.9920 32.1002 33.6809 32.1002 Z M 11.4066 51.4555 C 17.6039 51.4555 22.8132 46.2911 22.8132 40.0489 C 22.8132 33.8068 17.6712 28.6424 11.4066 28.6424 C 5.1644 28.6424 0 33.8068 0 40.0489 C 0 46.3360 5.1644 51.4555 11.4066 51.4555 Z M 11.4290 47.4587 C 10.6431 47.4587 9.9471 46.9198 9.9471 46.0666 L 9.9471 41.4186 L 5.6584 41.4186 C 4.8949 41.4186 4.2662 40.7899 4.2662 40.0489 C 4.2662 39.2855 4.8949 38.6568 5.6584 38.6568 L 9.9471 38.6568 L 9.9471 34.0088 C 9.9471 33.1780 10.6431 32.6391 11.4290 32.6391 C 12.1925 32.6391 12.8885 33.1780 12.8885 34.0088 L 12.8885 38.6568 L 17.1772 38.6568 C 17.9407 38.6568 18.5469 39.2855 18.5469 40.0489 C 18.5469 40.7899 17.9407 41.4186 17.1772 41.4186 L 12.8885 41.4186 L 12.8885 46.0666 C 12.8885 46.9198 12.1925 47.4587 11.4290 47.4587 Z"></path></g>
                                </svg>
                            </label>
                        </button>
                    }
                    
                    <form id='addNewMemberForm' onSubmit={(e) => handleAddMemberSubmit(e)}>
                        <label htmlFor='name' className={`${styles.iconContainer} ${styles.editItem}`}>
                            <input placeholder='What you want to be called?' id='name' onChange={(e)=>setNewName(e.target.value)} />
                        </label>
                        <label htmlFor='role' className={`${styles.iconContainer} ${styles.editItem}`}>
                            <input placeholder='What you want to be known as?' id='role' onChange={(e)=>setNewRole(e.target.value)} />
                        </label>
                    </form>
                    <div className={styles.verifyButton}>
                        <button type='submit' form='addNewMemberForm'>
                            <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Check"> <path id="Vector" d="M6 12L10.2426 16.2426L18.727 7.75732" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                        </button>
                        <button onClick={() => {
                                setAddNew(false);
                                setNewName('');
                                setNewRole('');
                                setSelectedAva(null);
                            }}>
                            <svg height={18} width={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
        :
        (editorMode && format === 'blog' || format === 'photo') ? 
            <Editor onChange={(v: any)=> console.log(v)}/>
        :
            // Input layout
            <div className={styles.uploadContainer}>
                <div className={styles.header}>
                    <h2>Upload {format}</h2>
                </div>
                <div className={styles.uploadPart}>
                    <label htmlFor='fileInput' className={styles.uploadArea}>
                        <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M736.68 435.86a173.773 173.773 0 0 1 172.042 172.038c0.578 44.907-18.093 87.822-48.461 119.698-32.761 34.387-76.991 51.744-123.581 52.343-68.202 0.876-68.284 106.718 0 105.841 152.654-1.964 275.918-125.229 277.883-277.883 1.964-152.664-128.188-275.956-277.883-277.879-68.284-0.878-68.202 104.965 0 105.842zM285.262 779.307A173.773 173.773 0 0 1 113.22 607.266c-0.577-44.909 18.09-87.823 48.461-119.705 32.759-34.386 76.988-51.737 123.58-52.337 68.2-0.877 68.284-106.721 0-105.842C132.605 331.344 9.341 454.607 7.379 607.266 5.417 759.929 135.565 883.225 285.262 885.148c68.284 0.876 68.2-104.965 0-105.841z" fill="#ffffff"></path><path d="M339.68 384.204a173.762 173.762 0 0 1 172.037-172.038c44.908-0.577 87.822 18.092 119.698 48.462 34.388 32.759 51.743 76.985 52.343 123.576 0.877 68.199 106.72 68.284 105.843 0-1.964-152.653-125.231-275.917-277.884-277.879-152.664-1.962-275.954 128.182-277.878 277.879-0.88 68.284 104.964 68.199 105.841 0z" fill="#ffffff"></path><path d="M545.039 473.078c16.542 16.542 16.542 43.356 0 59.896l-122.89 122.895c-16.542 16.538-43.357 16.538-59.896 0-16.542-16.546-16.542-43.362 0-59.899l122.892-122.892c16.537-16.542 43.355-16.542 59.894 0z" fill="#ffffff"></path><path d="M485.17 473.078c16.537-16.539 43.354-16.539 59.892 0l122.896 122.896c16.538 16.533 16.538 43.354 0 59.896-16.541 16.538-43.361 16.538-59.898 0L485.17 532.979c-16.547-16.543-16.547-43.359 0-59.901z" fill="#ffffff"></path><path d="M514.045 634.097c23.972 0 43.402 19.433 43.402 43.399v178.086c0 23.968-19.432 43.398-43.402 43.398-23.964 0-43.396-19.432-43.396-43.398V677.496c0.001-23.968 19.433-43.399 43.396-43.399z" fill="#ffffff"></path></g>
                            </svg>
                        <input multiple type='file' id='fileInput' required style={{display:'none'}} onChange={handleAddFile} />
                        <h3>Drop your file here, or <b>Browse</b></h3>
                        <span>Maximum file is 1TB</span>
                    </label>
                </div>
                <h3>Uploaded</h3>
                {files ? 
                <div className={styles.filesUpload}>
                    {files.map((file, ind) => (
                        <div key={ind} className={styles.uploadSection}>
                            <div className={styles.fileIcon}>
                                <svg height={40} width={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z" fill="#ffffff"></path> <path opacity="0.4" d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z" fill="#ffffff"></path> <path opacity="0.7" d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z" fill="#ffffff"></path> </g>
                                </svg>
                            </div>
                            <div className={styles.fileInfo}>
                                <h4 className={styles.fileName}>{file.name}</h4>
                                <h5 className={styles.fileType}>{file.type}</h5>
                            </div>
                            <div className={styles.progressStatus}>
                                <ProgressBar progress={uploadProgress[file.name]}/>
                                <span>{uploadProgress[file.name]}%</span>
                            </div>
                            {
                                uploadProgress[file.name] === 100 ? 

                                <button onClick={() => handleDeleteFile(file)} style={{display: 'flex', backgroundColor: 'var(--surface-04)', cursor: 'pointer'}} >
                                    <svg height={18} width={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10.3094 2.25002H13.6908C13.9072 2.24988 14.0957 2.24976 14.2737 2.27819C14.977 2.39049 15.5856 2.82915 15.9146 3.46084C15.9978 3.62073 16.0573 3.79961 16.1256 4.00494L16.2373 4.33984C16.2562 4.39653 16.2616 4.41258 16.2661 4.42522C16.4413 4.90933 16.8953 5.23659 17.4099 5.24964C17.4235 5.24998 17.44 5.25004 17.5001 5.25004H20.5001C20.9143 5.25004 21.2501 5.58582 21.2501 6.00004C21.2501 6.41425 20.9143 6.75004 20.5001 6.75004H3.5C3.08579 6.75004 2.75 6.41425 2.75 6.00004C2.75 5.58582 3.08579 5.25004 3.5 5.25004H6.50008C6.56013 5.25004 6.5767 5.24998 6.59023 5.24964C7.10488 5.23659 7.55891 4.90936 7.73402 4.42524C7.73863 4.41251 7.74392 4.39681 7.76291 4.33984L7.87452 4.00496C7.94281 3.79964 8.00233 3.62073 8.08559 3.46084C8.41453 2.82915 9.02313 2.39049 9.72643 2.27819C9.90445 2.24976 10.093 2.24988 10.3094 2.25002ZM9.00815 5.25004C9.05966 5.14902 9.10531 5.04404 9.14458 4.93548C9.1565 4.90251 9.1682 4.86742 9.18322 4.82234L9.28302 4.52292C9.37419 4.24941 9.39519 4.19363 9.41601 4.15364C9.52566 3.94307 9.72853 3.79686 9.96296 3.75942C10.0075 3.75231 10.067 3.75004 10.3553 3.75004H13.6448C13.9331 3.75004 13.9927 3.75231 14.0372 3.75942C14.2716 3.79686 14.4745 3.94307 14.5842 4.15364C14.605 4.19363 14.626 4.2494 14.7171 4.52292L14.8169 4.82216L14.8556 4.9355C14.8949 5.04405 14.9405 5.14902 14.992 5.25004H9.00815Z" fill="#ffffff"></path> <path d="M5.91509 8.45015C5.88754 8.03685 5.53016 7.72415 5.11686 7.7517C4.70357 7.77925 4.39086 8.13663 4.41841 8.54993L4.88186 15.5017C4.96736 16.7844 5.03642 17.8205 5.19839 18.6336C5.36679 19.4789 5.65321 20.185 6.2448 20.7385C6.8364 21.2919 7.55995 21.5308 8.4146 21.6425C9.23662 21.7501 10.275 21.7501 11.5606 21.75H12.4395C13.7251 21.7501 14.7635 21.7501 15.5856 21.6425C16.4402 21.5308 17.1638 21.2919 17.7554 20.7385C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9638 17.8206 19.0328 16.7844 19.1183 15.5017L19.5818 8.54993C19.6093 8.13663 19.2966 7.77925 18.8833 7.7517C18.47 7.72415 18.1126 8.03685 18.0851 8.45015L17.6251 15.3493C17.5353 16.6971 17.4713 17.6349 17.3307 18.3406C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 19.8989 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255 20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8989 7.26958 19.6431C6.99617 19.3873 6.80583 19.025 6.66948 18.3406C6.52892 17.6349 6.46489 16.6971 6.37503 15.3493L5.91509 8.45015Z" fill="#ffffff"></path> <path d="M9.42546 10.2538C9.83762 10.2125 10.2052 10.5133 10.2464 10.9254L10.7464 15.9254C10.7876 16.3376 10.4869 16.7051 10.0747 16.7463C9.66256 16.7875 9.29503 16.4868 9.25381 16.0747L8.75381 11.0747C8.7126 10.6625 9.01331 10.295 9.42546 10.2538Z" fill="#ffffff"></path> <path d="M14.5747 10.2538C14.9869 10.295 15.2876 10.6625 15.2464 11.0747L14.7464 16.0747C14.7052 16.4868 14.3376 16.7875 13.9255 16.7463C13.5133 16.7051 13.2126 16.3376 13.2538 15.9254L13.7538 10.9254C13.795 10.5133 14.1626 10.2125 14.5747 10.2538Z" fill="#ffffff"></path> </g>
                                    </svg>
                                </button>
                                :
                                <button onClick={() => handleAbortUpload(file)} style={{display: 'flex', backgroundColor: 'var(--surface-04)', cursor: 'pointer'}} >
                                    <svg height={18} width={18} viewBox="0 0 24 24" stroke="#ffffff" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                                </button>
                            }
                        </div>
                    ))}
                </div>
                : ''}
            </div>
        }
    </div>
  )
}

export default TeamContainer