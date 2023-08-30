'use client'
import React, { useEffect, useState } from 'react'
import styles from './PostSum.module.css'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDraft, openDraft, submitDraft, updateAuthor, updateCat, updateDesc, updateFormat, updateSlug, updateTag, updateTitle } from '@/redux/post/draft.slice'
import { FinalPost } from '@/types/Posts.type'
import { getPosts } from '@/utils/getPosts'

// Define props
interface Props {
  menuType: string,
}

// Define Post Meta Data type

const icons: { [key: string]: React.JSX.Element } = {
  'home': (
      <svg style={{fill:'var(--primary)', stroke:'none'}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> 
      <path fillRule="evenodd" clipRule="evenodd" d="M12.2796 3.71579C12.097 3.66261 11.903 3.66261 11.7203 3.71579C11.6678 3.7311 11.5754 3.7694 11.3789 3.91817C11.1723 4.07463 10.9193 4.29855 10.5251 4.64896L5.28544 9.3064C4.64309 9.87739 4.46099 10.0496 4.33439 10.24C4.21261 10.4232 4.12189 10.6252 4.06588 10.8379C4.00765 11.0591 3.99995 11.3095 3.99995 12.169V17.17C3.99995 18.041 4.00076 18.6331 4.03874 19.0905C4.07573 19.536 4.14275 19.7634 4.22513 19.9219C4.41488 20.2872 4.71272 20.5851 5.07801 20.7748C5.23658 20.8572 5.46397 20.9242 5.90941 20.9612C6.36681 20.9992 6.95893 21 7.82995 21H7.99995V18C7.99995 15.7909 9.79081 14 12 14C14.2091 14 16 15.7909 16 18V21H16.17C17.041 21 17.6331 20.9992 18.0905 20.9612C18.5359 20.9242 18.7633 20.8572 18.9219 20.7748C19.2872 20.5851 19.585 20.2872 19.7748 19.9219C19.8572 19.7634 19.9242 19.536 19.9612 19.0905C19.9991 18.6331 20 18.041 20 17.17V12.169C20 11.3095 19.9923 11.0591 19.934 10.8379C19.878 10.6252 19.7873 10.4232 19.6655 10.24C19.5389 10.0496 19.3568 9.87739 18.7145 9.3064L13.4748 4.64896C13.0806 4.29855 12.8276 4.07463 12.621 3.91817C12.4245 3.7694 12.3321 3.7311 12.2796 3.71579ZM11.1611 1.79556C11.709 1.63602 12.2909 1.63602 12.8388 1.79556C13.2189 1.90627 13.5341 2.10095 13.8282 2.32363C14.1052 2.53335 14.4172 2.81064 14.7764 3.12995L20.0432 7.81159C20.0716 7.83679 20.0995 7.86165 20.1272 7.88619C20.6489 8.34941 21.0429 8.69935 21.3311 9.13277C21.5746 9.49916 21.7561 9.90321 21.8681 10.3287C22.0006 10.832 22.0004 11.359 22 12.0566C22 12.0936 22 12.131 22 12.169V17.212C22 18.0305 22 18.7061 21.9543 19.2561C21.9069 19.8274 21.805 20.3523 21.5496 20.8439C21.1701 21.5745 20.5744 22.1701 19.8439 22.5496C19.3522 22.805 18.8274 22.9069 18.256 22.9543C17.706 23 17.0305 23 16.2119 23H15.805C15.7972 23 15.7894 23 15.7814 23C15.6603 23 15.5157 23.0001 15.3883 22.9895C15.2406 22.9773 15.0292 22.9458 14.8085 22.8311C14.5345 22.6888 14.3111 22.4654 14.1688 22.1915C14.0542 21.9707 14.0227 21.7593 14.0104 21.6116C13.9998 21.4843 13.9999 21.3396 13.9999 21.2185L14 18C14 16.8954 13.1045 16 12 16C10.8954 16 9.99995 16.8954 9.99995 18L9.99996 21.2185C10 21.3396 10.0001 21.4843 9.98949 21.6116C9.97722 21.7593 9.94572 21.9707 9.83107 22.1915C9.68876 22.4654 9.46538 22.6888 9.19142 22.8311C8.9707 22.9458 8.75929 22.9773 8.6116 22.9895C8.48423 23.0001 8.33959 23 8.21847 23C8.21053 23 8.20268 23 8.19495 23H7.78798C6.96944 23 6.29389 23 5.74388 22.9543C5.17253 22.9069 4.64769 22.805 4.15605 22.5496C3.42548 22.1701 2.8298 21.5745 2.4503 20.8439C2.19492 20.3523 2.09305 19.8274 2.0456 19.2561C1.99993 18.7061 1.99994 18.0305 1.99995 17.212L1.99995 12.169C1.99995 12.131 1.99993 12.0936 1.99992 12.0566C1.99955 11.359 1.99928 10.832 2.1318 10.3287C2.24383 9.90321 2.42528 9.49916 2.66884 9.13277C2.95696 8.69935 3.35105 8.34941 3.87272 7.8862C3.90036 7.86165 3.92835 7.83679 3.95671 7.81159L9.22354 3.12996C9.58274 2.81064 9.89467 2.53335 10.1717 2.32363C10.4658 2.10095 10.781 1.90627 11.1611 1.79556Z">
      </path> </g></svg>
  ),
  'blog': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke={'var(--on-background)'}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M12.6406 8.52979L17.4906 9.75979" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M11.6602 12.3999L14.5602 13.1399" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
  ),
  'video': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke={'var(--on-background)'}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.0799 8.58003V15.42C21.0799 16.54 20.4799 17.58 19.5099 18.15L13.5699 21.58C12.5999 22.14 11.3999 22.14 10.4199 21.58L4.47992 18.15C3.50992 17.59 2.90991 16.55 2.90991 15.42V8.58003C2.90991 7.46003 3.50992 6.41999 4.47992 5.84999L10.4199 2.42C11.3899 1.86 12.5899 1.86 13.5699 2.42L19.5099 5.84999C20.4799 6.41999 21.0799 7.45003 21.0799 8.58003Z" stroke="inherrit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9.75 11.9999V10.7999C9.75 9.25989 10.84 8.62993 12.17 9.39993L13.21 9.9999L14.25 10.5999C15.58 11.3699 15.58 12.6299 14.25 13.3999L13.21 13.9999L12.17 14.5999C10.84 15.3699 9.75 14.7399 9.75 13.1999V11.9999Z" stroke="inherrit" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
  ),
  'photo': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke={'var(--on-background)'}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="inherit" strokeWidth="2"></path>
            <path d="M17.0045 16.5022L12.7279 12.2256C9.24808 8.74578 7.75642 8.74578 4.27658 12.2256L3 13.5022" stroke="inherit" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M21 13.6702C18.9068 12.0667 17.4778 12.2919 15.198 14.3459" stroke="inherit" strokeWidth="2" strokeLinecap="round"></path> 
            <path d="M17 8C17 8.55228 16.5523 9 16 9C15.4477 9 15 8.55228 15 8C15 7.44772 15.4477 7 16 7C16.5523 7 17 7.44772 17 8Z" stroke="inherit" strokeWidth="2"></path> 
        </g>
    </svg>
  ),
  'music': (
    <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g  id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
            <path d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
        </g>
    </svg>
  )
}

