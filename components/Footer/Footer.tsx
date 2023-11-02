import React from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import { FacebookIcon, InstagramIcon, MailIcon, MessengerIcon, SoundcloudIcon, SpotifyIcon, ThreadsIcon, YoutubeIcon } from '../ButtonIcon/StaticIcons'

export const Footer = () => {
  return (
    <div className={styles.footer}>
        <Link target="_blank" href='https://www.instagram.com/the.fotorgasm/'>
            <InstagramIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='https://www.facebook.com/sang.tra.11296/'>
            <FacebookIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='https://www.facebook.com/sang.tra.11296/'>
            <MessengerIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='https://www.threads.net/@the.fotorgasm'>
            <ThreadsIcon color='var(--on-background-matte)'/>
        </Link>
        <Link className={styles.brand} href='/'>
            <img height={60} width={60} className={styles.logoBrand} src='/assets/icons/fotorgasm-logo-no-ring.png'></img>
        </Link>
        <Link target="_blank" href='https://www.youtube.com/@fotorgasm'>
            <YoutubeIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='https://open.spotify.com/user/21yfttjxbypianq4yjlpw6bba'>
            <SpotifyIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='https://soundcloud.com/yuki-tra-11296'>
            <SoundcloudIcon color='var(--on-background-matte)'/>
        </Link>
        <Link target="_blank" href='mailto:sang.tp.11296@gmail.com'>
            <MailIcon color='var(--on-background-matte)'/>
        </Link>
    </div>
  )
}
