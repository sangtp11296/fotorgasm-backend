'use client'
import { FetchAlbum, Song } from '@/types/Album.type'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Album.module.css'
import { OnPlayingPlayer } from '../OnPlayingPlayer/OnPlayingPlayer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { togglePlay, toggleShuffle, updateCurrentSong, updateNextSong, updatePlaylist, updatePrevSong } from '@/redux/playlist/playlist.slice'
import { shuffleArray } from '@/utils/common/shuffleArray'
import { albumDistinctions } from '@/redux/post/album.slice';
import { HeartIcon, PauseIcon, PlayIcon, ShuffleIcon } from '../ButtonIcon/StaticIcons'

interface Props {
    album: FetchAlbum,
    cover: string
}
export const AlbumPage: React.FC<Props> = ({ album, cover}) => {
  // Handle scroll Effect
  const [dominantColorStop, setDominantColorStop] = useState(5);
  const [substituteColorStop, setSubstituteColorStop] = useState(46);
  const [coverHeight, setCoverHeight] = useState('30vh'); // Initial height
  const [coverWidth, setCoverWidth] = useState('30vh');   // Initial width
  const [coverOpacity, setCoverOpacity] = useState(1) // Set the initial values

  const albumContainerRef = useRef<HTMLDivElement | null>(null);

  const handleAlbumScroll = () => {
    if (albumContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = albumContainerRef.current;
      const scrollPercentage = (scrollTop / (clientHeight)) * 100;

      // Calculate new stop values for both colors
      const newDominantColorStop = 5 - scrollPercentage * 0.75;
      const newSubstituteColorStop = 46 - scrollPercentage * 0.75;

      // Calculate new height, width, and opacity based on scroll position
      const newHeight = `${30 - scrollPercentage * 0.5}vh`; // Adjust the rate as needed
      const newWidth = `${30 - scrollPercentage * 0.5}vh`;  // Adjust the rate as needed
      const newOpacity = 1 - scrollPercentage * 0.04;        // Adjust the rate as needed

      setDominantColorStop(newDominantColorStop);
      setSubstituteColorStop(newSubstituteColorStop);
      setCoverHeight(newHeight);
      setCoverWidth(newWidth);
      setCoverOpacity(newOpacity);
    }
  };

  useEffect(() => {
    if (albumContainerRef.current) {
      albumContainerRef.current.addEventListener('scroll', handleAlbumScroll);
    }

    return () => {
      if (albumContainerRef.current) {
        albumContainerRef.current.removeEventListener('scroll', handleAlbumScroll);
      }
    };
  }, [albumContainerRef.current]);

  // Handle play all songs in the album
  const playlist = useAppSelector((state) => state.playlist);
  const dispatch = useAppDispatch();
  const handlePlayAll = () => {
    dispatch(togglePlay(!playlist.isPlay));
    if(playlist.shuffle){
      dispatch(updatePlaylist(shuffleArray(album.songs)));
    } else {
      dispatch(updatePlaylist(album.songs));
    }
  }
  useEffect(() => {
    if(playlist.playlist.length > 0) {
      // In case turn on shuffle and having song is playing
      if(Object.keys(playlist.current).length > 0){
        const indexOfCurrentSong = playlist.playlist.findIndex(song => song === playlist.current);
        dispatch(updateNextSong(playlist.playlist[indexOfCurrentSong+1]));
      } else {
        // Start new playlist
        dispatch(updateCurrentSong(playlist.playlist[0]));
      }
    }
  }, [playlist.playlist])
  // Handle Song Click
  const handleSongClick = (chosenSong: Song) => {
    // In case no song is playing
    if(playlist.playlist.length === 0){
      if(playlist.shuffle){
        // Create a new array with the shuffled order of songs, excluding the clicked song
        const shuffledSongs = shuffleArray(album.songs.filter(song => song !== chosenSong));
  
        // Insert the clicked song at the beginning of the shuffled array
        shuffledSongs.unshift(chosenSong);
  
        // Dispatch the updated array as the new playlist
        dispatch(updatePlaylist(shuffledSongs));
      } else {
        dispatch(updatePlaylist(album.songs));
        dispatch(updateCurrentSong(chosenSong));
      }
        
    } else {
      const indexOfCurrentSong = album.songs.findIndex(song => song === chosenSong);
      dispatch(updateCurrentSong(chosenSong))
      dispatch(updateNextSong(playlist.playlist[indexOfCurrentSong + 1]));
      dispatch(updatePrevSong(playlist.playlist[indexOfCurrentSong - 1] || {}));
    }
  }
  // Handle Shuffle
  const handleShuffleClick = (currentSong: Song) => {
    // Create a new array with the shuffled order of songs, excluding the clicked song
    const shuffledSongs = shuffleArray(album.songs.filter(song => song !== currentSong));

    // Insert the clicked song at the beginning of the shuffled array
    shuffledSongs.unshift(currentSong);

    // Dispatch the updated array as the new playlist
    dispatch(updatePlaylist(shuffledSongs));
  }
  useEffect(() => {
    // In case the song is playing
    if(Object.keys(playlist.current).length > 0){
      if(playlist.shuffle){
          handleShuffleClick(playlist.current)
      } else (dispatch(updatePlaylist(album.songs)))
    }
  }, [playlist.shuffle])

  // Read more
  const [albumDesc, setAlbumDesc] = useState(false);
  const handleAlbumDesc = () => {
    setAlbumDesc(!albumDesc)
  }
  const [artistBio, setArtistBio] = useState(false);
  const handleArtistBio = () => {
    setArtistBio(!artistBio)
  }
  return (
    <div className={styles.album}>
      <div 
        className={styles.albumBackground} 
        style={{
          background: (dominantColorStop <= -35) ? `${album.dominantColor}` : `linear-gradient(180deg, ${album.dominantColor} ${dominantColorStop}vh, rgba(30, 30, 30, 1) ${substituteColorStop}vh)`,
          height: (dominantColorStop <= -35) ? `6vh` : '100%'
        }}>
        {
          (dominantColorStop <= -35) && <h1>{album.title}</h1>
        }
        <div className={styles.albumCover} style={{ height: coverHeight, width: coverWidth, opacity: coverOpacity }}> 
          <img src={cover} alt={`${album.title} - ${album.artists}`}></img>
        </div>
      </div>
      <div className={styles.albumForground}>
        <div className={styles.albumContainer} ref={albumContainerRef}>
          <div className={styles.albumInfo}>
            <h1>{album.title}</h1>
            <div className={styles.artistInfo}>
              {
                album.artists[0].avatar && <img src={album.artists[0].avatar} alt={album.artists[0].name}></img>
              }
              <h2>{album.artists.map(artist => artist.name).join(' • ')}</h2>
            </div>
            <h3>Album • {album.year}</h3>
            <div className={styles.albumDistinctions}>
              {
                album.distinctions.map((item, ind) => {
                  return(
                    <div key={ind} className={styles.distinction}>
                      <img src='/assets/props/Gold laurel wreath 2.png'/>
                      <span>{item}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.playerFunction}>
            {/* Play Pause Button */}
            <div 
              onClick={handlePlayAll}
              className={styles.playButton} 
              style={{
                position: (dominantColorStop <= -35) ? 'fixed' : 'unset',
                top: (dominantColorStop <= -35) ? '3vh' : '',
                right: (dominantColorStop <= -35) ? '0' : '',
                transform: (dominantColorStop <= -35) ? 'translateX(-2vh)' : ''
                }}>
                  {
                    playlist.isPlay ? 
                    <PauseIcon color='var(--on-background)'/>
                    :
                    <PlayIcon color='var(--on-background)'/>
                  }
            </div>
            {/* Shuffle Button */}
            <div className={`${styles.shuffleButton} ${playlist.shuffle && styles.active}`} onClick={() => dispatch(toggleShuffle(!playlist.shuffle))}>
              <ShuffleIcon color={playlist.shuffle ? 'var(--on-background)' : 'var(--on-background-matte)'}/>
          </div>
            <div className={styles.button}>
              <HeartIcon color='var(--on-background-matte)'/>
            </div>
          </div>
          <ul className={styles.songList}>
            {
              album.songs.map((song: any, ind) => {
                return(
                  <li key={ind} className={`${styles.song} ${playlist.current === song && styles.active}`} onClick={() => handleSongClick(song)}>
                    <div className={styles.headIcon} style={{display: 'flex'}}>
                      <span className={`${styles.trackNumber}`}>{ind + 1}</span>
                      <PlayIcon color='var(--on-background)'/>
                    </div>
                    <div>
                      <h3>{song.title}</h3>
                      <h4>{song.artists.join(' • ')}</h4>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <div className={styles.infoSection}>
            {/* Album Desc */}
            <div className={`${styles.albumDesc} ${styles.wrapper} ${artistBio && styles.hide}`} style={{backgroundColor: album.dominantColor}} onClick={handleAlbumDesc}>
              <div className={styles.albumCover}>
                <h4>About the Album</h4>
                <img src={cover} alt={`${album.title} - ${album.artists}`}></img>
              </div>
              <div className={`${styles.albumDescContainer} ${albumDesc ? styles.active : styles.deactive}`} >
                <h5>{album.title}</h5>
                  <p dangerouslySetInnerHTML={{__html: album.desc}}>
                  </p>
              </div>
            </div>
            <div className={`${styles.artistBio} ${styles.wrapper} ${albumDesc && styles.hide}`} onClick={handleArtistBio}>
              <div className={styles.artistAvatar}>
                <h4>About the Artist</h4>
                <img src={album.artists[0].avatar} alt={`${album.artists[0].name}`}></img>
              </div>
              <div className={`${styles.artistContainer} ${artistBio ? styles.active : styles.deactive}`} >
                <h5>{album.artists[0].name}</h5>
                  <p dangerouslySetInnerHTML={{__html: artistBio ? album.artists[0].bio.content : album.artists[0].bio.summary}}>
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OnPlayingPlayer color={album.dominantColor}/>
    </div>
  )
}
