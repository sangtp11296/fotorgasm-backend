'use client'
import React, { useEffect, useState } from 'react'
import styles from './HeaderContainer.module.css'
import Image from 'next/image';

type User = {
    id: string;
    avatar: string;
    role: string;
    team: string[];
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}

interface Props {
    user: User
}

const HeaderContainer: React.FC<Props> = ({user}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [popup, setPopup] = useState<boolean>(false);
    const [popupAdmin, setPopupAdmin] = useState<string>('off');
    const [selectedImg, setSelectedImg] = useState<File | null>(null);
    const [newName, setNewName] = useState<string>('');
    const [searchBar, setSearchBar] = useState<boolean>(false);

    // Get window innerwidth
    const windowWidth = useWindowWidth();
    function useWindowWidth(){
        const [windowSize, setWindowSize] = useState<number>();
        useEffect(() => {
            // only execute all the code below in client side
            // Handler to call on window resize
            function handleWindowResize(){
                setWindowSize(window.innerWidth);
            }
            window.addEventListener('resize', handleWindowResize);
            // Call handler right away so state gets updated with initial window size
            handleWindowResize();
            return () => {
            window.removeEventListener('resize', handleWindowResize);
            };
        },[]);
        return windowSize
    }

    // Get Current date
    const currentDate = new Date();
    // Custom formatting function
    function formatDate(date: Date) {
        const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const monthIndex = date.getMonth();
        const day = date.getDate();
        
        const formattedDate = `${months[monthIndex]} ${day}`;
    
        return formattedDate;
    }
    const formattedDate = formatDate(currentDate);

    // Handle search
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>){
        setSearchTerm(event.target.value);
    }

    // Handle toggle popup
    function togglePopup() {
        setSearchBar(false);
        setPopup((prev) => !prev);

        if (popupAdmin === 'off') {
            setPopupAdmin('on');
        }
        if (popup) {
            setPopupAdmin('off');
        }
        if (windowWidth! < 1000){
            setSearchBar(false);
        }
    }

    // Handle avatar update
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setSelectedImg(file)

        console.log('updating avatar');
        try {
            if(file){
                const formData = new FormData();
                formData.append('userID', user.id);
                formData.append('avatar', file);
                const res = await fetch('https://w9esxs9q88.execute-api.ap-southeast-1.amazonaws.com/dev/admin/update', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                res.status === 200 && window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    }
  return (
    <div className={`${styles.headerContainer} ${styles.gridBlock}`}>
        <div className={styles.firstSection}>
            <div className={styles.adminPart}>
                <div className={styles.adminImageContainer}>
                    <Image width={50} height={50} alt='Fotorgasm Avatar' src={user.avatar}></Image>
                </div>
                <div className={styles.adminName}>
                    <span>@{user.name}</span>
                    <span>{user.role}</span>
                </div>
            </div>
            <div className={`${styles.datePart} ${styles.bubble}`}>
                <div className={styles.iconContainer}>
                    <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 2V5" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16 2V5" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.5 9.08997H20.5" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11.9955 13.7H12.0045" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8.29431 13.7H8.30329" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8.29431 16.7H8.30329" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </div>
                <div className={styles.dateMonth}>
                    <span>{formattedDate}</span>
                </div>
            </div>
            <div className={`${styles.editPart} ${styles.bubble}`} >
                <div style={{height:'38px', width:'38px'}} className={styles.iconContainer} onClick={togglePopup}>
                    {
                        !popup ?
                        <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Edit_Pencil_01"> <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg> :
                        <svg height='15px' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" stroke="#fff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
                    }
                </div>
            </div>
            <form id='adminUpdate' className={styles.editForm} >
                <label htmlFor='avatarUpload' 
                    style={{transform: popupAdmin === 'on' ? 'translateX(10px)' : 'translateX(0px)',
                        opacity: popupAdmin === 'on' ? '1' : '0',
                        visibility: popupAdmin === 'on' ? 'visible' : 'hidden'}} 
                    className={`${styles.iconContainer} ${styles.editItem}`}>
                    <input hidden id='avatarUpload' type="file" accept="image/*" onChange={handleAvatarUpload}/>
                    <svg height='18px' fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 33.7033 50.6023 C 45.8956 50.6023 56 40.4980 56 28.3056 C 56 16.1355 45.8735 6.0088 33.6809 6.0088 C 22.4539 6.0088 12.9559 14.6536 11.6086 25.5437 C 18.5918 25.6560 24.4523 30.7755 25.6648 37.4668 C 28.0449 36.4563 30.8068 35.8725 33.7033 35.8725 C 39.2269 35.8725 44.0994 37.9383 47.0632 41.1267 C 43.6952 44.6071 38.9575 46.8076 33.6809 46.8076 C 30.5822 46.8076 27.6632 46.0217 25.1034 44.6969 C 24.6993 45.8870 24.1604 47.0096 23.4194 48.0650 C 26.5405 49.6817 30.0209 50.6023 33.7033 50.6023 Z M 33.6809 32.1002 C 29.3921 32.1002 26.1363 28.3505 26.1363 23.6800 C 26.1363 19.2566 29.4595 15.4170 33.6809 15.4170 C 37.9246 15.4170 41.2703 19.2566 41.2478 23.6800 C 41.2478 28.3505 37.9920 32.1002 33.6809 32.1002 Z M 11.4066 51.4555 C 17.6039 51.4555 22.8132 46.2911 22.8132 40.0489 C 22.8132 33.8068 17.6712 28.6424 11.4066 28.6424 C 5.1644 28.6424 0 33.8068 0 40.0489 C 0 46.3360 5.1644 51.4555 11.4066 51.4555 Z M 11.4290 47.4587 C 10.6431 47.4587 9.9471 46.9198 9.9471 46.0666 L 9.9471 41.4186 L 5.6584 41.4186 C 4.8949 41.4186 4.2662 40.7899 4.2662 40.0489 C 4.2662 39.2855 4.8949 38.6568 5.6584 38.6568 L 9.9471 38.6568 L 9.9471 34.0088 C 9.9471 33.1780 10.6431 32.6391 11.4290 32.6391 C 12.1925 32.6391 12.8885 33.1780 12.8885 34.0088 L 12.8885 38.6568 L 17.1772 38.6568 C 17.9407 38.6568 18.5469 39.2855 18.5469 40.0489 C 18.5469 40.7899 17.9407 41.4186 17.1772 41.4186 L 12.8885 41.4186 L 12.8885 46.0666 C 12.8885 46.9198 12.1925 47.4587 11.4290 47.4587 Z"></path></g>
                    </svg>
                </label>
                <label htmlFor='adminNameUpdate' 
                    style={{
                        transform: popupAdmin === 'on' ? 'translateX(20px)' : popupAdmin === 'on' ? 'translateX(-5px)' : 'translateX(0px)',
                        opacity: (popupAdmin === 'on' || popupAdmin === 'name') ? '1' : '0',
                        visibility: (popupAdmin === 'on' || popupAdmin === 'name')  ? 'visible' : 'hidden'
                    }} 
                    className={`${styles.iconContainer} ${styles.editItem}`}
                    onClick={() => setPopupAdmin('name')}>
                    <svg height='18px' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="var(--ci-primary-color, #ffffff)" d="M495.826,232a206.644,206.644,0,0,0-18.882-78.412,227.033,227.033,0,0,0-51.61-71.261C379.708,39.555,319.571,16,256,16A240,240,0,0,0,86.294,425.706a240,240,0,0,0,337.671,1.722l-22.4-22.856A206.824,206.824,0,0,1,256,464C141.309,464,48,370.691,48,256S141.309,48,256,48c112.748,0,208,87.925,208,192v36c0,28.673-25.122,52-56,52s-56-23.327-56-52V160H320v26.751a99.988,99.988,0,1,0,12.55,132.437C347.956,343.62,376.01,360,408,360c48.523,0,88-37.682,88-84V232ZM252,328a68,68,0,1,1,68-68A68.077,68.077,0,0,1,252,328Z" className="ci-primary"></path> </g></svg>
                    <input placeholder='fotorgasm' type={popupAdmin === 'name' ? 'text' : 'hidden'} id='adminNameUpdate' onChange={(e)=>setNewName(e.target.value)} />
                </label>
                <label htmlFor='adminUpdateTitle' style={{
                        transform: popupAdmin === 'on' ? 'translateX(30px)' : popupAdmin === 'title' ? 'translateX(-25px)' : 'translateX(0px)',
                        opacity: (popupAdmin === 'on' || popupAdmin === 'title') ? '1' : '0',
                        visibility: (popupAdmin === 'on' || popupAdmin === 'title') ? 'visible' : 'hidden'
                    }}
                    className={`${styles.iconContainer} ${styles.editItem}`}
                    onClick={() => setPopupAdmin('title')}>
                    <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M22 7.7699V8.9999H2V7.5399C2 5.2499 3.86 3.3999 6.15 3.3999H16V5.9699C16 7.2399 16.76 7.9999 18.03 7.9999H20.97C21.37 7.9999 21.71 7.9299 22 7.7699Z" fill="#ffffff"></path> <path d="M2 9V16.46C2 18.75 3.86 20.6 6.15 20.6H17.85C20.14 20.6 22 18.75 22 16.46V9H2ZM8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25ZM14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z" fill="#ffffff"></path> <path d="M20.97 1H18.03C16.76 1 16 1.76 16 3.03V5.97C16 7.24 16.76 8 18.03 8H20.97C22.24 8 23 7.24 23 5.97V3.03C23 1.76 22.24 1 20.97 1ZM19.01 6.57C18.98 6.6 18.91 6.64 18.86 6.64L17.82 6.79C17.79 6.8 17.75 6.8 17.72 6.8C17.57 6.8 17.44 6.75 17.35 6.65C17.23 6.53 17.18 6.36 17.21 6.18L17.36 5.14C17.37 5.09 17.4 5.02 17.43 4.99L19.13 3.29C19.16 3.36 19.19 3.44 19.22 3.52C19.26 3.6 19.3 3.67 19.34 3.74C19.37 3.8 19.41 3.86 19.45 3.9C19.49 3.96 19.53 4.02 19.56 4.05C19.58 4.08 19.59 4.09 19.6 4.1C19.69 4.21 19.79 4.31 19.88 4.38C19.9 4.4 19.92 4.42 19.93 4.42C19.98 4.46 20.04 4.51 20.08 4.54C20.14 4.58 20.19 4.62 20.25 4.65C20.32 4.69 20.4 4.73 20.48 4.77C20.56 4.81 20.64 4.84 20.71 4.86L19.01 6.57ZM21.4 4.18L21.08 4.5C21.06 4.53 21.03 4.54 21 4.54C20.99 4.54 20.98 4.54 20.97 4.54C20.25 4.33 19.68 3.76 19.47 3.04C19.46 3 19.47 2.96 19.5 2.93L19.83 2.6C20.37 2.06 20.88 2.07 21.41 2.6C21.68 2.87 21.81 3.13 21.81 3.39C21.8 3.65 21.67 3.91 21.4 4.18Z" fill="#ffffff"></path> </g></svg>
                    <input placeholder='Project Admin' type={popupAdmin === 'title' ? 'text' : 'hidden'} id='adminUpdateTitle' onChange={(e)=>setNewName(e.target.value)} />
                </label>
                <label htmlFor='adminUpdatePassword' style={{
                        transform: popupAdmin === 'on' ? 'translateX(40px)' : popupAdmin === 'password' ? 'translateX(-45px)' : 'translateX(0px)',
                        opacity: (popupAdmin === 'on' || popupAdmin === 'password') ? '1' : '0',
                        visibility: (popupAdmin === 'on' || popupAdmin === 'password') ? 'visible' : 'hidden'
                    }}
                    className={`${styles.iconContainer} ${styles.editItem}`}
                    onClick={() => setPopupAdmin('password')}>
                    <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.0195 4.5H16.4995C17.1195 4.5 17.6695 4.52 18.1595 4.59C20.7895 4.88 21.4995 6.12 21.4995 9.5V14.5C21.4995 17.88 20.7895 19.12 18.1595 19.41C17.6695 19.48 17.1195 19.5 16.4995 19.5H15.0195" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 2V22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M11.0941 12H11.1031" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M7.09412 12H7.1031" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <input placeholder='Password' type={popupAdmin === 'password' ? 'text' : 'hidden'} id='adminUpdatePassword' onChange={(e)=>setNewName(e.target.value)} />
                </label>
            </form>
        </div>
        <div className={styles.secondSection}>
            <form className={styles.searchBar}>
                <svg onClick={()=>{
                    if (windowWidth! < 1000){
                        setPopup(false);
                        setPopupAdmin('off');
                        setSearchBar((prev)=>!prev);
                    }
                }} height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M14 5H20" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M14 8H17" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M22 22L20 20" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <input
                    style={{
                        width: (windowWidth! < 1000 && searchBar) ? '180px' : (windowWidth! < 1000 && !searchBar) ?'0' : '', 
                        marginLeft: (windowWidth! < 1000 && searchBar) ? '10px' : (windowWidth! < 1000 && !searchBar) ?'0' : ''}}
                    type='text'
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </form>
            <div className={styles.notiButton}>
                <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0196 2.91016C8.7096 2.91016 6.0196 5.60016 6.0196 8.91016V11.8002C6.0196 12.4102 5.7596 13.3402 5.4496 13.8602L4.2996 15.7702C3.5896 16.9502 4.0796 18.2602 5.3796 18.7002C9.6896 20.1402 14.3396 20.1402 18.6496 18.7002C19.8596 18.3002 20.3896 16.8702 19.7296 15.7702L18.5796 13.8602C18.2796 13.3402 18.0196 12.4102 18.0196 11.8002V8.91016C18.0196 5.61016 15.3196 2.91016 12.0196 2.91016Z" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path> <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M15.0195 19.0601C15.0195 20.7101 13.6695 22.0601 12.0195 22.0601C11.1995 22.0601 10.4395 21.7201 9.89953 21.1801C9.35953 20.6401 9.01953 19.8801 9.01953 19.0601" stroke="var(--on-background)" strokeWidth="1.5" strokeMiterlimit="10"></path> </g></svg>
            </div>
            <div className={styles.chatButton}>
                <svg height='18px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.9886 20.9463L12.88 19.9522L12.35 20.0101L12.1027 20.4825L12.9886 20.9463ZM6.45572 19.09L7.06966 19.8793L8.08109 19.0927L7.07226 18.3027L6.45572 19.09ZM4.23006 20.8211L3.61612 20.0317L3.61611 20.0317L4.23006 20.8211ZM20 12C20 16.1206 16.8838 19.5148 12.88 19.9522L13.0973 21.9404C18.1043 21.3933 22 17.1523 22 12H20ZM12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2V4ZM4 12C4 7.58172 7.58172 4 12 4V2C6.47715 2 2 6.47715 2 12H4ZM7.07226 18.3027C5.20015 16.8366 4 14.5587 4 12H2C2 15.1996 3.50381 18.0485 5.83917 19.8773L7.07226 18.3027ZM4.844 21.6104L7.06966 19.8793L5.84178 18.3006L3.61612 20.0317L4.844 21.6104ZM4.29145 20C5.1484 20 5.52041 21.0843 4.84401 21.6104L3.61611 20.0317C2.78939 20.6747 3.24408 22 4.29145 22V20ZM12 20H4.29145V22H12V20ZM12.9 20H12V22H12.9V20ZM12.1027 20.4825C12.2517 20.1979 12.5519 20 12.9 20V22C13.3252 22 13.6921 21.7586 13.8746 21.4102L12.1027 20.4825Z" fill="var(--on-background)"></path> <path d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z" fill="var(--on-background)"></path> <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" fill="var(--on-background)"></path> <path d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z" fill="var(--on-background)"></path> </g></svg>
            </div>
        </div>
    </div>
  )
}

export default HeaderContainer