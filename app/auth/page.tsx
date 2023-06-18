import Link from 'next/link'
import styles from './Auth.module.css'
import Image from 'next/image'

const Auth = () => {
  return (
    <Link href='/' className={styles.brandName}>
        <Image priority={true} alt='fotorgasm-logo-brand-name' fill className={styles.logoBrand} src='/assets/icons/fotorgasm-brand-name-white.png'></Image>
    </Link>
  )
}

export default Auth