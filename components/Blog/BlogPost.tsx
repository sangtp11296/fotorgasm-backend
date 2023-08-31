
import { Photo } from '@/types/Photos.type'
import styles from './BlogPost.module.css'
import Image from 'next/image'
import { DraftPost, FetchedPost } from '@/types/Posts.type';

interface Props {
  data: FetchedPost
  // data: DraftPost
}
const BlogPost: React.FC<Props> = ({ data }) => {
  
  function randomNum(){
    // Generate a random number between min and max
    const num = Math.floor(Math.random() * (100000000 - 0 + 1)) + 0;
    const thousands = Math.floor(num / 1000);
    const millions = Math.floor(num / 1000000);
    const remainder = Math.floor((num % 1000) / 100);
    // Check if the number is greater than 1000
    if (num >= 1000 && num < 10000) {
      // Add "k" as thousands to the number
      if (remainder === 0){
        return <span>{thousands}k</span>;
      } else return <span>{thousands}k{remainder}</span>;
    } else if (num === 0) {
      return null;
    } else if (num >= 10000 && num < 1000000){
        return <span>{thousands}k</span>
    } else if (num >= 1000000){
        return <span>{millions}M</span>
    } else {
      return <span>{num}</span>;
    } 
  }

  return (
    <div id={data._id} className={`${styles.blogPost}`}>
      <div className={`${styles.postCover}`}>
        <button className={styles.fullScreen}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
              <path d="M21 14V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H14M10 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10M15 9L21 3M21 3H15M21 3V9M9 15L3 21M3 21H9M3 21L3 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              </path> 
              </g>
          </svg>
        </button>
        {/* <button className={styles.minorScreen}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#ffffff"></path> </g></svg>
        </button> */}
        <div className={styles.coverImage}>
          {
            // Check if photo cover is available or not
            data.coverUrl ? 
            <Image priority={true} fill key={data._id} src={data.coverUrl} alt={`${data.title}`} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> 
            :
            <Image priority={true} fill key={data._id} src={data.coverThumbnail} alt={`${data.title}`} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> 
          }
          
        </div>
        <div className={`${styles.postOverlay} `}/>

        <div className={styles.postInfo}>
            <div className={`${styles.postCat}`}>
                <Image alt={`on ${data.category}`} src={`/assets/images/on ${data.category}.png`} height={25} width={25}/>
                <span>on {data.category}</span>
            </div>
            <div className={styles.titlePost}>
                <h2>{data.title}</h2>
            </div>
            <div className={styles.postDesc}>
                {data.description}
            </div>
        </div>

        <div className={styles.postSocial}>
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.5 3.5L3.5 9L10 12L17 7L12 14L15 20.5L20.5 3.5Z" strokeWidth='1.2' stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {randomNum()}
            <div className={styles.iconContainer}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='var(--on-background-matte)'><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M12.6406 8.52979L17.4906 9.75979" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M11.6602 12.3999L14.5602 13.1399" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost