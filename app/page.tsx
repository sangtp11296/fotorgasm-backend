import ProfileInfo from '@/components/ProfileInfo/ProfileInfo'
import styles from './Home.module.css'
import SlickMenu from '@/components/SlickMenu/SlickMenu'
import PostGrid from '@/components/PostGrid/PostGrid'
const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.centerContainer}>
        <ProfileInfo/>
        <SlickMenu/>
        <PostGrid/>
      </div>
    </div>
  )
}

export default Home