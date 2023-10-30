import dotenv from 'dotenv'
dotenv.config()

export const getArtistBio = async ( artist: string ) => {
    const newArtist = artist.replace(/ /g, '+')
    
    // API Access Token
    const authParams = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + '&client_secret=' + process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
    }
    const accessTokenResponse = await fetch('https://accounts.spotify.com/api/token', authParams);
    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData.access_token;
    // Use the access token to get artist info
    const artistIdRes = await fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const artistIdData = await artistIdRes.json();
    const artistId = artistIdData.artists.items[0];

    const artistBioRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${newArtist}&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}&format=json`);
    const artistBioData = await artistBioRes.json();
    const artistBio = artistBioData.artist.bio;

    const artistFullBio = {
        name: artist,
        bio: {
            summary: artistBio.summary,
            content: artistBio.content,
        },
        avatar: artistId.images[0].url
    }
    return artistFullBio
}