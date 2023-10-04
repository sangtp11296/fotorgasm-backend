'use client'
import React, { useRef, useState } from 'react'
import styles from './SignUp.module.css'

const SignUp = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const userRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const repassRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<boolean>();
    const [passError, setPassError] = useState<boolean>();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        setPassError(false);
        try {
            if (emailRef.current && userRef.current && passRef.current && repassRef.current){
                if (passRef.current.value === repassRef.current.value){
    
                    const email = emailRef.current.value;
                    const username = userRef.current.value;
                    const password = passRef.current.value;
                    const avatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                    const role = 'Project Admin';
                    const team = `${username}-team`

                    const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/register', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            username,
                            password,
                            avatar,
                            role,
                            team
                        })
                    })
                    res.status === 200 && window.location.reload();
                } else {
                    setPassError(true);
                }
            } else {
                setError(true);
            }
            
        } catch(err) {
            console.log(err);
        }
        

    }
  return (
    <form autoComplete='off' onSubmit={(e) => handleSignUp(e)}>
        <div className={styles.formInput}>
            <div className={`${styles.iconContainer} ${styles.password}`} style={{borderRight:'2px solid var(--on-separate)'}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path clipRule="evenodd" d="m10.0979 2.43735c1.8913-.37621 3.8517-.18313 5.6333.55483 1.7815.73795 3.3043 1.98764 4.3756 3.59101 1.0714 1.60338 1.6432 3.48841 1.6432 5.41681v1.5c0 .862-.3424 1.6886-.9519 2.2981s-1.4361.9519-2.2981.9519c-.8619 0-1.6886-.3424-2.2981-.9519-.2236-.2236-.4113-.4764-.5593-.7495-.0896.1071-.1843.2106-.2838.3102-.8908.8908-2.099 1.3912-3.3588 1.3912s-2.46795-.5004-3.35875-1.3912-1.39125-2.099-1.39125-3.3588.50045-2.46795 1.39125-3.35875 2.09895-1.39125 3.35875-1.39125 2.468.50045 3.3588 1.39125 1.3912 2.09895 1.3912 3.35875v1.5c0 .4641.1844.9093.5126 1.2374.3282.3282.7733.5126 1.2374.5126s.9093-.1844 1.2374-.5126c.3282-.3281.5126-.7733.5126-1.2374v-1.5c0-1.6317-.4839-3.22674-1.3904-4.58345s-2.195-2.41413-3.7025-3.03855c-1.5074-.62442-3.1662-.7878-4.7666-.46947-1.60033.31832-3.07034 1.10406-4.22413 2.25784-1.15378 1.15379-1.93952 2.6238-2.25784 4.22413-.31833 1.6004-.15495 3.2592.46947 4.7666.62442 1.5075 1.68184 2.796 3.03855 3.7025s2.95175 1.3904 4.58345 1.3904h.0007c1.4483.0014 2.8708-.3793 4.1233-1.105.3584-.2076.8173-.0854 1.025.273.2076.3584.0854.8173-.273 1.025-1.4821.8586-3.1646 1.3087-4.8767 1.307l.0007-.75v.75c-.0002 0-.0005 0-.0007 0-1.9281-.0001-3.81293-.572-5.41611-1.6432-1.60337-1.0713-2.85306-2.5941-3.59101-4.3756-.73796-1.7816-.93104-3.742-.55483-5.6333.3762-1.89134 1.3048-3.62863 2.66836-4.99219s3.10085-2.29216 4.99219-2.66836zm5.1521 9.56265c0-.8619-.3424-1.6886-.9519-2.29809-.6095-.6095-1.4361-.95191-2.2981-.95191-.8619 0-1.6886.34241-2.29809.95191-.6095.60949-.95191 1.43619-.95191 2.29809 0 .862.34241 1.6886.95191 2.2981.60949.6095 1.43619.9519 2.29809.9519.862 0 1.6886-.3424 2.2981-.9519s.9519-1.4361.9519-2.2981z" fill="#ffffff" fillRule="evenodd"></path></g></svg>
            </div>
            <div className={styles.inputContainer}>
                <h4>Email</h4>
                <input autoFocus required ref={emailRef} type='text' id='email' name='email' maxLength={40}></input>
            </div>
            <div className={styles.checkerContainer}>
                {
                error === true ? 
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" strokeWidth="0" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="cross-a" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L0.292893219,1.70710678 Z"></path> <path id="cross-c" d="M3.58578644,5 L0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L5,3.58578644 L8.29289322,0.292893219 C8.68341751,-0.0976310729 9.31658249,-0.0976310729 9.70710678,0.292893219 C10.0976311,0.683417511 10.0976311,1.31658249 9.70710678,1.70710678 L6.41421356,5 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L5,6.41421356 L1.70710678,9.70710678 C1.31658249,10.0976311 0.683417511,10.0976311 0.292893219,9.70710678 C-0.0976310729,9.31658249 -0.0976310729,8.68341751 0.292893219,8.29289322 L3.58578644,5 Z"></path> </defs> <g fill="none" fillRule="evenodd"> <g transform="translate(8 6)"> <mask id="cross-b" fill="#ffffff"> <use xlinkHref="#cross-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#cross-a"></use> <g fill="#4361ee" mask="url(#cross-b)"> <rect width="24" height="24" transform="translate(-8 -6)"></rect> </g> </g> <g transform="rotate(-90 12 5)"> <mask id="cross-d" fill="#ffffff"> <use xlinkHref="#cross-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#cross-c"></use> <g fill="#f72585" mask="url(#cross-d)"> <rect width="24" height="24" transform="translate(-7 -7)"></rect> </g> </g> </g> </g></svg> : error === false ?
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="check-a" d="M4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L1.90917969,5.46118164 C1.5186554,5.85170593 0.885490417,5.85170593 0.494966125,5.46118164 C0.104441833,5.07065735 0.104441833,4.43749237 0.494966125,4.04696808 L4.29289322,0.292893219 Z"></path> <path id="check-c" d="M10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 C10.3165825,15.0976311 9.68341751,15.0976311 9.29289322,14.7071068 L0.292893219,5.70710678 C-0.0976310729,5.31658249 -0.0976310729,4.68341751 0.292893219,4.29289322 L4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L2.41421356,5 L10.7071068,13.2928932 Z"></path> </defs> <g fill="none" fillRule="evenodd" transform="rotate(-90 11 7)"> <g transform="translate(1 1)"> <mask id="check-b" fill="#ffffff"> <use xlinkHref="#check-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#check-a"></use> <g fill="#4361ee" mask="url(#check-b)"> <rect width="24" height="24" transform="translate(-7 -5)"></rect> </g> </g> <mask id="check-d" fill="#ffffff"> <use xlinkHref="#check-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#check-c"></use> <g fill="#f72585" mask="url(#check-d)"> <rect width="24" height="24" transform="translate(-6 -4)"></rect> </g> </g> </g></svg> : ' '
                }
            </div>
        </div>
        <div className={styles.formInput}>
            <div className={styles.iconContainer} style={{borderRight:'2px solid var(--on-separate)'}}>
                <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">  <g> <path className="st0" d="M256,265.308c73.252,0,132.644-59.391,132.644-132.654C388.644,59.412,329.252,0,256,0 c-73.262,0-132.643,59.412-132.643,132.654C123.357,205.917,182.738,265.308,256,265.308z"></path> <path className="st0" d="M425.874,393.104c-5.922-35.474-36-84.509-57.552-107.465c-5.829-6.212-15.948-3.628-19.504-1.427 c-27.04,16.672-58.782,26.399-92.819,26.399c-34.036,0-65.778-9.727-92.818-26.399c-3.555-2.201-13.675-4.785-19.505,1.427 c-21.55,22.956-51.628,71.991-57.551,107.465C71.573,480.444,164.877,512,256,512C347.123,512,440.427,480.444,425.874,393.104z"></path> </g> </g></svg>
            </div>
            <div className={styles.inputContainer}>
                <h4>Username</h4>
                <input required ref={userRef} type='text' id='username' name='username' maxLength={30}></input>
            </div>
            <div className={styles.checkerContainer}>
                {
                error === true ? 
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" strokeWidth="0" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="cross-a" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L0.292893219,1.70710678 Z"></path> <path id="cross-c" d="M3.58578644,5 L0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L5,3.58578644 L8.29289322,0.292893219 C8.68341751,-0.0976310729 9.31658249,-0.0976310729 9.70710678,0.292893219 C10.0976311,0.683417511 10.0976311,1.31658249 9.70710678,1.70710678 L6.41421356,5 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L5,6.41421356 L1.70710678,9.70710678 C1.31658249,10.0976311 0.683417511,10.0976311 0.292893219,9.70710678 C-0.0976310729,9.31658249 -0.0976310729,8.68341751 0.292893219,8.29289322 L3.58578644,5 Z"></path> </defs> <g fill="none" fillRule="evenodd"> <g transform="translate(8 6)"> <mask id="cross-b" fill="#ffffff"> <use xlinkHref="#cross-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#cross-a"></use> <g fill="#4361ee" mask="url(#cross-b)"> <rect width="24" height="24" transform="translate(-8 -6)"></rect> </g> </g> <g transform="rotate(-90 12 5)"> <mask id="cross-d" fill="#ffffff"> <use xlinkHref="#cross-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#cross-c"></use> <g fill="#f72585" mask="url(#cross-d)"> <rect width="24" height="24" transform="translate(-7 -7)"></rect> </g> </g> </g> </g></svg> : error === false ?
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="check-a" d="M4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L1.90917969,5.46118164 C1.5186554,5.85170593 0.885490417,5.85170593 0.494966125,5.46118164 C0.104441833,5.07065735 0.104441833,4.43749237 0.494966125,4.04696808 L4.29289322,0.292893219 Z"></path> <path id="check-c" d="M10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 C10.3165825,15.0976311 9.68341751,15.0976311 9.29289322,14.7071068 L0.292893219,5.70710678 C-0.0976310729,5.31658249 -0.0976310729,4.68341751 0.292893219,4.29289322 L4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L2.41421356,5 L10.7071068,13.2928932 Z"></path> </defs> <g fill="none" fillRule="evenodd" transform="rotate(-90 11 7)"> <g transform="translate(1 1)"> <mask id="check-b" fill="#ffffff"> <use xlinkHref="#check-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#check-a"></use> <g fill="#4361ee" mask="url(#check-b)"> <rect width="24" height="24" transform="translate(-7 -5)"></rect> </g> </g> <mask id="check-d" fill="#ffffff"> <use xlinkHref="#check-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#check-c"></use> <g fill="#f72585" mask="url(#check-d)"> <rect width="24" height="24" transform="translate(-6 -4)"></rect> </g> </g> </g></svg> : ' '
                }
            </div>
        </div>
        <div className={styles.formInput}>
            <div className={`${styles.iconContainer} ${styles.password}`} style={{borderRight:'2px solid var(--on-separate)'}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.0195 4.5H16.4995C17.1195 4.5 17.6695 4.52 18.1595 4.59C20.7895 4.88 21.4995 6.12 21.4995 9.5V14.5C21.4995 17.88 20.7895 19.12 18.1595 19.41C17.6695 19.48 17.1195 19.5 16.4995 19.5H15.0195" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 2V22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M11.0941 12H11.1031" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M7.09412 12H7.1031" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
            <div className={styles.inputContainer}>
                <h4>Password</h4>
                <input required ref={passRef} type='password' id='password' name='password' maxLength={30}></input>
            </div>
            <div className={styles.checkerContainer}>
                {
                passError === false &&
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="check-a" d="M4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L1.90917969,5.46118164 C1.5186554,5.85170593 0.885490417,5.85170593 0.494966125,5.46118164 C0.104441833,5.07065735 0.104441833,4.43749237 0.494966125,4.04696808 L4.29289322,0.292893219 Z"></path> <path id="check-c" d="M10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 C10.3165825,15.0976311 9.68341751,15.0976311 9.29289322,14.7071068 L0.292893219,5.70710678 C-0.0976310729,5.31658249 -0.0976310729,4.68341751 0.292893219,4.29289322 L4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L2.41421356,5 L10.7071068,13.2928932 Z"></path> </defs> <g fill="none" fillRule="evenodd" transform="rotate(-90 11 7)"> <g transform="translate(1 1)"> <mask id="check-b" fill="#ffffff"> <use xlinkHref="#check-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#check-a"></use> <g fill="#4361ee" mask="url(#check-b)"> <rect width="24" height="24" transform="translate(-7 -5)"></rect> </g> </g> <mask id="check-d" fill="#ffffff"> <use xlinkHref="#check-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#check-c"></use> <g fill="#f72585" mask="url(#check-d)"> <rect width="24" height="24" transform="translate(-6 -4)"></rect> </g> </g> </g></svg>
                }
            </div>
        </div>
        <div className={styles.formInput}>
            <div className={`${styles.iconContainer} ${styles.password}`} style={{borderRight:'2px solid var(--on-separate)'}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 2V22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11.0945 12H11.1035" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M7.09448 12H7.10346" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
            <div className={styles.inputContainer}>
                <h4>Re-Password</h4>
                <input required ref={repassRef} type='password' id='password' name='password' maxLength={30}></input>
            </div>
            <div className={styles.checkerContainer}>
                {
                passError === true ? 
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" strokeWidth="0" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="cross-a" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L0.292893219,1.70710678 Z"></path> <path id="cross-c" d="M3.58578644,5 L0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L5,3.58578644 L8.29289322,0.292893219 C8.68341751,-0.0976310729 9.31658249,-0.0976310729 9.70710678,0.292893219 C10.0976311,0.683417511 10.0976311,1.31658249 9.70710678,1.70710678 L6.41421356,5 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L5,6.41421356 L1.70710678,9.70710678 C1.31658249,10.0976311 0.683417511,10.0976311 0.292893219,9.70710678 C-0.0976310729,9.31658249 -0.0976310729,8.68341751 0.292893219,8.29289322 L3.58578644,5 Z"></path> </defs> <g fill="none" fillRule="evenodd"> <g transform="translate(8 6)"> <mask id="cross-b" fill="#ffffff"> <use xlinkHref="#cross-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#cross-a"></use> <g fill="#4361ee" mask="url(#cross-b)"> <rect width="24" height="24" transform="translate(-8 -6)"></rect> </g> </g> <g transform="rotate(-90 12 5)"> <mask id="cross-d" fill="#ffffff"> <use xlinkHref="#cross-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#cross-c"></use> <g fill="#f72585" mask="url(#cross-d)"> <rect width="24" height="24" transform="translate(-7 -7)"></rect> </g> </g> </g> </g></svg> : passError === false ?
                <svg height='25px' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="check-a" d="M4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L1.90917969,5.46118164 C1.5186554,5.85170593 0.885490417,5.85170593 0.494966125,5.46118164 C0.104441833,5.07065735 0.104441833,4.43749237 0.494966125,4.04696808 L4.29289322,0.292893219 Z"></path> <path id="check-c" d="M10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 C10.3165825,15.0976311 9.68341751,15.0976311 9.29289322,14.7071068 L0.292893219,5.70710678 C-0.0976310729,5.31658249 -0.0976310729,4.68341751 0.292893219,4.29289322 L4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L2.41421356,5 L10.7071068,13.2928932 Z"></path> </defs> <g fill="none" fillRule="evenodd" transform="rotate(-90 11 7)"> <g transform="translate(1 1)"> <mask id="check-b" fill="#ffffff"> <use xlinkHref="#check-a"></use> </mask> <use fill="#D8D8D8" fillRule="nonzero" xlinkHref="#check-a"></use> <g fill="#4361ee" mask="url(#check-b)"> <rect width="24" height="24" transform="translate(-7 -5)"></rect> </g> </g> <mask id="check-d" fill="#ffffff"> <use xlinkHref="#check-c"></use> </mask> <use fill="#000000" fillRule="nonzero" xlinkHref="#check-c"></use> <g fill="#f72585" mask="url(#check-d)"> <rect width="24" height="24" transform="translate(-6 -4)"></rect> </g> </g> </g></svg> : ' '
                }
            </div>
        </div>
        <button className={styles.button} type='submit'>Sign Up</button>
    </form>
  )
}

export default SignUp