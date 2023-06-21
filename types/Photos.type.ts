export interface fetchedPhoto{
    "id": string,
    "created_at": string,
    "updated_at": string,
    "width": number,
    "height": number,
    "color": string,
    "blur_hash": string,
    "likes": number,
    "liked_by_user": boolean,
    "description": string,
    "alt_description": string,
    'title': string,
    'cat': string,
    'desc': string,
    'type': string,
    "user": {
        "id": string,
        "username": string,
        "name": string,
        "portfolio_url": string,
        "bio": string,
        "location": string,
        "total_likes": number,
        "total_photos": number,
        "total_collections": number,
        "instagram_username": string,
        "twitter_username": string,
        "profile_image": {
        "small": string,
        "medium": string,
        "large": string
        },
        "links": {
        "self": string,
        "html": string,
        "photos": string,
        "likes": string,
        "portfolio": string
        }
    },
    "current_user_collections": [
        {
        "id": number,
        "title": string,
        "published_at": string,
        "last_collected_at": string,
        "updated_at": string,
        "cover_photo": null | string,
        "user": null | string
        }
    ],
    "urls": {
        "raw": string,
        "full":string,
        "regular": string,
        "small": string,
        "thumb": string
    },
    "links": {
        "self": string,
        "html": string,
        "download": string,
        "download_location": string
    }
}
    

export type Photo = Pick<fetchedPhoto, 'id' | 'created_at' | 'width' | 'height' | 'likes' | 'description' | 'alt_description' | 'urls'> & {
    'title': string;
    'cat': string;
    'desc': string;
    'type': string
}