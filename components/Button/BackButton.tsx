'use client'
import styles from './Button.module.css'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export const BackButton = () => {
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router])
  return (
    <button onClick={onDismiss}
        className={`${styles.backButton} ${styles.button}`}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M17.5303 10.0303C17.8232 9.73744 17.8232 9.26256 17.5303 8.96967L12.5303 3.96967C12.2374 3.67678 11.7626 3.67678 11.4697 3.96967L6.46967 8.96967C6.17678 9.26256 6.17678 9.73744 6.46967 10.0303C6.76256 10.3232 7.23744 10.3232 7.53033 10.0303L12 5.56066L16.4697 10.0303C16.7626 10.3232 17.2374 10.3232 17.5303 10.0303Z" fill="var(--on-background)"></path> <g opacity="0.3"> <path d="M12.75 14.5C12.75 15.4534 12.4702 16.8667 11.6087 18.0632C10.7196 19.298 9.24444 20.25 7 20.25C6.58579 20.25 6.25 19.9142 6.25 19.5C6.25 19.0858 6.58579 18.75 7 18.75C8.75556 18.75 9.7804 18.0353 10.3913 17.1868C11.0298 16.3 11.25 15.2133 11.25 14.5L11.25 6.31066L12 5.56066L12.75 6.31066V14.5Z" fill="var(--on-background)"></path> <path d="M12.1977 3.77639C12.0432 3.73435 11.878 3.74254 11.7278 3.80095C11.8122 3.76805 11.904 3.75 12 3.75C12.0684 3.75 12.1347 3.75919 12.1977 3.77639Z" fill="var(--on-background)"></path> </g> </g></svg>
  </button>
  )
}
export const HomeButton = () => {
    const onDismiss = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      window.location.assign('/');
    }
  return (
    <button onClick={onDismiss}
        className={`${styles.backButton} ${styles.button}`}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495C22.2051 9.00229 22.0154 10.3208 21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579Z" stroke="var(--on-background)" strokeWidth="1.5"></path> <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
  </button>
  )
}
