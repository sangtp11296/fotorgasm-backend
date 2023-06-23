export interface fetchedVideo {
    page: number;
    per_page: number;
    total_results: number;
    url: string;
    videos: Video[];
}
export interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    duration: number;
    title: string;
    cat: string;
    desc: string;
    type: string;
    user: {
      id: number;
      name: string;
      url: string;
    };
    video_files: Array<{
      id: number;
      quality: string;
      file_type: string;
      width: number;
      height: number;
      link: string;
    }>;
    video_pictures: Array<{
      id: number;
      picture: string;
      nr: number;
    }>;
}

