'use client'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Modal.module.css'
import { useAppSelector } from '@/redux/hooks'
import { NextPrevPost } from '../ButtonIcon/NextPrevPost'
import { usePathname } from "next/navigation";

type Props = {
    params: { slug: string }
    children: React.ReactNode
  }
export const Modal: React.FC<Props> = ({ children, params }) => {
    const pathname = usePathname();
    const overlay = useRef(null);
    const button = useRef(null);
    const router = useRouter();
    const slugs = useAppSelector(state => state.fetchedPost.slugs);

    // Set next and prev post
    const [nextPost, setNextPost] = useState('');
    const [prevPost, setPrevPost] = useState('');
    useEffect(() => {
        if(params.slug){
            const slug = params.slug;
            const ind = slugs.indexOf(slug);
            if(slugs[ind + 1]){
                setNextPost(slugs[ind + 1]);
            }
            if(slugs[ind - 1]){
                setPrevPost(slugs[ind - 1]);
            }
        }
    },[])
    const onDismiss = useCallback(() => {
        router.back();
    }, [router])

    const onClick: React.MouseEventHandler = useCallback((e) => {
        e.preventDefault();
        if (e.target === overlay.current || e.target === button.current) {
            if (onDismiss) onDismiss()
        }
    }, [onDismiss, overlay, button])

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        // e.preventDefault();
        if (e.key === 'Escape') onDismiss()
    }, [onDismiss])

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onKeyDown])


    // Decide whether on or off modal when using next, prev function
    const setModal = pathname.includes('/posts/') || pathname.includes('/albums/');
    if (!setModal) {
        return null;
    } 
    useEffect(() => {
        // Add the CSS class to disable scrolling when the modal is open
        document.body.classList.add('no-scroll');

        // Remove the CSS class and enable scrolling when the modal is closed
        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, [setModal]);

   
  return (
    <div
      ref={overlay}
      className={styles.overlay}
      onClick={onClick}
    >
        <NextPrevPost next={nextPost} prev={prevPost}/>
        {children}
    </div>
  )
}
