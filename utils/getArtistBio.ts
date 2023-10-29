import { useEffect } from "react"


export const getArtistBio = async ( artist: string ) => {
    const LASTFM_API_KEY= '98d56ecd23b65c46c3ca0d92571bf0c9'
    const LASTFM_SECRET= 'cdb687a050741d45855ef95b4470a6c2'

    const SPOTIFY_CLIENT_ID= '8d657fb47e584d3995caac9a235b549b'
    const SPOTIFY_CLIENT_SECRET= 'a239ab4a841443e594dd0e2680aec257'
    const newArtist = artist.replace(/ /g, '+')
    
    // API Access Token
    const authParams = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + SPOTIFY_CLIENT_ID + '&client_secret=' + SPOTIFY_CLIENT_SECRET
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

    const artistBioRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${newArtist}&api_key=${LASTFM_API_KEY}&format=json`);
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