const PostSum: React.FC<Props> = ({ menuType }) => {
  const addTrigger = useAppSelector((state) => state.draft.toggle);
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.draft); 
  const [error, setError] = useState<boolean>(false);

  const session = useSession();
  const user = session.data?.user;

  const handleTrigger = async () => {
    if (!addTrigger) {
      dispatch(openDraft());
    } else {
      dispatch(clearDraft());

      // Fetch api to delete everthing in draft folder
      const reqDeleteDraft = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/delete-draft',{
        method: 'DELETE'
      })
      if (reqDeleteDraft.ok) {
        const data = await reqDeleteDraft.json();
        console.log(data.message); // Success message from Lambda API
      } else {
          console.error('API request failed:', reqDeleteDraft.statusText);
      }
    }
  }

  // Handle get posts
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const handleGetPosts = async (page: number) => {
    const data = getPosts(page, 5);
  }
  useEffect(() => {
    handleGetPosts(page);
  }, [])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    if (draft.author && draft.format && draft.title && draft.category && draft.tags && draft.description && draft.coverUrl) {

      dispatch(submitDraft());
      if (draft.format === 'blog'){
        // Update cover photo first to get the thumbnail url and cover key
        const formData: FinalPost = {
          author: draft.author,
          category: draft.category,
          content: draft.content,
          coverKey: '',
          coverThumbnail: '',
          coverRes: draft.coverRes,
          description: draft.description,
          format: draft.format,
          title: draft.title,
          slug: draft.slug,
          tags: draft.tags,
        }
        // Move all draft images to posts folder in s3 bucket
        if(draft.content.includes('<img')){
          await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/move-draft', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify({
              slug: draft.slug,
              format: 'image'
            }),
          });
        }
  
        const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
          },
          body: JSON.stringify(formData)
        });
        res.status === 200 && window.location.reload();
      } else if (draft.format === 'video') {
        // Update cover photo first to get the thumbnail url and cover key
        const formData: FinalPost = {
          author: draft.author,
          category: draft.category,
          coverKey: '',
          coverThumbnail: '',
          coverRes: draft.coverRes,
          description: draft.description,
          format: draft.format,
          title: draft.title,
          slug: draft.slug,
          tags: draft.tags,
          videoSrc: {
            high: ``,
            medium: '',
            low: '',
          }
        }

        const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
          },
          body: JSON.stringify(formData)
        });

        // Move all draft videos to posts folder in s3 bucket
        await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/move-draft', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
          },
          body: JSON.stringify({
            slug: draft.slug,
            format: 'video'
          }),
        });

        res.status === 200 && window.location.reload();
      }
    } 
  }
  // Convert title to slug
  function toSlug(str: string)
    {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();     
    
        // xóa dấu
        str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|ä)/g, 'a');
        str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
        str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
        str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ö)/g, 'o');
        str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ü)/g, 'u');
        str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
        str = str.replace(/(đ)/g, 'd');
        str = str.replace(/(ß)/g, 'B');
    
        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');
    
        // Xóa khoảng trắng thay bằng ký tự -
        str = str.replace(/(\s+)/g, '-');
    
        // xóa phần dự - ở đầu
        str = str.replace(/^-+/g, '');
    
        // xóa phần dư - ở cuối
        str = str.replace(/-+$/g, '');
    
        // return
        return str;
    }
  return (
    <div className={`${styles.postSumContainer} ${styles.gridBlock}`}>
      <div className={styles.sumHeader}>
        <div className={styles.leftHeader}>
          <h2>{menuType}</h2>
          <div className={styles.button} onClick={handleTrigger}>
              {
                !addTrigger ? 
                <>
                  <svg height={16} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g data-name="add" id="add-2"> <g> <line fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="19" y2="5"></line> <line fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="5" x2="19" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
                  <h3>Add</h3>
                </>
                :
                <>
                  <svg height={13} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke='var(--primary)' strokeWidth="7"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
                  <h3>Close</h3>
                </>
              }
          </div>
        </div>
        <div className={styles.listCount}>
            <div className={styles.iconContainer}>
                {
                  icons.hasOwnProperty(menuType) && icons[menuType]
                }
            </div>
            <span>4</span>
        </div>
      </div>
      {
        addTrigger ? 
        <div className={styles.editField}>
          <form className={styles.textForm} onSubmit={(e) => handleSubmit(e)}>
              <div className={styles.textField}>
                  <label>Post Format<span className={styles.textDanger}> *</span></label>
                  <select name='post_format' placeholder='Select Post Format...' className={styles.textInput}
                  onChange={(e) => dispatch(updateFormat(e.target.value))}>
                      <option value='none' defaultValue='none' className={styles.items}>Select Post Format...</option>
                      <option value='blog' className={styles.items}>blog</option>
                      <option value='photo' className={styles.items}>photo</option>
                      <option value='video' className={styles.items}>video</option>
                      <option value='audio' className={styles.items}>audio</option>
                  </select>
              </div>
              <div className={styles.textField}>
                  <label>Title of the Post<span className={styles.textDanger}> *</span></label>
                  <input name='title' type='text' required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Title' onChange={(e) => {
                    dispatch(updateTitle(e.target.value));
                    dispatch(updateSlug(toSlug(e.target.value)));
                    }}/>
              </div>
              <div className={styles.textField}>
                  <label>Author<span className={styles.textDanger}> *</span></label>
                  <select name='author' placeholder='Author...' className={styles.textInput}  onChange={(e) => dispatch(updateAuthor(e.target.value))}>
                    <option value='' defaultValue='' className={styles.items}>Author...</option>
                    {
                      user?.team.map((mem, ind) => {
                        return <option key={ind} value={mem.name} className={styles.items}>{mem.name}</option>
                      })
                    }
                  </select>
              </div>
              <div className={styles.textField}>
                  <label>Category<span className={styles.textDanger}> *</span></label>
                  <select name='category' placeholder='Select category...' className={styles.textInput}  onChange={(e) => dispatch(updateCat(e.target.value))}>
                      <option value='' defaultValue='' className={styles.items}>Select section...</option>
                      <option value='Fotography' className={styles.items}>Fotography</option>
                      <option value='Films' className={styles.items}>Films</option>
                      <option value='Something' className={styles.items}>Something</option>
                      <option value='Vinyls' className={styles.items}>Vinyls</option>
                      <option value='Moods' className={styles.items}>Moods</option>
                      <option value='Memories' className={styles.items}>Memories</option>
                      <option value='Running' className={styles.items}>Running</option>
                      <option value='Music' className={styles.items}>Music</option>
                      <option value='Reading' className={styles.items}>Reading</option>
                  </select>
              </div>
              <div className={styles.textField}>
                  <label>Tags<span className={styles.textDanger}> *</span></label>
                  <input name='tags' type='text' className={styles.textInput} onChange={(e) => dispatch(updateTag(e.target.value.split(', ')))}/>
              </div>
              <div className={styles.textField}>
                <label>Description<span className={styles.textDanger}> *</span></label>
                <textarea name='description' style={{maxHeight:'65px', maxWidth:'250px',minWidth:'250px', minHeight:'28px'}} className={styles.textInput} placeholder='Description' onChange={(e) => dispatch(updateDesc(e.target.value))}></textarea>
              </div>
              <div className={styles.submit}>
                  <button className={styles.button} type='submit'>Submit</button>
              </div>
              {error ? <div><h5 style={{color:'red',textAlign:'right'}}>Something went wrong! Please check again...</h5></div>:null}
          </form>
        </div> 
        :
        <div className={styles.postList}>
            
        </div>
      }
    </div>
  )
}

export default PostSum