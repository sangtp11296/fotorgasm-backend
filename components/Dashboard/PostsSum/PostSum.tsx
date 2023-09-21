'use client'
import React, { useEffect, useState } from 'react'
import styles from './PostSum.module.css'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDraft, openDraft, submitDraft, updateAuthor, updateCat, updateContent, updateCoverKey, updateCoverRes, updateCoverThumbnail, updateDesc, updateFormat, updateId, updateSlug, updateStatus, updateTag, updateTitle } from '@/redux/post/draft.slice'
import { FetchedPost, FinalPost } from '@/types/Posts.type'
import { getPosts } from '@/utils/getPosts'
import Slider from 'react-slick'

// Define props
interface Props {
  menuType: string,
}

// Define Post Meta Data type

const icons: { [key: string]: React.JSX.Element } = {
  'home': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495C22.2051 9.00229 22.0154 10.3208 21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22ZM8.39757 15.5532C8.64423 15.2204 9.11395 15.1506 9.44671 15.3973C10.1751 15.9371 11.0542 16.2498 12.0001 16.2498C12.946 16.2498 13.8251 15.9371 14.5535 15.3973C14.8863 15.1506 15.356 15.2204 15.6026 15.5532C15.8493 15.8859 15.7795 16.3557 15.4467 16.6023C14.4743 17.3231 13.2851 17.7498 12.0001 17.7498C10.7151 17.7498 9.5259 17.3231 8.55349 16.6023C8.22072 16.3557 8.15092 15.8859 8.39757 15.5532Z" fill='var(--primary)'></path> </g></svg>
  ),
  'blog': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M20.8293 10.7154L20.3116 12.6473C19.7074 14.9024 19.4052 16.0299 18.7203 16.7612C18.1795 17.3386 17.4796 17.7427 16.7092 17.9223C16.6129 17.9448 16.5152 17.9621 16.415 17.9744C15.4999 18.0873 14.3834 17.7881 12.3508 17.2435C10.0957 16.6392 8.96815 16.3371 8.23687 15.6522C7.65945 15.1114 7.25537 14.4115 7.07573 13.641C6.84821 12.6652 7.15033 11.5377 7.75458 9.28263L8.27222 7.35077C8.3591 7.02654 8.43979 6.7254 8.51621 6.44561C8.97128 4.77957 9.27709 3.86298 9.86351 3.23687C10.4043 2.65945 11.1042 2.25537 11.8747 2.07573C12.8504 1.84821 13.978 2.15033 16.2331 2.75458C18.4881 3.35883 19.6157 3.66095 20.347 4.34587C20.9244 4.88668 21.3285 5.58657 21.5081 6.35703C21.7356 7.3328 21.4335 8.46034 20.8293 10.7154ZM11.0524 9.80589C11.1596 9.40579 11.5709 9.16835 11.971 9.27556L16.8006 10.5697C17.2007 10.6769 17.4381 11.0881 17.3309 11.4882C17.2237 11.8883 16.8125 12.1257 16.4124 12.0185L11.5827 10.7244C11.1826 10.6172 10.9452 10.206 11.0524 9.80589ZM10.2756 12.7033C10.3828 12.3032 10.794 12.0658 11.1941 12.173L14.0919 12.9495C14.492 13.0567 14.7294 13.4679 14.6222 13.868C14.515 14.2681 14.1038 14.5056 13.7037 14.3984L10.8059 13.6219C10.4058 13.5147 10.1683 13.1034 10.2756 12.7033Z" fill='var(--primary)'></path> <path opacity="0.5" d="M16.4149 17.9745C16.2064 18.6128 15.8398 19.1903 15.347 19.6519C14.6157 20.3368 13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1496 6.87466 21.922C6.10421 21.7424 5.40432 21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7152C2.15033 12.4601 1.84821 11.3325 2.07573 10.3568C2.25537 9.5863 2.65945 8.88641 3.23687 8.3456C3.96815 7.66068 5.09569 7.35856 7.35077 6.75431C7.7774 6.64 8.16369 6.53649 8.51621 6.44534C8.51618 6.44545 8.51624 6.44524 8.51621 6.44534C8.43979 6.72513 8.3591 7.02657 8.27222 7.35081L7.75458 9.28266C7.15033 11.5377 6.84821 12.6653 7.07573 13.6411C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 10.0957 16.6393 12.3508 17.2435C14.3833 17.7881 15.4999 18.0873 16.4149 17.9745Z" fill='var(--primary)'></path> </g></svg>
  ),
  'video': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 2.0315C11.1701 2.01094 11.0863 2 11 2H8.66667C8.345 2 8.03979 2 7.75 2.00094L7.75002 2.00684V6.25032L11.25 6.25032L11.25 2.0315Z" fill='var(--primary)'></path> <path d="M11.25 7.75032L2.00195 7.75032L2.00003 7.75032L2 14C2 14.4517 2 14.8673 2.00398 15.2505L2.01927 15.2503H11.25V7.75032Z" fill='var(--primary)'></path> <path d="M11.25 16.7503L7.75002 16.7503L7.75002 19.9938L7.75 19.9991C8.03979 20 8.345 20 8.66667 20H11.25L11.25 16.7503Z" fill='var(--primary)'></path> <path d="M6.25002 2.02325C4.64034 2.07802 3.6617 2.26183 2.97631 2.87868C2.22628 3.55371 2.05245 4.54479 2.01216 6.25032L6.25002 6.25032V2.02325Z" fill='var(--primary)'></path> <path d="M6.25002 16.7503L6.25002 19.9768C4.64034 19.922 3.6617 19.7382 2.97631 19.1213C2.38678 18.5907 2.15323 17.8649 2.0607 16.7503L6.25002 16.7503Z" fill='var(--primary)'></path> <g opacity="0.5"> <path d="M12.75 7.00596L12.75 7.00032L12.75 6.99468V4H15.3333C15.655 4 15.9602 4 16.25 4.00094L16.25 4.00684V8.25032L12.75 8.25032V7.00596Z" fill='var(--primary)'></path> <path d="M12.75 16.0059L12.75 16.0003L12.75 15.9947L12.75 9.75032L21.9981 9.75032L22 9.75032L22 16C22 16.4517 22 16.8673 21.996 17.2505L21.9808 17.2503H12.75V16.0059Z" fill='var(--primary)'></path> <path d="M12.75 21.9685C12.8299 21.9891 12.9137 22 13 22H15.3333C15.655 22 15.9602 22 16.25 21.9991L16.25 21.9938L16.25 18.7503H12.75V21.9685Z" fill='var(--primary)'></path> <path d="M17.75 8.25032V4.02325C19.3597 4.07802 20.3383 4.26183 21.0237 4.87868C21.7737 5.55371 21.9476 6.54479 21.9878 8.25032L17.75 8.25032Z" fill='var(--primary)'></path> <path d="M21.9393 18.7503H17.75V21.9768C19.3597 21.922 20.3383 21.7382 21.0237 21.1213C21.6132 20.5907 21.8468 19.8649 21.9393 18.7503Z" fill='var(--primary)'></path> </g> </g></svg>
  ),
  'photo': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M11.1822 15.3618L6.89249 11.0721C6.03628 10.2159 4.66286 10.1702 3.75159 10.9675L2.751 11.8623C2.73407 11.8751 2.7002 11.9607 2.7002 12.2004C2.7002 17.3366 6.86395 21.5004 12.0002 21.5004C15.2197 21.5004 18.057 19.8645 19.7264 17.3786L19.609 17.2612L17.7765 15.599C16.7369 14.6634 15.1888 14.5702 14.0446 15.3744L13.7464 15.5839C12.9512 16.1428 11.8694 16.0491 11.1822 15.3618Z" fill='var(--primary)'></path> <path opacity=".5" d="M15 11C16.1046 11 17 10.1046 17 9C17 7.89543 16.1046 7 15 7C13.8954 7 13 7.89543 13 9C13 10.1046 13.8954 11 15 11Z" fill='var(--primary)'></path> <path fillRule="evenodd" clipRule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM20.9794 9.76985C21.1886 10.5446 21.3002 11.3595 21.3002 12.2004C21.3002 17.3366 17.1364 21.5004 12.0002 21.5004C6.86395 21.5004 2.7002 17.3366 2.7002 12.2004C2.7002 11.3658 2.81014 10.5568 3.01634 9.78724C4.00808 5.74714 7.65403 2.75 12 2.75C16.3397 2.75 19.9814 5.73854 20.9794 9.76985Z" fill='var(--primary)'></path> </g></svg>
  ),
  'music': (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 13.25C6.37665 13.25 4.25 15.3766 4.25 18C4.25 20.6234 6.37665 22.75 9 22.75C11.6234 22.75 13.75 20.6234 13.75 18C13.75 15.3766 11.6234 13.25 9 13.25Z" fill='var(--primary)'></path> <path fillRule="evenodd" clipRule="evenodd" d="M13 1.25C13.4142 1.25 13.75 1.58579 13.75 2C13.75 4.8995 16.1005 7.25 19 7.25C19.4142 7.25 19.75 7.58579 19.75 8C19.75 8.41421 19.4142 8.75 19 8.75C15.2721 8.75 12.25 5.72792 12.25 2C12.25 1.58579 12.5858 1.25 13 1.25Z" fill='var(--primary)'></path> <path opacity="0.5" d="M12.25 14.5359V2C12.25 3.60747 12.8119 5.08371 13.75 6.243V18C13.75 16.6339 13.1733 15.4024 12.25 14.5359Z" fill='var(--primary)'></path> </g></svg>
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
  const [totalPosts, setTotalPosts] = useState()
  const handleGetPosts = async (page: number) => {
    const data = getPosts(page, 5);
    setTotalPosts((await data).totalPosts);
    setPosts((await data).posts);
  }
  useEffect(() => {
    handleGetPosts(page);
  }, [page])
  // Submit Post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(draft.status === 'published'){
      // Update published post
      const formUpdate = {
        id: draft._id,
        author: draft.author,
        category: draft.category,
        content: draft.content,
        desc: draft.desc,
        format: draft.format,
        title: draft.title,
        slug: draft.slug,
        tags: draft.tags,
      }
      const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/post/${draft._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify(formUpdate)
          });
          res.status === 200 && window.location.reload();
    } else {
      // Create new Post
      if (draft.author && draft.format && draft.title && draft.category && draft.tags && draft.desc && draft.coverUrl) {
  
        dispatch(submitDraft(false));
        dispatch(submitDraft(true));
        if (draft.format === 'blog'){
          // Update cover photo first to get the thumbnail url and cover key
          const formData: FinalPost = {
            author: draft.author,
            category: draft.category,
            content: draft.content,
            coverKey: '',
            coverThumbnail: '',
            coverRes: draft.coverRes,
            desc: draft.desc,
            format: draft.format,
            title: draft.title,
            slug: draft.slug,
            tags: draft.tags,
            status: 'published'
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
    
          const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/post', {
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
            desc: draft.desc,
            format: draft.format,
            title: draft.title,
            slug: draft.slug,
            tags: draft.tags,
            videoSrc: {
              high: ``,
              medium: '',
              low: '',
            },
            status: 'published'
          }
  
          const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/post', {
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
  }
  // Convert title to slug
  function toSlug(string: string){
    // Chuyển hết sang chữ thường
    let str = string.toLowerCase();     

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
    if (str === ''){
      // return
      return encodeURI(string);
    } else return str;
  }
  // Convert Date Post
  function convertDatePost (date: string){
    const dateObj = new Date(date);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are 0-indexed
    const year = dateObj.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }
  // Handle active pagination
  const [activeBtn, setActiveBtn] = useState<number>(1)
  const handleActive = (page: number) => {
    setPage(page);
    setActiveBtn(page)
  }
  // Handle active edit
  const [chosenPost, setChosenPost] = useState<FetchedPost>()
  const handleEditTrigger = (post: FetchedPost) => {
    if (!addTrigger) {
      dispatch(openDraft());
      dispatch(updateId(post._id))
      dispatch(updateFormat(post.format));
      dispatch(updateTitle(post.title));
      dispatch(updateSlug(post.slug));
      dispatch(updateAuthor(post.author));
      dispatch(updateCat(post.category));
      dispatch(updateTag(post.tags));
      dispatch(updateDesc(post.desc));
      post.content && dispatch(updateContent(post.content));
      dispatch(updateCoverKey(post.coverKey));
      dispatch(updateCoverThumbnail(post.coverThumbnail));
      dispatch(updateCoverRes(post.coverRes));
      dispatch(updateStatus(post.status));
    } else {
      dispatch(clearDraft());
    }
  }
  return (
    <div className={`${styles.postSumContainer} ${styles.gridBlock}`}>
      <div className={styles.sumHeader}>
        <div className={styles.leftHeader}>
          <h2>{menuType}</h2>
          {
            menuType === 'home' ? '' :
            <div className={styles.button} onClick={handleTrigger}>
                {
                  !addTrigger ? 
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M7.37 22H16.62C19.31 22 21.49 19.82 21.49 17.13V8.37C21.49 5.68 19.31 3.5 16.62 3.5H7.37C4.68 3.5 2.5 5.68 2.5 8.37V17.12C2.5 19.82 4.68 22 7.37 22Z" fill="var(--on-background)"></path> <path d="M8.28906 6.29C7.86906 6.29 7.53906 5.95 7.53906 5.54V2.75C7.53906 2.34 7.86906 2 8.28906 2C8.70906 2 9.03906 2.34 9.03906 2.75V5.53C9.03906 5.95 8.70906 6.29 8.28906 6.29Z" fill="var(--on-background)"></path> <path d="M15.7109 6.29C15.2909 6.29 14.9609 5.95 14.9609 5.54V2.75C14.9609 2.33 15.3009 2 15.7109 2C16.1309 2 16.4609 2.34 16.4609 2.75V5.53C16.4609 5.95 16.1309 6.29 15.7109 6.29Z" fill="var(--on-background)"></path> <path d="M12 14.75H10.31V13C10.31 12.59 9.97 12.25 9.56 12.25C9.15 12.25 8.81 12.59 8.81 13V14.75H7C6.59 14.75 6.25 15.09 6.25 15.5C6.25 15.91 6.59 16.25 7 16.25H8.81V18C8.81 18.41 9.15 18.75 9.56 18.75C9.97 18.75 10.31 18.41 10.31 18V16.25H12C12.41 16.25 12.75 15.91 12.75 15.5C12.75 15.09 12.41 14.75 12 14.75Z" fill="var(--on-background)"></path> </g></svg>
                  :
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="var(--on-background)"></path> <path d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0304L13.0607 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z" fill="var(--on-background)"></path> </g></svg>
                }
            </div>
          }
          {
            chosenPost && 
            <button onClick={() => handleEditTrigger(chosenPost)} style={{width:25, height:25, backgroundColor: 'transparent', marginLeft:'10px', cursor: "pointer"}} className={styles.button}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z" fill="var(--on-background-matte)"></path> <path d="M21.0195 2.97979C19.2295 1.17979 17.4795 1.13979 15.6395 2.97979L14.5095 4.09979C14.4095 4.19979 14.3795 4.33979 14.4195 4.46979C15.1195 6.91979 17.0795 8.87979 19.5295 9.57979C19.5595 9.58979 19.6095 9.58979 19.6395 9.58979C19.7395 9.58979 19.8395 9.54979 19.9095 9.47979L21.0195 8.35979C21.9295 7.44979 22.3795 6.57979 22.3795 5.68979C22.3795 4.78979 21.9295 3.89979 21.0195 2.97979Z" fill="var(--on-background-matte)"></path> <path d="M17.8591 10.4198C17.5891 10.2898 17.3291 10.1598 17.0891 10.0098C16.8891 9.88984 16.6891 9.75984 16.4991 9.61984C16.3391 9.51984 16.1591 9.36984 15.9791 9.21984C15.9591 9.20984 15.8991 9.15984 15.8191 9.07984C15.5091 8.82984 15.1791 8.48984 14.8691 8.11984C14.8491 8.09984 14.7891 8.03984 14.7391 7.94984C14.6391 7.83984 14.4891 7.64984 14.3591 7.43984C14.2491 7.29984 14.1191 7.09984 13.9991 6.88984C13.8491 6.63984 13.7191 6.38984 13.5991 6.12984C13.4691 5.84984 13.3691 5.58984 13.2791 5.33984L7.89912 10.7198C7.54912 11.0698 7.20912 11.7298 7.13912 12.2198L6.70912 15.1998C6.61912 15.8298 6.78912 16.4198 7.17912 16.8098C7.50912 17.1398 7.95912 17.3098 8.45912 17.3098C8.56912 17.3098 8.67912 17.2998 8.78912 17.2898L11.7591 16.8698C12.2491 16.7998 12.9091 16.4698 13.2591 16.1098L18.6391 10.7298C18.3891 10.6498 18.1391 10.5398 17.8591 10.4198Z" fill="var(--on-background-matte)"></path> </g></svg>
            </button>
          }
        </div>
        <div className={styles.listCount}>
            <div className={styles.iconContainer}>
                {
                  icons.hasOwnProperty(menuType) && icons[menuType]
                }
            </div>
            <span>{totalPosts}</span>
        </div>
      </div>
      {
        addTrigger ? 
        <div className={styles.editField}>
          <form className={styles.textForm} onSubmit={(e) => handleSubmit(e)}>
              <div className={styles.textField}>
                  <label>Post Format<span className={styles.textDanger}> *</span></label>
                  <select name='post_format' defaultValue={draft.format} placeholder='Select Post Format...' className={styles.textInput}
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
                  <input name='title' type='text' defaultValue={draft.title} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Title' onChange={(e) => {
                    dispatch(updateTitle(e.target.value));
                    dispatch(updateSlug(toSlug(e.target.value)));
                    }}/>
              </div>
              <div className={styles.textField}>
                  <label>Author<span className={styles.textDanger}> *</span></label>
                  <select name='author' defaultValue={draft.author} placeholder='Author...' className={styles.textInput}  onChange={(e) => dispatch(updateAuthor(e.target.value))}>
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
                  <select defaultValue={draft.category} name='category' placeholder='Select category...' className={styles.textInput}  onChange={(e) => dispatch(updateCat(e.target.value))}>
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
                  <input defaultValue={draft.tags} name='tags' type='text' className={styles.textInput} onChange={(e) => dispatch(updateTag(e.target.value.split(', ')))}/>
              </div>
              <div className={styles.textField}>
                <label>Description<span className={styles.textDanger}> *</span></label>
                <textarea defaultValue={draft.desc} name='description' style={{maxHeight:'65px', maxWidth:'250px',minWidth:'250px', minHeight:'28px'}} className={styles.textInput} placeholder='Description' onChange={(e) => dispatch(updateDesc(e.target.value))}></textarea>
              </div>
              <div className={styles.submit}>
                {
                  draft.status === 'published' ?
                  <button style={{backgroundColor: 'var(--surface-06)'}} className={styles.button} type='submit'>Update</button>
                  :
                  <button className={styles.button} type='submit'>Submit</button>
                }
              </div>
              {error ? <div><h5 style={{color:'red',textAlign:'right'}}>Something went wrong! Please check again...</h5></div>:null}
          </form>
        </div> 
        : 
        <>
          <table id='postList' className={styles.postList}>
            <thead>
              <tr className={styles.listLabel}>
                <th className={styles.labelItem}>Title</th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="var(--on-background-matte)" strokeWidth="2"></circle> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                </th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M5.3783 2C5.3905 2 5.40273 2 5.415 2L7.62171 2C8.01734 1.99998 8.37336 1.99996 8.66942 2.02454C8.98657 2.05088 9.32336 2.11052 9.65244 2.28147C10.109 2.51866 10.4813 2.89096 10.7185 3.34757C10.8895 3.67665 10.9491 4.01343 10.9755 4.33059C11 4.62664 11 4.98265 11 5.37828V9.62172C11 10.0174 11 10.3734 10.9755 10.6694C10.9491 10.9866 10.8895 11.3234 10.7185 11.6524C10.4813 12.109 10.109 12.4813 9.65244 12.7185C9.32336 12.8895 8.98657 12.9491 8.66942 12.9755C8.37337 13 8.01735 13 7.62172 13H5.37828C4.98265 13 4.62664 13 4.33059 12.9755C4.01344 12.9491 3.67665 12.8895 3.34757 12.7185C2.89096 12.4813 2.51866 12.109 2.28147 11.6524C2.11052 11.3234 2.05088 10.9866 2.02454 10.6694C1.99996 10.3734 1.99998 10.0173 2 9.62171L2 5.415C2 5.40273 2 5.3905 2 5.3783C1.99998 4.98266 1.99996 4.62664 2.02454 4.33059C2.05088 4.01343 2.11052 3.67665 2.28147 3.34757C2.51866 2.89096 2.89096 2.51866 3.34757 2.28147C3.67665 2.11052 4.01343 2.05088 4.33059 2.02454C4.62664 1.99996 4.98266 1.99998 5.3783 2ZM4.27752 4.05297C4.27226 4.05488 4.27001 4.05604 4.26952 4.0563C4.17819 4.10373 4.10373 4.17819 4.0563 4.26952C4.05604 4.27001 4.05488 4.27226 4.05297 4.27752C4.05098 4.28299 4.04767 4.29312 4.04372 4.30961C4.03541 4.34427 4.02554 4.40145 4.01768 4.49611C4.00081 4.69932 4 4.9711 4 5.415V9.585C4 10.0289 4.00081 10.3007 4.01768 10.5039C4.02554 10.5986 4.03541 10.6557 4.04372 10.6904C4.04767 10.7069 4.05098 10.717 4.05297 10.7225C4.05488 10.7277 4.05604 10.73 4.0563 10.7305C4.10373 10.8218 4.17819 10.8963 4.26952 10.9437C4.27001 10.944 4.27226 10.9451 4.27752 10.947C4.28299 10.949 4.29312 10.9523 4.30961 10.9563C4.34427 10.9646 4.40145 10.9745 4.49611 10.9823C4.69932 10.9992 4.9711 11 5.415 11H7.585C8.02891 11 8.30068 10.9992 8.5039 10.9823C8.59855 10.9745 8.65574 10.9646 8.6904 10.9563C8.70688 10.9523 8.71701 10.949 8.72249 10.947C8.72775 10.9451 8.72999 10.944 8.73049 10.9437C8.82181 10.8963 8.89627 10.8218 8.94371 10.7305C8.94397 10.73 8.94513 10.7277 8.94704 10.7225C8.94903 10.717 8.95234 10.7069 8.95629 10.6904C8.96459 10.6557 8.97446 10.5986 8.98232 10.5039C8.9992 10.3007 9 10.0289 9 9.585V5.415C9 4.9711 8.9992 4.69932 8.98232 4.49611C8.97446 4.40145 8.96459 4.34427 8.95629 4.30961C8.95234 4.29312 8.94903 4.28299 8.94704 4.27752C8.94513 4.27226 8.94397 4.27001 8.94371 4.26952C8.89627 4.17819 8.82181 4.10373 8.73049 4.0563C8.72999 4.05604 8.72775 4.05488 8.72249 4.05297C8.71701 4.05098 8.70688 4.04767 8.6904 4.04372C8.65574 4.03541 8.59855 4.02554 8.5039 4.01768C8.30068 4.00081 8.02891 4 7.585 4H5.415C4.9711 4 4.69932 4.00081 4.49611 4.01768C4.40145 4.02554 4.34427 4.03541 4.30961 4.04372C4.29312 4.04767 4.28299 4.05098 4.27752 4.05297ZM16.3783 2H18.6217C19.0173 1.99998 19.3734 1.99996 19.6694 2.02454C19.9866 2.05088 20.3234 2.11052 20.6524 2.28147C21.109 2.51866 21.4813 2.89096 21.7185 3.34757C21.8895 3.67665 21.9491 4.01343 21.9755 4.33059C22 4.62665 22 4.98267 22 5.37832V5.62168C22 6.01733 22 6.37336 21.9755 6.66942C21.9491 6.98657 21.8895 7.32336 21.7185 7.65244C21.4813 8.10905 21.109 8.48135 20.6524 8.71854C20.3234 8.88948 19.9866 8.94912 19.6694 8.97546C19.3734 9.00005 19.0173 9.00003 18.6217 9H16.3783C15.9827 9.00003 15.6266 9.00005 15.3306 8.97546C15.0134 8.94912 14.6766 8.88948 14.3476 8.71854C13.891 8.48135 13.5187 8.10905 13.2815 7.65244C13.1105 7.32336 13.0509 6.98657 13.0245 6.66942C13 6.37337 13 6.01735 13 5.62172V5.37828C13 4.98265 13 4.62664 13.0245 4.33059C13.0509 4.01344 13.1105 3.67665 13.2815 3.34757C13.5187 2.89096 13.891 2.51866 14.3476 2.28147C14.6766 2.11052 15.0134 2.05088 15.3306 2.02454C15.6266 1.99996 15.9827 1.99998 16.3783 2ZM15.2775 4.05297C15.2723 4.05488 15.27 4.05604 15.2695 4.0563C15.1782 4.10373 15.1037 4.17819 15.0563 4.26952C15.056 4.27001 15.0549 4.27226 15.053 4.27752C15.051 4.28299 15.0477 4.29312 15.0437 4.30961C15.0354 4.34427 15.0255 4.40145 15.0177 4.49611C15.0008 4.69932 15 4.9711 15 5.415V5.585C15 6.02891 15.0008 6.30068 15.0177 6.5039C15.0255 6.59855 15.0354 6.65574 15.0437 6.6904C15.0477 6.70688 15.051 6.71701 15.053 6.72249C15.0549 6.72775 15.056 6.72999 15.0563 6.73049C15.1037 6.82181 15.1782 6.89627 15.2695 6.94371C15.27 6.94397 15.2723 6.94512 15.2775 6.94704C15.283 6.94903 15.2931 6.95234 15.3096 6.95629C15.3443 6.96459 15.4015 6.97446 15.4961 6.98232C15.6993 6.9992 15.9711 7 16.415 7H18.585C19.0289 7 19.3007 6.9992 19.5039 6.98232C19.5986 6.97446 19.6557 6.96459 19.6904 6.95629C19.7069 6.95234 19.717 6.94903 19.7225 6.94704C19.7277 6.94512 19.73 6.94397 19.7305 6.94371C19.8218 6.89627 19.8963 6.82181 19.9437 6.73049C19.944 6.72999 19.9451 6.72775 19.947 6.72249C19.949 6.71701 19.9523 6.70688 19.9563 6.6904C19.9646 6.65573 19.9745 6.59855 19.9823 6.5039C19.9992 6.30068 20 6.02891 20 5.585V5.415C20 4.9711 19.9992 4.69932 19.9823 4.49611C19.9745 4.40145 19.9646 4.34427 19.9563 4.30961C19.9523 4.29312 19.949 4.28299 19.947 4.27752C19.9451 4.27226 19.944 4.27001 19.9437 4.26952C19.8963 4.17819 19.8218 4.10373 19.7305 4.0563C19.73 4.05604 19.7277 4.05488 19.7225 4.05297C19.717 4.05098 19.7069 4.04767 19.6904 4.04372C19.6557 4.03541 19.5986 4.02554 19.5039 4.01768C19.3007 4.00081 19.0289 4 18.585 4H16.415C15.9711 4 15.6993 4.00081 15.4961 4.01768C15.4015 4.02554 15.3443 4.03541 15.3096 4.04372C15.2931 4.04767 15.283 4.05098 15.2775 4.05297ZM16.3783 11H18.6217C19.0173 11 19.3734 11 19.6694 11.0245C19.9866 11.0509 20.3234 11.1105 20.6524 11.2815C21.109 11.5187 21.4813 11.891 21.7185 12.3476C21.8895 12.6766 21.9491 13.0134 21.9755 13.3306C22 13.6266 22 13.9827 22 14.3783V18.6217C22 19.0173 22 19.3734 21.9755 19.6694C21.9491 19.9866 21.8895 20.3234 21.7185 20.6524C21.4813 21.109 21.109 21.4813 20.6524 21.7185C20.3234 21.8895 19.9866 21.9491 19.6694 21.9755C19.3734 22 19.0173 22 18.6217 22H16.3783C15.9827 22 15.6266 22 15.3306 21.9755C15.0134 21.9491 14.6766 21.8895 14.3476 21.7185C13.891 21.4813 13.5187 21.109 13.2815 20.6524C13.1105 20.3234 13.0509 19.9866 13.0245 19.6694C13 19.3734 13 19.0174 13 18.6217V14.3783C13 13.9827 13 13.6266 13.0245 13.3306C13.0509 13.0134 13.1105 12.6766 13.2815 12.3476C13.5187 11.891 13.891 11.5187 14.3476 11.2815C14.6766 11.1105 15.0134 11.0509 15.3306 11.0245C15.6266 11 15.9827 11 16.3783 11ZM15.2775 13.053C15.2723 13.0549 15.27 13.056 15.2695 13.0563C15.1782 13.1037 15.1037 13.1782 15.0563 13.2695C15.056 13.27 15.0549 13.2723 15.053 13.2775C15.051 13.283 15.0477 13.2931 15.0437 13.3096C15.0354 13.3443 15.0255 13.4015 15.0177 13.4961C15.0008 13.6993 15 13.9711 15 14.415V18.585C15 19.0289 15.0008 19.3007 15.0177 19.5039C15.0255 19.5986 15.0354 19.6557 15.0437 19.6904C15.0477 19.7069 15.051 19.717 15.053 19.7225C15.0549 19.7277 15.056 19.73 15.0563 19.7305C15.1037 19.8218 15.1782 19.8963 15.2695 19.9437C15.27 19.944 15.2723 19.9451 15.2775 19.947C15.283 19.949 15.2931 19.9523 15.3096 19.9563C15.3443 19.9646 15.4015 19.9745 15.4961 19.9823C15.6993 19.9992 15.9711 20 16.415 20H18.585C19.0289 20 19.3007 19.9992 19.5039 19.9823C19.5986 19.9745 19.6557 19.9646 19.6904 19.9563C19.7069 19.9523 19.717 19.949 19.7225 19.947C19.7277 19.9451 19.73 19.944 19.7305 19.9437C19.8218 19.8963 19.8963 19.8218 19.9437 19.7305C19.944 19.73 19.9451 19.7277 19.947 19.7225C19.949 19.717 19.9523 19.7069 19.9563 19.6904C19.9646 19.6557 19.9745 19.5986 19.9823 19.5039C19.9992 19.3007 20 19.0289 20 18.585V14.415C20 13.9711 19.9992 13.6993 19.9823 13.4961C19.9745 13.4015 19.9646 13.3443 19.9563 13.3096C19.9523 13.2931 19.949 13.283 19.947 13.2775C19.9451 13.2723 19.944 13.27 19.9437 13.2695C19.8963 13.1782 19.8218 13.1037 19.7305 13.0563C19.73 13.056 19.7277 13.0549 19.7225 13.053C19.717 13.051 19.7069 13.0477 19.6904 13.0437C19.6557 13.0354 19.5986 13.0255 19.5039 13.0177C19.3007 13.0008 19.0289 13 18.585 13H16.415C15.9711 13 15.6993 13.0008 15.4961 13.0177C15.4015 13.0255 15.3443 13.0354 15.3096 13.0437C15.2931 13.0477 15.283 13.051 15.2775 13.053ZM5.37828 15H7.62172C8.01735 15 8.37337 15 8.66942 15.0245C8.98657 15.0509 9.32336 15.1105 9.65244 15.2815C10.109 15.5187 10.4813 15.891 10.7185 16.3476C10.8895 16.6766 10.9491 17.0134 10.9755 17.3306C11 17.6266 11 17.9827 11 18.3783V18.6217C11 19.0174 11 19.3734 10.9755 19.6694C10.9491 19.9866 10.8895 20.3234 10.7185 20.6524C10.4813 21.109 10.109 21.4813 9.65244 21.7185C9.32336 21.8895 8.98657 21.9491 8.66942 21.9755C8.37336 22 8.01733 22 7.62168 22H5.37832C4.98267 22 4.62665 22 4.33059 21.9755C4.01343 21.9491 3.67665 21.8895 3.34757 21.7185C2.89096 21.4813 2.51866 21.109 2.28147 20.6524C2.11052 20.3234 2.05088 19.9866 2.02454 19.6694C1.99996 19.3734 1.99998 19.0173 2 18.6217V18.3783C1.99998 17.9827 1.99996 17.6266 2.02454 17.3306C2.05088 17.0134 2.11052 16.6766 2.28147 16.3476C2.51866 15.891 2.89096 15.5187 3.34757 15.2815C3.67665 15.1105 4.01344 15.0509 4.33059 15.0245C4.62664 15 4.98265 15 5.37828 15ZM4.27752 17.053C4.27226 17.0549 4.27001 17.056 4.26952 17.0563C4.17819 17.1037 4.10373 17.1782 4.0563 17.2695C4.05604 17.27 4.05488 17.2723 4.05297 17.2775C4.05098 17.283 4.04767 17.2931 4.04372 17.3096C4.03541 17.3443 4.02554 17.4015 4.01768 17.4961C4.00081 17.6993 4 17.9711 4 18.415V18.585C4 19.0289 4.00081 19.3007 4.01768 19.5039C4.02554 19.5986 4.03541 19.6557 4.04372 19.6904C4.04767 19.7069 4.05098 19.717 4.05297 19.7225C4.05488 19.7277 4.05604 19.73 4.0563 19.7305C4.10373 19.8218 4.17819 19.8963 4.26952 19.9437C4.27001 19.944 4.27226 19.9451 4.27752 19.947C4.28299 19.949 4.29312 19.9523 4.30961 19.9563C4.34427 19.9646 4.40145 19.9745 4.49611 19.9823C4.69932 19.9992 4.9711 20 5.415 20H7.585C8.02891 20 8.30068 19.9992 8.5039 19.9823C8.59855 19.9745 8.65573 19.9646 8.6904 19.9563C8.70688 19.9523 8.71701 19.949 8.72249 19.947C8.72775 19.9451 8.72999 19.944 8.73049 19.9437C8.82181 19.8963 8.89627 19.8218 8.94371 19.7305C8.94397 19.73 8.94513 19.7277 8.94704 19.7225C8.94903 19.717 8.95234 19.7069 8.95629 19.6904C8.96459 19.6557 8.97446 19.5986 8.98232 19.5039C8.9992 19.3007 9 19.0289 9 18.585V18.415C9 17.9711 8.9992 17.6993 8.98232 17.4961C8.97446 17.4015 8.96459 17.3443 8.95629 17.3096C8.95234 17.2931 8.94903 17.283 8.94704 17.2775C8.94513 17.2723 8.94397 17.27 8.94371 17.2695C8.89627 17.1782 8.82181 17.1037 8.73049 17.0563C8.72999 17.056 8.72775 17.0549 8.72249 17.053C8.71701 17.051 8.70688 17.0477 8.6904 17.0437C8.65574 17.0354 8.59855 17.0255 8.5039 17.0177C8.30068 17.0008 8.02891 17 7.585 17H5.415C4.9711 17 4.69932 17.0008 4.49611 17.0177C4.40145 17.0255 4.34427 17.0354 4.30961 17.0437C4.29312 17.0477 4.28299 17.051 4.27752 17.053Z" fill="var(--on-background-matte)"></path> </g></svg>
                </th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.8" d="M12 17L12 10M12 10L15 13M12 10L9 13" stroke="var(--on-background-matte)" strokeWidth="2.112" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.8" d="M16 7H12H8" stroke="var(--on-background-matte)" strokeWidth="2.112" strokeLinecap="round"></path> <path  d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="var(--on-background-matte)" strokeWidth="2.112"></path> </g></svg>
                </th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.02907 13.0776C2.7032 12.3958 2.7032 11.6032 3.02907 10.9214C3.16997 10.6266 3.41023 10.3447 3.89076 9.78084C4.08201 9.55642 4.17764 9.44421 4.25796 9.32437C4.44209 9.04965 4.56988 8.74114 4.63393 8.41669C4.66188 8.27515 4.6736 8.12819 4.69706 7.83426C4.75599 7.09576 4.78546 6.72651 4.89427 6.41844C5.14594 5.70591 5.7064 5.14546 6.41893 4.89378C6.72699 4.78497 7.09625 4.7555 7.83475 4.69657C8.12868 4.67312 8.27564 4.66139 8.41718 4.63344C8.74163 4.56939 9.05014 4.4416 9.32485 4.25747C9.4447 4.17715 9.55691 4.08152 9.78133 3.89027C10.3452 3.40974 10.6271 3.16948 10.9219 3.02859C11.6037 2.70271 12.3963 2.70271 13.0781 3.02859C13.3729 3.16948 13.6548 3.40974 14.2187 3.89027C14.4431 4.08152 14.5553 4.17715 14.6752 4.25747C14.9499 4.4416 15.2584 4.56939 15.5828 4.63344C15.7244 4.66139 15.8713 4.67312 16.1653 4.69657C16.9038 4.7555 17.273 4.78497 17.5811 4.89378C18.2936 5.14546 18.8541 5.70591 19.1058 6.41844M4.89427 17.5806C5.14594 18.2931 5.7064 18.8536 6.41893 19.1053C6.72699 19.2141 7.09625 19.2435 7.83475 19.3025C8.12868 19.3259 8.27564 19.3377 8.41718 19.3656C8.74163 19.4297 9.05014 19.5574 9.32485 19.7416C9.44469 19.8219 9.55691 19.9175 9.78133 20.1088C10.3452 20.5893 10.6271 20.8296 10.9219 20.9705C11.6037 21.2963 12.3963 21.2963 13.0781 20.9705C13.3729 20.8296 13.6548 20.5893 14.2187 20.1088C14.4431 19.9175 14.5553 19.8219 14.6752 19.7416C14.9499 19.5574 15.2584 19.4297 15.5828 19.3656C15.7244 19.3377 15.8713 19.3259 16.1653 19.3025C16.9038 19.2435 17.273 19.2141 17.5811 19.1053C18.2936 18.8536 18.8541 18.2931 19.1058 17.5806C19.2146 17.2725 19.244 16.9033 19.303 16.1648C19.3264 15.8709 19.3381 15.7239 19.3661 15.5824C19.4301 15.2579 19.5579 14.9494 19.7421 14.6747C19.8224 14.5548 19.918 14.4426 20.1093 14.2182C20.5898 13.6543 20.8301 13.3724 20.971 13.0776C21.2968 12.3958 21.2968 11.6032 20.971 10.9214" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                </th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--on-background-matte)" strokeWidth="0.4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="var(--on-background-matte)"></path> </g></svg>
                </th>
                <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10.5H16" stroke="var(--on-background-matte)" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M8 14H13.5" stroke="var(--on-background-matte)" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                posts.map((post: FetchedPost, ind) => {
                  return(
                    <tr style={{backgroundColor: chosenPost?._id === post._id ? 'var(--surface-16)': ''}} onClick={() => setChosenPost(post)} key={ind}>
                      <td>{post.title}</td>
                      <td>{post.author}</td>
                      <td>{icons[post.format]}</td>
                      <td>{convertDatePost(post.createdAt)}</td>
                      <td>{post.views}</td>
                      <td>{post.likes}</td>
                      <td>{post.comments.length}</td>
                    </tr>
                  )
                })
              }

            </tbody>
          </table>
          <div className={styles.pagination}>
            {
              totalPosts &&
              Array(Math.ceil(totalPosts / 5)).fill(null).map((_, i) => (
                <button style={{backgroundColor: (activeBtn === i+1) ? 'var(--on-background)' : 'var(--on-background-matte)'}} key={i} onClick={() => handleActive(i+1)}></button>
              ))
            }
          </div>
        </>
      }
    </div>
  )
}

export default PostSum