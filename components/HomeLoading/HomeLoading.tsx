import Image from 'next/image'
import React from 'react'
import styles from './HomeLoading.module.css'

const HomeLoading = () => {
  return (
    <div className={styles.overlayBackground}>
      <div className={styles.profileAvatar}>
              <svg className={styles.ringOne} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve">  
              <defs>
                  <linearGradient id='linearRing1' x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor='#F72585' />
                  <stop offset="11%" stopColor='#B5179E'/>
                  <stop offset="22%" stopColor='#7209B7'/>
                  <stop offset="33%" stopColor='#560BAD'/>
                  <stop offset="44%" stopColor='#480CA8'/>
                  <stop offset="55%" stopColor='#3A0CA3'/>
                  <stop offset="66%" stopColor='#3F37C9'/>
                  <stop offset="77%" stopColor='#4361EE'/>
                  <stop offset="88%" stopColor='#4895EF'/>
                  <stop offset="100%" stopColor='#4CC9F0'/>
                  </linearGradient>
                  <filter id='glowRing'>
                  <feGaussianBlur stdDeviation='1' result='offset-blur'></feGaussianBlur>
                  </filter>
              </defs>
              <circle cx="50" cy="50" r={`40%`}></circle>
              </svg>
              <Image className={styles.logoBrand} width={130} height={130} priority={true} loading='eager' src='/assets/icons/fotorgasm-logo-no-ring.png' alt='fotorgasm'/>
      </div>
    </div>
  )
}

export default HomeLoading