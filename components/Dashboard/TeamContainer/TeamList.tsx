'use client'
import React, { useEffect, useState } from 'react'
import styles from './TeamList.module.css'
import { signOut, useSession } from 'next-auth/react';
import { getTeams } from '@/utils/getTeam';
import { Teammate } from '@/types/User.type';

export const TeamList = () => {
    const session = useSession();
    const user = session.data?.user;
    // Fetch team members
    const [members, setMembers] = useState<Teammate[]>([]);
    const handleGetTeamMembers = async () => {
        if (user?.team){
            const members = getTeams(user.team);
            setMembers((await members).teamMembers);
        }
    }
    useEffect(() => {
        handleGetTeamMembers();
    },[])

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
                const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/team', {
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
                const req = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
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
            window.location.reload();
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
            const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/team', {
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
            const newMemberData = data.newMember;
            console.log(newMemberData)
            if (res.status === 200 && selectedAva) {
                const req = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-presigned-url', {
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
                uploadAvatar.status === 200 && window.location.reload();
            }
        } catch (err) {
            console.log('Cannot upload team memmber info!', err)
        }

    }
  return (
    <>
        <div className={styles.header}>
            <h2>Team</h2>
            <div className={styles.teamCount}>
                <div>
                    <svg height='20px' fill="var(--primary)" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"></path></g></svg>

                </div>
                <span>{members.length}</span>
            </div>
        </div>
        <div className={styles.teamMembers}>
            {
            members && members.map((member, ind) => {
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
                        <input placeholder='What you want to be called?' id='name' defaultValue={newName} onChange={(e)=>setNewName(e.target.value)} />
                    </label>
                    <label htmlFor='role' className={`${styles.iconContainer} ${styles.editItem}`}>
                        <input placeholder='What you want to be known as?' defaultValue={newRole} id='role' onChange={(e)=>setNewRole(e.target.value)} />
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
  )
}
