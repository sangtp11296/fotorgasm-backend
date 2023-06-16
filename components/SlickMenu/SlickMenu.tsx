"use client"
import React from 'react'
import styles from './SlickMenu.module.css'
import './SlickMenu.css'
import films from '@/public/assets/images/on Films.png'
import something from '@/public/assets/images/on Something.png'
import vinyls from '@/public/assets/images/on Vinyls.png'
import moods from '@/public/assets/images/on Moods.png'
import memories from '@/public/assets/images/on Memories.png'
import running from '@/public/assets/images/on Running.png'
import music from '@/public/assets/images/on Music.png'
import reading from '@/public/assets/images/on Reading.png'
import Slider, { Settings } from 'react-slick'
import Image from 'next/image'

interface CustomArrowProps {
    key?: string;
    "data-role"?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<any>;
    currentSlide?: number;
    slideCount?: number;
  }

const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
    return (
        <div className="custom-arrow custom-prev-arrow" onClick={onClick}>
            <i className="fa fa-chevron-left" />
        </div>
    );
}
  
const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
    return (
        <div className="custom-arrow custom-next-arrow" onClick={onClick}>
            <i className="fa fa-chevron-right" />
        </div>
    );
}

const SlickMenu: React.FC = () => {
    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        swipeToSlide: true,
        responsive:[
            {
                breakpoint: 1000,
                settings:{
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 800,
                settings:{
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 550,
                settings:{
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 390,
                settings:{
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
        ]
    }
  return (
    <div className={styles.slickMenuContainer}>
        <Slider {...settings}>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Films' src={films} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Films</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Something' src={something} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Something</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Vinyls' src={vinyls} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Vinyls</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Moods' src={moods} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Moods</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Memories' src={memories} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Memories</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Running' src={running} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Running</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Music' src={music} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Music</div>
                </div>
            </li>
            <li className={styles.itemWrapper}>
                <div className={styles.itemPad}>
                <div className={styles.outerCircle}>
                    <Image alt='on Reading' src={reading} height={77} width={77}/>
                </div>
                <div className={styles.menuTitle}>on Reading</div>
                </div>
            </li>
        </Slider>
    </div>
  )
}

export default SlickMenu
