import React from 'react'
import styles from './PostFeed.module.css'
import { getPhotos } from '@/utils/getPhotos'
import { Photo } from '@/types/Photos.type'
import StandardBlog from '../Posts/Blog/StandardBlog'
import { title } from 'process';


const PostFeed: React.FC = async () => {
  const cat = ['Films','Something','Vinyls','Moods','Memories','Running','Music','Reading'];
  const title = [
    "Số đỏ",
    "Dế Mèn Phiêu Lưu Ký",
    "Tắt Đèn",
    "Nhật Ký Trong Tù",
    "Tắm Và Chiều",
    "Chi Pheo",
    "Dế Mèn Táo Quân",
    "Lão Hạc",
    "Bến Đò Ngang",
    "Đất Rừng Phương Nam",
    "Đội Gấu",
    "Sông Đáy",
    "Hồn Trương Ba, Da Hàng Thịt",
    "Chí Phèo",
    "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    "Những Kẻ Xuất Chúng",
    "Lạc Lối",
    "Từ Từ Đòi Lại",
    "Tôi Là Bêtô",
    "Chữ Nghĩa Không Nói",
    "Gió Đưa Hồng Trần",
    "Đời Xưa",
    "Truyện Kiều",
    "Truyện Ngắn Nguyễn Ngọc Ngạn",
    "Kính Vạn Hoa",
    "To Kill a Mockingbird",
    "1984",
    "The Great Gatsby",
    "One Hundred Years of Solitude",
    "Pride and Prejudice",
    "Animal Farm",
    "The Catcher in the Rye",
    "The Hobbit",
    "The Lord of the Rings",
    "The Adventures of Huckleberry Finn",
    "The Adventures of Tom Sawyer",
    "The Picture of Dorian Gray",
    "The Sun Also Rises",
    "The Old Man and the Sea",
    "Of Mice and Men",
    "The Grapes of Wrath",
    "The Sound and the Fury",
    "For Whom the Bell Tolls",
    "The Bell Jar",
    "Heart of Darkness",
    "Lord of the Flies",
    "A Tale of Two Cities",
    "The Canterbury Tales",
    "The Divine Comedy",
    "The Odyssey",
    "三国演义",
    "红楼梦",
    "水浒传",
    "西游记",
    "百年孤独",
    "霍乱时期的爱情",
    "活着",
    "平凡的世界",
    "围城",
    "梦里花落知多少",
    "天龙八部",
    "鹿鼎记",
    "射雕英雄传",
    "金瓶梅",
    "红高粱家族",
    "庐山谣",
    "茶花女",
    "沉默的大多数",
    "中国历代政治得失",
    "论语",
    "道德经",
    "资治通鉴",
    "大学",
    "中庸",
    "荀子"
    ];
  
  // Get photos from API
  const photoData: Promise<Photo[]> = getPhotos(1, 10);
  const photos: Photo[] = await photoData;

  return (
    <div className={styles.postFeed}>
      <div className={styles.masonryContainer}>
        {
          photos.map((photo) => {
            if(photo.width < photo.height){
              return(
                <StandardBlog photo={photo} cat={cat[Math.floor(Math.random() * cat.length)]} title={title[Math.floor(Math.random() * title.length)]}/>
              )
            } else {
              
            }
          })
        }
      </div>
    </div>
  )
}

export default PostFeed