
export const getAlbums = async (page: number | string, perPage: number | string) => {

    const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/music?page=${page}&perPage=${perPage}`, {
        method: "GET",
        cache: 'no-store'
    })
    const getData = await res.json();
    const albums = getData.albums;
    const totalAlbums = getData.totalAlbums;
    return { albums, totalAlbums }

};