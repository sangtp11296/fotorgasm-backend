import React, { useState } from 'react'
import styles from './InteractiveComponent.module.css'

const InteractiveComponent = () => {
  const [cover, setCover] = useState<File | null>(null);
  const [coverURL,setCoverURL] = useState<string>('');
  const [coverRes, setCoverRes] = useState<{
                                              width: number;
                                              height: number;
                                          }>({width:0, height:0});

  // Upload Cover Image and Consider Resolution
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    console.log(file,'file')
    setCover(file)
    if(file) {
      const image = new Image();
      image.onload = () => {
          setCoverRes({
            width: image.naturalWidth,
            height: image.naturalHeight
          })
      };
      image.src = URL.createObjectURL(file);
    }
  }
  return (
    <div className={`${styles.interContainer} ${styles.gridBlock}`}>
      {/* {
        !cover ? 
        <div className={styles.uploadImage}>
          <label htmlFor='fileInput' className={styles.icon}>
              <i  className="fas fa-camera-retro"></i>
          </label>
          <label htmlFor='fileInput' className={styles.uploadBtn}>Upload Image</label>
          <input type='file' id='fileInput' required style={{display:'none'}} onChange={handleCoverImageUpload}/>
        </div> :
        <div className={styles.coverGrid}>
          <div className={`${styles.coverWraper} ${coverRes.width < coverRes.height ? styles.portrait : (coverRes.width > coverRes.height ? styles.landscape : styles.square)}`}>
            <BlogPost photo={newPost}/>
          </div>
        </div>
      } */}
    </div>
  )
}

export default InteractiveComponent