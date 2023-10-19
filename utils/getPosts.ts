
export const getPosts = async (format: string, page: number | string, perPage: number | string) => {

    const res = await fetch(`https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/post?format=${format}&page=${page}&perPage=${perPage}`, {
        method: "GET",
    })
    const getData = await res.json();
    const posts = getData.posts;
    const totalPosts = getData.totalPosts;
    return { posts, totalPosts }

};