import React from "react";
import * as Fa from "react-icons/fa";
import { EVENTS, logFirebaseEvent } from "../../firebase";
const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setCurrentSong,
  setSongs,
}) => {
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return { ...song, active: true };
      } else {
        return { ...song, active: false };
      }
    });

    setSongs(newSongs);
    if (isPlaying) audioRef.current.play();
  };

  // !exp Event handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      logFirebaseEvent(EVENTS.CLICK.PLAY_SONG, currentSong.name);
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      logFirebaseEvent(EVENTS.CLICK.SKIP_FORWARD_SONG, currentSong.name);
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    } else if (direction === "skip-back") {
      logFirebaseEvent(EVENTS.CLICK.SKIP_BACKWARD_SONG, currentSong.name);
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
  };

  // !exp ultility functions
  // this converts the seconds into minutes and seconds format
  const getTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    // padStart will fill the string with '0' for 2 spaces, and then apply {seconds} at the end
    const secondsWithZero = String(seconds).padStart(2, "0");
    return `${minutes}:${secondsWithZero}`;
  };

  // Add the styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <div className="player-container">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right, 
          ${currentSong.color[0]}, 
          ${currentSong.color[1]}
        )`,
          }}
          className="track"
        >
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        <p>{getTime(songInfo.duration || 0)}</p>
      </div>
      <div className="play-control">
        <Fa.FaAngleLeft
          onClick={() => {
            skipTrackHandler("skip-back");
          }}
          size="1rem"
          className="skip-backward"
        />
        {isPlaying ? (
          <Fa.FaPause onClick={playSongHandler} size="1rem" className="play" />
        ) : (
          <Fa.FaPlay onClick={playSongHandler} size="1rem" className="pause" />
        )}

        <Fa.FaAngleRight
          onClick={() => {
            skipTrackHandler("skip-forward");
          }}
          size="1rem"
          className="skip-forward"
        />
      </div>
    </div>
  );
};

export default Player;
