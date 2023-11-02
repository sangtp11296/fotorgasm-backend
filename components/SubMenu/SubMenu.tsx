'use client'
import React from 'react'
import styles from './SubMenu.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateMainMenu } from '@/redux/clickMenu/click.slice'
import { AllIcon, BlogIcon, MusicIcon, PhotoIcon, VideoIcon } from '../ButtonIcon/StaticIcons'


const SubMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const menu = useAppSelector(state => state.click.mainMenu);
    interface MenuIcons {
        name: string;
        title: string;
        icon: JSX.Element;
    }
    const menuIcons: MenuIcons[] = [
        {
            name: 'all',
            title: 'All',
            icon: (
                <AllIcon color={menu==='all'?'var(--on-background)':'var(--on-background-matte)'}/>
            )
        },
        {
            name: 'blog',
            title: 'Blogs',
            icon: (
                <BlogIcon color={menu==='blog'?'var(--on-background)':'var(--on-background-matte)'}/>
            )
        },
        {
            name: 'video',
            title: 'Videos',
            icon: (
                <VideoIcon color={menu==='video'?'var(--on-background)':'var(--on-background-matte)'}/>
            )
        },
        {
            name: 'photo',
            title: 'Photos',
            icon: (
                <PhotoIcon color={menu==='photo'?'var(--on-background)':'var(--on-background-matte)'}/>
            )
        },
        {
            name: 'music',
            title: 'Music',
            icon: (
                <MusicIcon color={menu==='music'?'var(--on-background)':'var(--on-background-matte)'}/>
            )
        },
    ];
  return (
    <div className={styles.postCatalog}>
        {
            menuIcons.map((icon: MenuIcons, ind: number) => {
                return (
                    <div key={ind} className={styles.postSort} onClick={() => {
                            dispatch(updateMainMenu(icon.name));
                        }} style={{color:`${menu===icon.name?'var(--on-background)':'var(--on-background-matte)'}`, borderTop:`${menu===icon.name?'1px solid var(--on-background)':''}`}}>
                            <button>
                                {icon.icon}
                            </button>
                        <span>{icon.title}</span>
                    </div>
                )
            })
        }
    </div>
  )
}

export default SubMenu