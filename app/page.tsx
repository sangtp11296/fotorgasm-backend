import ProfileInfo from '@/components/ProfileInfo/ProfileInfo'
import styles from './Home.module.css'
import SlickMenu from '@/components/SlickMenu/SlickMenu'
import PostGrid from '@/components/PostGrid/PostGrid'
import ScrollToTop from '@/components/ButtonIcon/ScrollToTop'
import { Footer } from '@/components/Footer/Footer'
import HomeLoading from '@/components/HomeLoading/HomeLoading'
const Home = () => {
  return (
    // <div className={styles.homePage}>
    //   <div className={styles.centerContainer}>
    //     <ProfileInfo/>
    //     <SlickMenu/>
    //     <PostGrid/>
    //     <ScrollToTop/>
    //     <Footer/>
    //   </div>
    // </div>
    <HomeLoading/>
  )
}

export default Home