import React from 'react'
import styles from '@/components/ProfileInfo/ProfileInfo.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FacebookIcon, InstagramIcon, MailIcon, MessengerIcon, SoundcloudIcon, SpotifyIcon, ThreadsIcon, YoutubeIcon } from '../ButtonIcon/StaticIcons'

const ProfileInfo = () => {
  return (
    <div className={styles.profileInfo}>
        <div className={styles.profileAvatar}>
            <svg className={styles.ringOne} viewBox="0 0 100 100" height='150px' width='150px' xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve">  
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
            <circle cx="50" cy="50" r="47"></circle>
            </svg>
            <Image className={styles.logoBrand} width={130} height={130} priority={true} loading='eager' src='/assets/icons/fotorgasm-logo-no-ring.png' alt='fotorgasm'/>
            {/* <img className={styles.logoBrand} src='../public/assets/images/portrait.png'></img> */}
        </div>
        <div className={styles.profileMain}>
            <div className={styles.profileName}>
                <span>@</span><h1>fotorgasm</h1>
            </div>
            <div className={styles.profileDesc}>
                <h2>/fəˈtɔːɡæzəm/</h2>
                <h3>Trần Phúc Sang • Trà • Yuki • 陈福创</h3>
                A part-time <b>D</b>reamer <span>•</span> <b>P</b>hotographer <span>•</span> <b>M</b>usician <span>•</span> <b>L</b>istener  <span>•</span> <b>S</b>toryteller<br/>↳ finds orgaSm in the world of madness<br/>
                <Link href='' className={styles.hashTag}>#fotorgasm</Link>
            </div>
            <div className={styles.socialMenu}>
                <Link target="_blank" href='https://www.instagram.com/the.fotorgasm/'>
                    <InstagramIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://www.facebook.com/sang.tra.11296/'>
                    <FacebookIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://www.facebook.com/sang.tra.11296/'>
                    <MessengerIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://www.threads.net/@the.fotorgasm'>
                    <ThreadsIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://open.spotify.com/user/21yfttjxbypianq4yjlpw6bba'>
                    <SpotifyIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://www.youtube.com/@fotorgasm'>
                    <YoutubeIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='https://soundcloud.com/yuki-tra-11296'>
                    <SoundcloudIcon color='var(--on-background)'/>
                </Link>
                <Link target="_blank" href='mailto:sang.tp.11296@gmail.com'>
                    <MailIcon color='var(--on-background)'/>
                </Link>
            </div>
        </div>
        </div>
  )
}

export default ProfileInfo