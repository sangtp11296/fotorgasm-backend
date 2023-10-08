'use client'
import React, { useEffect, useState } from 'react'
import styles from './Button.module.css'

interface Props {
    content: React.MutableRefObject<HTMLDivElement | null>
}
  
export const ScrollToHeadAndTail: React.FC<Props> = ({ content }) => {
    const [isLeft, setIsLeft] = useState(false);
    const [isRight, setIsRight] = useState(true);

    useEffect(() => {
        const updateScrollPosition = () => {
            if(content.current){
                const maxScrollLeft = content.current.scrollWidth - content.current.clientWidth;
                if(content.current.scrollLeft > 200){
                    setIsLeft(true);
                } else setIsLeft(false);
                if(content.current.scrollLeft >= (maxScrollLeft - 200)){
                    setIsRight(false);
                } else setIsRight(true);
            }
          };
      
          window.addEventListener('wheel', updateScrollPosition);
          window.addEventListener('resize', updateScrollPosition);
           // Initial update
        updateScrollPosition();

        // Clean up the event listeners
        return () => {
        window.removeEventListener('wheel', updateScrollPosition);
        window.removeEventListener('resize', updateScrollPosition);
        };
    }, [])
    const ScrollToHead = () => {
        content.current?.scrollTo({
            left: 0,
            behavior: 'smooth', // Smooth scrolling animation
        });
        setIsLeft(false);
        setIsRight(true);
    };
    const ScrollToTail = () => {
        content.current?.scrollTo({
            left: content.current.scrollWidth - content.current.clientWidth,
            behavior: 'smooth', // Smooth scrolling animation
        });
        setIsRight(false);
        setIsLeft(true);
    };
  return (
    <div className={styles.twoButton}>
        <button onClick={ScrollToHead} className={`${styles.button} ${styles.scrollHead} ${isLeft ? styles.visible : ''}`}>
            <svg height={40} width={40}  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M20.75 12C20.75 11.5858 20.4142 11.25 20 11.25H10.75V12.75H20C20.4142 12.75 20.75 12.4142 20.75 12Z" fill="var(--on-background)"></path> <path d="M10.75 18C10.75 18.3034 10.5673 18.5768 10.287 18.6929C10.0068 18.809 9.68417 18.7449 9.46967 18.5304L3.46967 12.5304C3.32902 12.3897 3.25 12.1989 3.25 12C3.25 11.8011 3.32902 11.6103 3.46967 11.4697L9.46967 5.46969C9.68417 5.25519 10.0068 5.19103 10.287 5.30711C10.5673 5.4232 10.75 5.69668 10.75 6.00002V18Z" fill="var(--on-background)"></path> </g></svg>
        </button>
        <button onClick={ScrollToTail} className={`${styles.button} ${styles.scrollTail} ${isRight ? styles.visible : ''}`}>
            <svg height={40} width={40}  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H13.25V12.75H4C3.58579 12.75 3.25 12.4142 3.25 12Z" fill="var(--on-background)"></path> <path d="M13.25 12.75V18C13.25 18.3034 13.4327 18.5768 13.713 18.6929C13.9932 18.809 14.3158 18.7449 14.5303 18.5304L20.5303 12.5304C20.671 12.3897 20.75 12.1989 20.75 12C20.75 11.8011 20.671 11.6103 20.5303 11.4697L14.5303 5.46969C14.3158 5.25519 13.9932 5.19103 13.713 5.30711C13.4327 5.4232 13.25 5.69668 13.25 6.00002V11.25V12.75Z" fill="var(--on-background)"></path> </g></svg>
        </button>
    </div>
  )
}
