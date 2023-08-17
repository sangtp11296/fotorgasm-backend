'use client'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './Modal.module.css'

export const Modal = ({ children }: { children: React.ReactNode }) => {
    const overlay = useRef(null);
    const wrapper = useRef(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back()
    }, [router])

    const onClick: React.MouseEventHandler = useCallback((e) => {
        if (e.target === overlay.current || e.target === wrapper.current) {
            if (onDismiss) onDismiss()
        }
    }, [onDismiss, overlay, wrapper])

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onDismiss()
    }, [onDismiss])

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [onKeyDown])

  return (
    <div
      ref={overlay}
      className={styles.overlay}
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className={styles.wrapper}
      >
        {children}
      </div>
    </div>
  )
}
