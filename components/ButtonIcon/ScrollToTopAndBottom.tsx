'use client'
import React, { useEffect, useState } from 'react'
import styles from './ButtonIcon\.module\.css'

interface Props {
    content: React.MutableRefObject<HTMLDivElement | null>
}
export const ScrollToTopAndBottom: React.FC<Props> = ({ content }) => {
    const [isTop, setIsTop] = useState(false);
    const [isBottom, setIsBottom] = useState(false);
    // Add a scroll event listener to track scroll position
    useEffect(() => {
        const handleScroll = () => {
            if(content.current){
                const maxScrollTop = content.current.scrollHeight - content.current.clientHeight;
                if(content.current.scrollTop > 200){
                    setIsTop(true);
                } else setIsTop(false);
                if(content.current.scrollTop < (maxScrollTop - 200)){
                    setIsBottom(true);
                } else setIsBottom(false);
            }
        };
        window.addEventListener('wheel', handleScroll);
        handleScroll();
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        if (content.current){
            content.current.scrollTo({
                top: 0,
                behavior: 'smooth', // Smooth scrolling animation
            });
            setIsTop(false);
            setIsBottom(true);
        }
    };
    const scrollToBottom = () => {
        if (content.current){
            const maxScrollTop = content.current.scrollHeight - content.current.clientHeight;
            content.current.scrollTo({
                top: maxScrollTop,
                behavior: 'smooth', // Smooth scrolling animation
            });
            setIsTop(true);
            setIsBottom(false);
        }
    };
  return (
    <div className={styles.twoButtonTB}>
        <button onClick={scrollToTop} className={`${styles.button} ${styles.scrollTop} ${isTop ? styles.visible : ''}`}>
            <svg height={40} width={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z" fill="var(--on-background)"></path> <path d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z" fill="var(--on-background)"></path> </g></svg>
        </button>
        <button onClick={scrollToBottom} className={`${styles.button} ${styles.scrollBottom} ${isBottom ? styles.visible : ''}`}>
            <svg height={40} width={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4L12.75 13.25H11.25L11.25 4C11.25 3.58579 11.5858 3.25 12 3.25Z" fill="var(--on-background)"></path> <path d="M6.00002 13.25C5.69667 13.25 5.4232 13.4327 5.30711 13.713C5.19103 13.9932 5.25519 14.3158 5.46969 14.5303L11.4697 20.5303C11.6103 20.671 11.8011 20.75 12 20.75C12.1989 20.75 12.3897 20.671 12.5304 20.5303L18.5304 14.5303C18.7449 14.3158 18.809 13.9932 18.6929 13.713C18.5768 13.4327 18.3034 13.25 18 13.25L6.00002 13.25Z" fill="var(--on-background)"></path> </g></svg>
        </button>
    </div>
  )
}
