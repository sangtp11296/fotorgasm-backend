'use client'
import React, { useState } from 'react'
import styles from './TeamContainer.module.css'
import RichEditor from '@/components/RichEditor/RichEditor'

type User = {
    id: string;
    avatar: string;
    role: string;
    team: string[];
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}
interface teamMembers {
    name: string,
    title: string,
    img: string
}
interface Props{
    user: User,
    editorMode: boolean
}
const TeamContainer: React.FC<Props> = ({ user, editorMode }) => {
    const [addNew, setAddNew] = useState<boolean>(false);
    const teamMembers: teamMembers[] = [
        {
            name: 'Trần Phúc Sang',
            title: 'Reader • Traveler • Writer',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Trà',
            title: 'Photographer • Artist',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Yuki',
            title: 'Musician • Listener • Collector',
            img: '/assets/images/portrait.png'
        },
        {
            name: '陈福创',
            title: 'Interpreter',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Người Đi Bán Mưa',
            title: 'Muted',
            img: '/assets/images/portrait.png'
        },
    ]
    const [newName, setNewName] = useState<string>('');
    const [newRole, setNewRole] = useState<string>('');
    const [selectedAva, setSelectedAva] = useState<File | null>(null);

    const editorConfiguration = {
        removePlugins: ['Title','Markdown', 'Watchdog'],
        language:{
            textPartLanguage: [
                { title: 'English', languageCode: 'en' },
                { title: 'German', languageCode: 'de' },
                { title: 'Vietnamese', languageCode: 'vi' },
                { title: 'Chinese', languageCode: 'zh-cn'}
            ]
        },
        toolbar: {
            items: [
                'textPartLanguage', 'heading', '|',
                'fontfamily', 'fontsize', '|',
                'alignment', '|',
                'fontColor', 'fontBackgroundColor', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
                'link', '|',
                'outdent', 'indent', '|',
                'bulletedList', 'numberedList', 'todoList', 'horizontalLine', '|',
                'code', 'codeBlock', 'sourceEditing', '|',
                'insertTable', '|',
                'insertImage', 'mediaEmbed', 'blockQuote', '|',
                'undo', 'redo', 'findAndReplace', 'highlight', 'specialCharacters'
            ],
            viewportTopOffset: 30,
            shouldNotGroupWhenFull: true
        },
        ckfinder: {
            uploadUrl: '/uploads'
        },
        highlight: {
            options: [
                {
                    model: 'blueMarker',
                    class: 'marker-blue',
                    title: 'Blue marker',
                    color: 'var(--main-brand-color-theme)',
                    type: 'marker'
                },
                {
                    model: 'greenMarker',
                    class: 'marker-green',
                    title: 'Green marker',
                    color: 'var(--ck-highlight-marker-green)',
                    type: 'marker'
                },
                {
                    model: 'redPen',
                    class: 'pen-red',
                    title: 'Red pen',
                    color: 'var(--ck-highlight-pen-red)',
                    type: 'pen'
                }
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn', 'tableRow', 'mergeTableCells',
                'tableProperties', 'tableCellProperties', 'toggleTableCaption'
            ],
        },
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                'linkImage'
            ]},
        mediaEmbed: {
            removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
        }
    };
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
                    userID: user.id,
                    name: newName,
                    role: newRole
                })
            }).then((response) => {
                const res = response.json()
                console.log(res)
                // if (selectedAva) {
                //     const req = fetch('https://ypbx8fswz1.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
                //         method: 'POST',
                //         body: JSON.stringify({
                //             // userID: res.id,
                //             fileName: newName + `-avatar.${selectedAva.type.split('/')[1]}`,
                //             fileType: selectedAva.type,
                //         }),
                //     });
                //     const reqData = req.json();
                //     const presignedUrl = JSON.parse(reqData.body);
    
                //     // Upload avatar to presigned Url
                //     const uploadAvatar = fetch(presignedUrl.presignedUrl, {
                //         method: 'PUT',
                //         headers: {
                //             'Content-Type': selectedAva.type,
                //         },
                //         body: selectedAva
                //     })
                // }
            })
        } catch (err) {
            console.log('Cannot upload team memmber info!', err)
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
                    <span>4</span>
                </div>
            </div>
            <div className={styles.teamMembers}>
                {
                    teamMembers.map((member, ind) => {
                        return(
                            <div key={ind} className={styles.memberContainer}>
                                <img height='50px' src={member.img}></img>
                                <div className={styles.memberName}>
                                    <h2>{member.name}</h2>
                                    <h3>{member.title}</h3>
                                </div>
                                <div className={styles.functionDot}>
                                    <svg height='20px' fill="var(--on-background)" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Glyph" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"></path><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"></path><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"></path></g></svg>
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
                            <img className={styles.coverPhoto} alt='' src={URL.createObjectURL(selectedAva)}/>
                        </div> 
                        :
                        <button className={`${styles.bubble} ${styles.button}`}>
                            <label htmlFor='memberAvatar'>
                                <input id='memberAvatar' type="file" accept="image/*" onChange={handleAvatar} hidden></input>
                                <svg height='18px' fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7033 50.6023 C 45.8956 50.6023 56 40.4980 56 28.3056 C 56 16.1355 45.8735 6.0088 33.6809 6.0088 C 22.4539 6.0088 12.9559 14.6536 11.6086 25.5437 C 18.5918 25.6560 24.4523 30.7755 25.6648 37.4668 C 28.0449 36.4563 30.8068 35.8725 33.7033 35.8725 C 39.2269 35.8725 44.0994 37.9383 47.0632 41.1267 C 43.6952 44.6071 38.9575 46.8076 33.6809 46.8076 C 30.5822 46.8076 27.6632 46.0217 25.1034 44.6969 C 24.6993 45.8870 24.1604 47.0096 23.4194 48.0650 C 26.5405 49.6817 30.0209 50.6023 33.7033 50.6023 Z M 33.6809 32.1002 C 29.3921 32.1002 26.1363 28.3505 26.1363 23.6800 C 26.1363 19.2566 29.4595 15.4170 33.6809 15.4170 C 37.9246 15.4170 41.2703 19.2566 41.2478 23.6800 C 41.2478 28.3505 37.9920 32.1002 33.6809 32.1002 Z M 11.4066 51.4555 C 17.6039 51.4555 22.8132 46.2911 22.8132 40.0489 C 22.8132 33.8068 17.6712 28.6424 11.4066 28.6424 C 5.1644 28.6424 0 33.8068 0 40.0489 C 0 46.3360 5.1644 51.4555 11.4066 51.4555 Z M 11.4290 47.4587 C 10.6431 47.4587 9.9471 46.9198 9.9471 46.0666 L 9.9471 41.4186 L 5.6584 41.4186 C 4.8949 41.4186 4.2662 40.7899 4.2662 40.0489 C 4.2662 39.2855 4.8949 38.6568 5.6584 38.6568 L 9.9471 38.6568 L 9.9471 34.0088 C 9.9471 33.1780 10.6431 32.6391 11.4290 32.6391 C 12.1925 32.6391 12.8885 33.1780 12.8885 34.0088 L 12.8885 38.6568 L 17.1772 38.6568 C 17.9407 38.6568 18.5469 39.2855 18.5469 40.0489 C 18.5469 40.7899 17.9407 41.4186 17.1772 41.4186 L 12.8885 41.4186 L 12.8885 46.0666 C 12.8885 46.9198 12.1925 47.4587 11.4290 47.4587 Z"></path></g>
                                </svg>
                            </label>
                        </button>
                    }
                    
                    <form id='addNewMemberForm' onSubmit={(e) => handleAddMemberSubmit(e)}>
                        <label htmlFor='memberName' className={`${styles.iconContainer} ${styles.editItem}`}>
                            <input placeholder='What you want to be called?' id='adminNameUpdate' onChange={(e)=>setNewName(e.target.value)} />
                        </label>
                        <label htmlFor='memberRole' className={`${styles.iconContainer} ${styles.editItem}`}>
                            <input placeholder='What you want to be known as?' id='adminNameUpdate' onChange={(e)=>setNewRole(e.target.value)} />
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
        <>
            <div className={styles.header}>
                <h2>Main Content</h2>
            </div>
            {/* <RichEditor/> */}
        </>
        }
    </div>
  )
}

export default TeamContainer