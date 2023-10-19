
export const getAlbums = async (page: number | string, perPage: number | string) => {

    const res = await fetch(`https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/music?page=${page}&perPage=${perPage}`, {
        method: "GET",
    })
    const getData = await res.json();
    const albums = getData.albums;
    const totalAlbums = getData.totalAlbums;
    return { albums, totalAlbums }

};