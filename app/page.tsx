import ProfileInfo from '@/components/ProfileInfo/ProfileInfo'
import styles from './Home.module.css'
import SlickMenu from '@/components/SlickMenu/SlickMenu'
import PostGrid from '@/components/PostGrid/PostGrid'
import ScrollToTop from '@/components/Button/ScrollToTop'
const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.centerContainer}>
        <ProfileInfo/>
        <SlickMenu/>
        <PostGrid/>
        <ScrollToTop/>
      </div>
    </div>
  )
}

export default Home