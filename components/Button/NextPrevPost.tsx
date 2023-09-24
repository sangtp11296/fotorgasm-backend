'use client'
import React from 'react'
import styles from './Button.module.css'
import Link from 'next/link'
export const NextPrevPost = ({ next, prev }: { next: string, prev: string }) => {
  return (
    <>
    {
      next !== '' ?
      <Link href={`/posts/${next}`} className={`${styles.button} ${styles.nextPrev} ${styles.next}`}>
        <svg height={60} width={60} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M6.25 19C6.25 19.3139 6.44543 19.5946 6.73979 19.7035C7.03415 19.8123 7.36519 19.7264 7.56944 19.4881L13.5694 12.4881C13.8102 12.2073 13.8102 11.7928 13.5694 11.5119L7.56944 4.51194C7.36519 4.27364 7.03415 4.18773 6.73979 4.29662C6.44543 4.40551 6.25 4.68618 6.25 5.00004L6.25 19Z" fill="var(--on-background)"></path> <path fillRule="evenodd" clipRule="evenodd" d="M10.5119 19.5695C10.1974 19.2999 10.161 18.8264 10.4306 18.5119L16.0122 12L10.4306 5.48811C10.161 5.17361 10.1974 4.70014 10.5119 4.43057C10.8264 4.161 11.2999 4.19743 11.5695 4.51192L17.5695 11.5119C17.8102 11.7928 17.8102 12.2072 17.5695 12.4881L11.5695 19.4881C11.2999 19.8026 10.8264 19.839 10.5119 19.5695Z" fill="var(--on-background)"></path> </g></svg>
      </Link>
      : ''
    }
    {
      prev !== '' ?
      <Link href={`/posts/${prev}`} className={`${styles.button} ${styles.nextPrev} ${styles.prev}`}>
        <svg height={60} width={60} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M17.75 19C17.75 19.3139 17.5546 19.5946 17.2602 19.7035C16.9658 19.8123 16.6348 19.7264 16.4306 19.4881L10.4306 12.4881C10.1898 12.2073 10.1898 11.7928 10.4306 11.5119L16.4306 4.51194C16.6348 4.27364 16.9658 4.18773 17.2602 4.29662C17.5546 4.40551 17.75 4.68618 17.75 5.00004L17.75 19Z" fill="var(--on-background)"></path> <path fillRule="evenodd" clipRule="evenodd" d="M13.4881 19.5695C13.8026 19.2999 13.839 18.8264 13.5694 18.5119L7.98781 12L13.5694 5.48811C13.839 5.17361 13.8026 4.70014 13.4881 4.43057C13.1736 4.161 12.7001 4.19743 12.4306 4.51192L6.43056 11.5119C6.18981 11.7928 6.18981 12.2072 6.43056 12.4881L12.4306 19.4881C12.7001 19.8026 13.1736 19.839 13.4881 19.5695Z" fill="var(--on-background)"></path> </g></svg>
    </Link>: ''
    }
    </>
  )
}
// export const PrevPost = ({ prev }: { prev: string }) => {
//   return (
//     <>
//       {
//         prev !== '' ?
//         <Link onClick={handleClick} href={`/posts/${prev}`} className={`${styles.button} ${styles.nextPrev} ${styles.prev}`}>
//           <svg height={60} width={60} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M17.75 19C17.75 19.3139 17.5546 19.5946 17.2602 19.7035C16.9658 19.8123 16.6348 19.7264 16.4306 19.4881L10.4306 12.4881C10.1898 12.2073 10.1898 11.7928 10.4306 11.5119L16.4306 4.51194C16.6348 4.27364 16.9658 4.18773 17.2602 4.29662C17.5546 4.40551 17.75 4.68618 17.75 5.00004L17.75 19Z" fill="var(--on-background)"></path> <path fillRule="evenodd" clipRule="evenodd" d="M13.4881 19.5695C13.8026 19.2999 13.839 18.8264 13.5694 18.5119L7.98781 12L13.5694 5.48811C13.839 5.17361 13.8026 4.70014 13.4881 4.43057C13.1736 4.161 12.7001 4.19743 12.4306 4.51192L6.43056 11.5119C6.18981 11.7928 6.18981 12.2072 6.43056 12.4881L12.4306 19.4881C12.7001 19.8026 13.1736 19.839 13.4881 19.5695Z" fill="var(--on-background)"></path> </g></svg>
//       </Link>: ''
//       }
//     </>
//   )
// }

