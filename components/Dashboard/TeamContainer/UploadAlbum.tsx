'use client'
import React, { useEffect, useState } from 'react'
import styles from './UploadVIdeos.module.css'
import { useAppSelector } from '@/redux/hooks'
import axios from 'axios'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'

type Props = {
    songList: (fileList: File[]) => void;
}
export const UploadAlbum: React.FC<Props> = ({ songList }) => {
    const editorMode = useAppSelector((state) => state.click.editorMode);
    const format = useAppSelector((state) => state.draft.format);
    
    // Handle Upload File
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    
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
            songList(fileArray)
        }   
    }
    const handleUploadFile = async (file: File) => {
        // Request Presigned URL
        const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/upload-draft-song', {
            method: "POST",
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
            }),
        })
        const resData = await res.json();
        const config = {
            headers: {
              'Content-Type': file.type,
            },
            onUploadProgress: (progressEvent: any) => {
                // You can handle progress here
                if (progressEvent) {
                  const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                  setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: progress
                    }))
                }
              },
          }
        await axios
            .put(resData.presignedUrl, file, config)
            .then((response) => {
                // Handle the successful upload here
                console.log('Upload successful', response);
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error uploading file', error);
            });
    }
    // Handle Delete File 
    const handleDeleteFile = async (fileToDelete: File) => {
        const deleteReq = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/delete-file', {
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
        }
    }
  return (
    // Upload Videos
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
                <h4>Drop your file here, or <b>Browse</b></h4>
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
                        uploadProgress[file.name] === 100 && 
                        <button onClick={() => handleDeleteFile(file)} style={{display: 'flex', backgroundColor: 'var(--surface-04)', cursor: 'pointer'}} >
                            <svg height={18} width={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10.3094 2.25002H13.6908C13.9072 2.24988 14.0957 2.24976 14.2737 2.27819C14.977 2.39049 15.5856 2.82915 15.9146 3.46084C15.9978 3.62073 16.0573 3.79961 16.1256 4.00494L16.2373 4.33984C16.2562 4.39653 16.2616 4.41258 16.2661 4.42522C16.4413 4.90933 16.8953 5.23659 17.4099 5.24964C17.4235 5.24998 17.44 5.25004 17.5001 5.25004H20.5001C20.9143 5.25004 21.2501 5.58582 21.2501 6.00004C21.2501 6.41425 20.9143 6.75004 20.5001 6.75004H3.5C3.08579 6.75004 2.75 6.41425 2.75 6.00004C2.75 5.58582 3.08579 5.25004 3.5 5.25004H6.50008C6.56013 5.25004 6.5767 5.24998 6.59023 5.24964C7.10488 5.23659 7.55891 4.90936 7.73402 4.42524C7.73863 4.41251 7.74392 4.39681 7.76291 4.33984L7.87452 4.00496C7.94281 3.79964 8.00233 3.62073 8.08559 3.46084C8.41453 2.82915 9.02313 2.39049 9.72643 2.27819C9.90445 2.24976 10.093 2.24988 10.3094 2.25002ZM9.00815 5.25004C9.05966 5.14902 9.10531 5.04404 9.14458 4.93548C9.1565 4.90251 9.1682 4.86742 9.18322 4.82234L9.28302 4.52292C9.37419 4.24941 9.39519 4.19363 9.41601 4.15364C9.52566 3.94307 9.72853 3.79686 9.96296 3.75942C10.0075 3.75231 10.067 3.75004 10.3553 3.75004H13.6448C13.9331 3.75004 13.9927 3.75231 14.0372 3.75942C14.2716 3.79686 14.4745 3.94307 14.5842 4.15364C14.605 4.19363 14.626 4.2494 14.7171 4.52292L14.8169 4.82216L14.8556 4.9355C14.8949 5.04405 14.9405 5.14902 14.992 5.25004H9.00815Z" fill="#ffffff"></path> <path d="M5.91509 8.45015C5.88754 8.03685 5.53016 7.72415 5.11686 7.7517C4.70357 7.77925 4.39086 8.13663 4.41841 8.54993L4.88186 15.5017C4.96736 16.7844 5.03642 17.8205 5.19839 18.6336C5.36679 19.4789 5.65321 20.185 6.2448 20.7385C6.8364 21.2919 7.55995 21.5308 8.4146 21.6425C9.23662 21.7501 10.275 21.7501 11.5606 21.75H12.4395C13.7251 21.7501 14.7635 21.7501 15.5856 21.6425C16.4402 21.5308 17.1638 21.2919 17.7554 20.7385C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9638 17.8206 19.0328 16.7844 19.1183 15.5017L19.5818 8.54993C19.6093 8.13663 19.2966 7.77925 18.8833 7.7517C18.47 7.72415 18.1126 8.03685 18.0851 8.45015L17.6251 15.3493C17.5353 16.6971 17.4713 17.6349 17.3307 18.3406C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 19.8989 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255 20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8989 7.26958 19.6431C6.99617 19.3873 6.80583 19.025 6.66948 18.3406C6.52892 17.6349 6.46489 16.6971 6.37503 15.3493L5.91509 8.45015Z" fill="#ffffff"></path> <path d="M9.42546 10.2538C9.83762 10.2125 10.2052 10.5133 10.2464 10.9254L10.7464 15.9254C10.7876 16.3376 10.4869 16.7051 10.0747 16.7463C9.66256 16.7875 9.29503 16.4868 9.25381 16.0747L8.75381 11.0747C8.7126 10.6625 9.01331 10.295 9.42546 10.2538Z" fill="#ffffff"></path> <path d="M14.5747 10.2538C14.9869 10.295 15.2876 10.6625 15.2464 11.0747L14.7464 16.0747C14.7052 16.4868 14.3376 16.7875 13.9255 16.7463C13.5133 16.7051 13.2126 16.3376 13.2538 15.9254L13.7538 10.9254C13.795 10.5133 14.1626 10.2125 14.5747 10.2538Z" fill="#ffffff"></path> </g>
                            </svg>
                        </button>
                    }
                </div>
            ))}
        </div>
        : ''}
    </div>
  )
}
