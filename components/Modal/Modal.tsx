'use client'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './Modal.module.css'

export const Modal = ({ children }: { children: React.ReactNode }) => {
    const overlay = useRef(null);
    const button = useRef(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back()
    }, [router])

    const onClick: React.MouseEventHandler = useCallback((e) => {
        if (e.target === overlay.current || e.target === button.current) {
            if (onDismiss) onDismiss()
        }
    }, [onDismiss, overlay, button])

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onDismiss()
    }, [onDismiss])

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onKeyDown])

    useEffect(() => {
        // Add the CSS class to disable scrolling when the modal is open
        document.body.classList.add('no-scroll');

        // Remove the CSS class and enable scrolling when the modal is closed
        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, []);

  return (
    <div
      ref={overlay}
      className={styles.overlay}
      onClick={onClick}
    >
        {children}
    </div>
  )
}
