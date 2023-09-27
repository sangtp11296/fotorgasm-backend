'use client'
import React, { useEffect, useState } from 'react'
import styles from './Quotes.module.css'
import { getQuote } from '@/utils/getQuote'

export const Quotes =  ({ invisible }: { invisible: boolean} ) => {
  const [quote, setQuote] = useState<{ quote: string; author: string }>();
  const handleGetQuote = async () => {
    const data = await getQuote();
    setQuote(data);
  }
  useEffect(() => {
    handleGetQuote();
  },[])
  return (
    <div className={`${styles.quotes} ${invisible && styles.visible}`}>
      <h3>
        Here is your gift quote!
      </h3>
        {quote && (
        <>
          <div className={styles.quoteForm}>
              <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#ffffff" transform="rotate(180)">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> </style> <g> <path fill='var(--on-background-matte)' className="st0" d="M119.472,66.59C53.489,66.59,0,120.094,0,186.1c0,65.983,53.489,119.487,119.472,119.487 c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.135,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.829-6.389 c82.925-90.7,115.385-197.448,115.385-251.8C238.989,120.094,185.501,66.59,119.472,66.59z"></path> <path fill='var(--on-background-matte)'  className="st0" d="M392.482,66.59c-65.983,0-119.472,53.505-119.472,119.51c0,65.983,53.489,119.487,119.472,119.487 c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.136,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.828-6.389 C479.539,347.2,512,240.452,512,186.1C512,120.094,458.511,66.59,392.482,66.59z"></path> </g> </g>
              </svg>
              <p className={styles.quote}>{quote.quote}</p>
              <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#ffffff" transform="rotate(0)">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css">  </style> <g> <path fill='var(--on-background-matte)' className="st0" d="M119.472,66.59C53.489,66.59,0,120.094,0,186.1c0,65.983,53.489,119.487,119.472,119.487 c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.135,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.829-6.389 c82.925-90.7,115.385-197.448,115.385-251.8C238.989,120.094,185.501,66.59,119.472,66.59z"></path> <path fill='var(--on-background-matte)' className="st0" d="M392.482,66.59c-65.983,0-119.472,53.505-119.472,119.51c0,65.983,53.489,119.487,119.472,119.487 c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.136,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.828-6.389 C479.539,347.2,512,240.452,512,186.1C512,120.094,458.511,66.59,392.482,66.59z"></path> </g> </g>
              </svg>
          </div>
          <div className={styles.authorForm}>
            <hr/>
            <p className={styles.author}>{quote.author}</p>
          </div>
        </>
      )}
    </div>
  )
}
