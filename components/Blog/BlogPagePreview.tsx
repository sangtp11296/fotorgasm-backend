'use client'
import { FetchedPost } from '@/types/Posts.type'
import styles from './BlogPagePreview.module.css'
import './ContentPreview.css'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

interface Props {
  post: FetchedPost,
  cover: string,
}
export const BlogPagePreview: React.FC<Props> = ({ post, cover }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollWidth: number | undefined;
    let targetLeft: number | undefined;

    const getScrollStep = () => (scrollWidth ?? 0) / 50; /* ADJUST TO YOUR WISH */

    const scrollLeft = () => {
      const container = containerRef.current;
      if (!container || typeof scrollWidth === 'undefined' || typeof targetLeft === 'undefined') return;

      let beforeLeft = container.scrollLeft;
      let wantDx = getScrollStep();
      let diff = targetLeft - container.scrollLeft;
      let dX = wantDx >= Math.abs(diff) ? diff : Math.sign(diff) * wantDx;

      // Performing horizontal scroll
      container.scrollBy(dX, 0);

      // Break if smaller `diff` instead of `wantDx` was used
      if (dX === diff) return;

      // Break if can't scroll anymore or target reached
      if (beforeLeft === container.scrollLeft || container.scrollLeft === targetLeft) return;

      requestAnimationFrame(scrollLeft);
    };
    if (container) {
      container.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        scrollWidth = container.scrollWidth - container.clientWidth;
        targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));
        requestAnimationFrame(scrollLeft);
      });

      return () => {
        container.removeEventListener('wheel', (e: WheelEvent) => {
          e.preventDefault();
          scrollWidth = container.scrollWidth - container.clientWidth;
          targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));
          requestAnimationFrame(scrollLeft);
        });
      };
    }
  }, []);
  return (
    <>
      {
      // Standard Post
        (post.coverRes.height > post.coverRes.width) ?
        <div className={styles.standardPost}>
          <div className={`${styles.postCover}`}>
              <img className={`${styles.coverImage}`} src={cover} alt={post?.title} />
          </div>
          <div className={`${styles.fullTextContainer}`}>
            <article className={`${styles.postArticle}`}>
              <div className={`${styles.postContent}`}>
                <div className={`${styles.postCat}`}>
                  <Link href='/cat'>on {post?.category}</Link>
                </div>
                <div className={`${styles.postTitle}`}>
                    <h1>{post?.title}</h1>
                </div>
                <div className={`${styles.postTextContainer}`}>
                  {
                    post.content && 
                    <div className='postText standard' dangerouslySetInnerHTML={{__html:post.content}}>
                    </div>
                  }
                  <div className={styles.postInfoContainer}>
                    <div className={styles.postInfo}>
                      <div className={styles.postDate}>24. Dec 2022</div>
                      <div className={styles.postSocial}>
                        <button className={styles.likeBtn} >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                          <span>100</span>
                        </button>
                        <button className={styles.likeBtn}>
                          <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                          <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
                          <span>100</span>
                        </button>
                      </div>
                    </div>
                    <div className={styles.postInfo}>
                    <div className={styles.postSocial}>
                        <button className={styles.fbBtn} >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                        </button>
                        <button className={styles.insBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                        </button>
                        <button className={styles.twiBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tagHolder}><span>Abstract, Creative</span></div>
            </article>
          </div>
        </div> :
        ''
      }
      {
      // Landscape Post
        (post.coverRes.height < post.coverRes.width) ?
        <div className={styles.landscapePost} ref={containerRef}>
          <div className={`${styles.fullTextContainer}`}>
            <article className={`${styles.postArticle}`}>
              <div className={`${styles.postContent}`}>
                <div className={styles.catAndTitle}>
                  <div className={`${styles.postCat}`}>
                    <Link href='/cat'>on {post.category}</Link>
                  </div>
                  <div className={`${styles.postTitle}`}>
                      <h1>{post.title}</h1>
                  </div>
                  <div className={styles.firstIntro}>
                    <p>{post.desc}</p>
                  </div>
                </div>
                <div className={`${styles.postCover}`}>
                    <img className={`${styles.coverImage}`} src={cover} alt={post.title} />
                </div><div className={`${styles.postTextContainer}`}>
                  {
                    post.content && 
                    <div className='postText landscape' dangerouslySetInnerHTML={{__html:post.content}}>
                    </div>
                  }
                </div>
                <div className={styles.postInfoContainer}>
                  <div className={styles.postInfo}>
                    <div className={styles.postDate}>24. Dec 2022</div>
                    <div className={styles.postSocial}>
                      <button className={styles.likeBtn} >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <span>100</span>
                      </button>
                      <button className={styles.likeBtn}>
                        <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                        <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
                        <span>100</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.postInfo}>
                  <div className={styles.postSocial}>
                      <button className={styles.fbBtn} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                      </button>
                      <button className={styles.insBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                      </button>
                      <button className={styles.twiBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tagHolder}><span>Abstract, Creative</span></div>
            </article>
          </div>
        </div> :
        ''
      }
      {
        (post.coverRes.height === post.coverRes.width) ?
        <div className={styles.squarePost} ref={containerRef}>
          <div className={`${styles.fullTextContainer}`}>
            <article className={`${styles.postArticle}`}>
              <div className={`${styles.postCover}`}>
                  <img className={`${styles.coverImage}`} src={cover} alt={post?.title} />
              </div>
              <div className={`${styles.postContent}`}>
                <div className={styles.catAndTitle}>
                  <div className={`${styles.postCat}`}>
                    <Link href='/cat'>on {post?.category}</Link>
                  </div>
                  <div className={`${styles.postTitle}`}>
                      <Link href='/post:id'>{post?.title}</Link>
                  </div>
                  <div className={styles.firstIntro}>
                    <h1>The Importance of Artificial Intelligence in the Modern World</h1>
                    <p>Artificial Intelligence (AI) has been a topic of discussion for several decades. With the rise of technological advancements, AI has gained much prominence and has become a crucial aspect of our daily lives. In this essay, we will explore the importance of AI in the modern world. Artificial Intelligence (AI) has been a topic of discussion for several decades. With the rise of technological advancements, AI has gained much prominence and has become a crucial aspect of our daily lives. In this essay, we will explore the importance of AI in the modern world.</p>
                  </div>
                </div>
                <div className={`${styles.postTextContainer}`}>
                  <div className={`${styles.postText}`}>
                    <div className={styles.postSection}>
                      <h1>My Beach Adventure</h1>
                      <p>Travel outside one’s native country is a good opportunity to observe the beauty of natural places with beautiful mountains or colorful beaches. Each person has a variety of place where they want to travel; some like beaches, some like mountains, and some rivers. However, everyone will enjoy travel to places with a historical background such as Egypt for its pyramids or the Coliseum in Rome.</p>
                      <p>Nevertheless, the study does not incorporate mountain bikers’ willingness to pay for additional recreational facilities in PCP. In estimating the expenditure for recreational activity and its local economic impacts, there might be difference in value between local and foreign mountain biker. This is due to longer length of stay of foreigner compared to local mountain bikers since they have to travel further from home.</p>
                    </div>
                    <div className={`${styles.postImage}`}>
                      <div className={styles.childImage}>
                        <img src="https://plus.unsplash.com/premium_photo-1673970474453-7c49815647ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=1171&q=80" alt="Beach"/>
                        <figcaption className="figcaption">Photo by Oliver Sjöström on Unsplash</figcaption>
                        <span>@fotorgasm</span>
                      </div>
                      <div className={styles.childImage}>
                        <img src="https://plus.unsplash.com/premium_photo-1680184592656-3aaf363a6a00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=2370&q=80" alt="Beach"/>
                        <figcaption className="figcaption">Photo by Oliver Sjöström on Unsplash</figcaption>
                        <span>@fotorgasm</span>
                      </div>
                    </div>
                    <div className={styles.postSection}>
                      <h2>Beach Activities</h2>
                      <p>One of my favorite things to do at the beach is to go swimming in the ocean. As I waded into the ocean, I felt a sense of excitement wash over me. The water was a little chilly at first, but as I dove deeper, I felt the coolness become refreshing against my skin. The waves were gentle, lapping against me as I floated on my back, staring up at the blue sky above. It was peaceful, and I felt as though I was in my own little world, surrounded by the vastness of the ocean.</p>
                    </div>
                    <div className={`${styles.postImage}`}>
                      <div className={styles.childImage}>
                        <img src="https://images.unsplash.com/photo-1680676960765-f18115aa7390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=764&q=80" alt="Swimming"/>
                        <figcaption className="figcaption">Photo by Jakob Owens on Unsplash</figcaption>
                        <span>@fotorgasm</span>
                      </div>
                    </div>
                    <div className={styles.postSection}>
                      <p>In the article, “The Mountain Man and American Anguish” in the Journal of Popular Film & Television, Patrick McCarthy reflects on movie production and the image of mountain men. Contrary to how mountain men are shown in contemporary American pop culture media, McCarthy claims that there is a greater connection between that period of time and the different cultural challenges we face today. Staying consistent to the tune of his article, McCarthy claims modern media has skewed the reality of the life of the mountain man.</p>
                    </div>
                    <div className={`${styles.postImage}`}>
                      <div className={styles.childImage}>
                        <img src="https://images.unsplash.com/photo-1680484006397-64f3fcd8fc14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=687&q=80" alt="Sandcastle"/>
                        <figcaption className="figcaption">Photo by Stephanie LeBlanc on Unsplash</figcaption>
                        <span>@fotorgasm</span>
                      </div>
                    </div>
                    <div className={styles.postSection}>
                      <p>It is because the majority of the mountain bikers came from Selangor and need not pay for toll charges. White and Stynes (2008) found that spending for any services and goods are mostly influenced by the type of recreational activity and the distance travelled. Other factors influencing the level of expenditure of mountain bikers include the size of the recreation group which means the number of persons in the group, the time spent at the recreation area, local prices and the opportunity to make expenditure on site.</p>
                      <p>It specialises in offering adventure holidays, activities and experiences. It offers walking, trekking and cycling as part of the adventure tours. The latest brochure has a choice of 450 adventures to choose from KE Adventure travel (http://www. keadventure.com/ ) KE adventure is an independent adventure travel operator; it’s a big company which specialises in providing trekking, walking, climbing, mountain biking, winter sports etc.
                      </p>
                      <p>He seeks to escape it. Gilgamesh decides to seek out Utnapishtim, the one being granted immortality by the gods. He travels to Mount Mashu, a twin-peaked mountain that marks an entrance to a world in which mortals cannot venture. He convinces the guards of the mountain, two Scorpion-man beings, to allow him to enter a long passage under the mountain. [Original source: https://studycrumb.com/essay-maker]</p>
                    </div>
                    <div className={`${styles.postImage}`}>
                      <div className={styles.childImage}>
                        <img src="https://plus.unsplash.com/premium_photo-1673971700988-346588461fa7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=1171&q=80" alt="Sunset"/>
                        <figcaption className="figcaption">Photo by Jeremy Bishop on Unsplash</figcaption>
                        <span>@fotorgasm</span>
                      </div>
                    </div>
                    <div className={styles.postSection}>
                      <h2>Conclusion</h2>
                      <p>Overall, my day at the beach was amazing. It's a place where I can go to escape from the world and just enjoy the beauty of nature. I hope you enjoyed reading about my adventure!</p>
                    </div>

                  </div>
                  <div className={styles.postInfoContainer}>
                    <div className={styles.postInfo}>
                      <div className={styles.postDate}>24. Dec 2022</div>
                      <div className={styles.postSocial}>
                        <button className={styles.likeBtn} >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                          <span>100</span>
                        </button>
                        <button className={styles.likeBtn}>
                          <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                          <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
                          <span>100</span>
                        </button>
                      </div>
                    </div>
                    <div className={styles.postInfo}>
                    <div className={styles.postSocial}>
                        <button className={styles.fbBtn} >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                        </button>
                        <button className={styles.insBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                        </button>
                        <button className={styles.twiBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tagHolder}><span>Abstract, Creative</span></div>
            </article>
            <div className={styles.relatedPosts}>relatedPosts</div>
            <div className={styles.authorDes}>authorDes</div>
            <div className={styles.commentHolder}>commentHolder</div>
            <div className={styles.commentForm}>commentForm</div>
          </div>
        </div> 
        :
        ''
      }
    </>
  )
}
