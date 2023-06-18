import React from 'react'
import styles from './TeamContainer.module.css'
import { title } from 'process'

interface teamMembers {
    name: string,
    title: string,
    img: string
}

const TeamContainer = () => {
    const teamMembers: teamMembers[] = [
        {
            name: 'Trần Phúc Sang',
            title: 'Reader • Traveler • Writer',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Trà',
            title: 'Photographer • Artist',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Yuki',
            title: 'Musician • Listener • Collector',
            img: '/assets/images/portrait.png'
        },
        {
            name: '陈福创',
            title: 'Interpreter',
            img: '/assets/images/portrait.png'
        },
        {
            name: 'Người Đi Bán Mưa',
            title: 'Muted',
            img: '/assets/images/portrait.png'
        },
    ]
  return (
    <div className={`${styles.teamContainer} ${styles.gridBlock}`}>
        <div className={styles.teamHeader}>
            <h1>Team</h1>
            <div className={styles.teamCount}>
                <div>
                    <svg height='20px' fill="var(--primary)" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"></path></g></svg>

                </div>
                <span>4</span>
            </div>
        </div>
        <div className={styles.teamMembers}>
            {
                teamMembers.map((member, ind) => {
                    return(
                        <div key={ind} className={styles.memberContainer}>
                            <img height='50px' src={member.img}></img>
                            <div className={styles.memberName}>
                                <h2>{member.name}</h2>
                                <h3>{member.title}</h3>
                            </div>
                            <div className={styles.functionDot}>
                                <svg height='20px' fill="var(--on-background)" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Glyph" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"></path><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"></path><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"></path></g></svg>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <div className={styles.addMembers}>
            <div className={styles.button}>
                <svg height='30px' viewBox="0 0 24 24" fill="url(#gradient1)" xmlns="http://www.w3.org/2000/svg">
                    <linearGradient id="gradient1" x1="100%" y1="100%" x2="00%" y2="00%">
                    <stop offset="0%" stopColor='#ee25f7'/>
                    <stop offset="50%" stopColor='#560bad'/>
                    <stop offset="100%" stopColor='#294fb6'/>
                    </linearGradient>
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path> </g></svg>
            </div>
            <h2>Invite new team member</h2>
        </div>
    </div>
  )
}

export default TeamContainer