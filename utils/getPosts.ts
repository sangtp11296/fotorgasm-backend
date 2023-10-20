
export const getPosts = async (format: string, page: number | string, perPage: number | string) => {

    const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/post?format=${format}&page=${page}&perPage=${perPage}`, {
        method: "GET",
        cache: 'no-store'
    })
    const getData = await res.json();
    const posts = getData.posts;
    const totalPosts = getData.totalPosts;
    return { posts, totalPosts }

};