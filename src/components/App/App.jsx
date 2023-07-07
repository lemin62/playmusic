import React, { useEffect, useRef, useState } from "react";
import "../../styles/app.scss";
import Library from "../Library/Library";
import Nav from "../Nav/Nav";
import Player from "../Player/Player";
import Song from "../Song/Song";
import { onSnapshot } from "firebase/firestore";
import { logFirebaseEvent, EVENTS } from "../../firebase/";
import { Bars } from "react-loader-spinner";
import { songsCollectionRef } from "../../firebase/firestore.collections";

const initialSongsState = [
  {
    name: "",
    cover: "",
    artist: "",
    audio: "",
    color: [],
    id: "",
    active: false,
  },
];

function App({ isDarkTheme, setIsDarkTheme }) {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState(initialSongsState);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [isSongEnded, setIsSongEnded] = useState(false);
  const audioRef = useRef(null);

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    setIsSongEnded(true);
  };

  useEffect(() => {
    // @ts-ignore
    if (isPlaying && isSongEnded === true) {
      // @ts-ignore
      audioRef?.current?.play();
      setIsSongEnded(false);
    }
  }, [isSongEnded, currentSong]);

  // log to firebase tracker when app loads
  useEffect(() => {
    logFirebaseEvent(EVENTS.VIEW.LANDING, "");
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onSnapshot(songsCollectionRef, (querySnapShot) => {
      const items = [];
      querySnapShot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });

      setSongs(items.sort(compare));
      setCurrentSong(items[Math.floor(Math.random() * items.length)]);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={`App ${libraryStatus ? "library-active" : ""}`}
      id={isDarkTheme ? "darkMode" : "lightMode"}
    >
      {!isLoading ? (
        <>
          <Nav
            libraryStatus={libraryStatus}
            setLibraryStatus={setLibraryStatus}
            setIsDarkTheme={setIsDarkTheme}
            isDarkTheme={isDarkTheme}
          />
          <Song currentSong={currentSong} isPlaying={isPlaying} />
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            audioRef={audioRef}
            songInfo={songInfo}
            setSongInfo={setSongInfo}
            songs={songs}
            setCurrentSong={setCurrentSong}
            setSongs={setSongs}
          />
          <Library
            songs={songs}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setSongs={setSongs}
            libraryStatus={libraryStatus}
          />
          <audio
            //this event occurs when the time is updated
            onTimeUpdate={(event) =>
              timeUpdateHandler(event, songInfo, setSongInfo)
            }
            //this event occurs when meta data is loaded
            onLoadedMetadata={(event) =>
              timeUpdateHandler(event, songInfo, setSongInfo)
            }
            //this passes this element as audioRef like document.querySelector
            ref={audioRef}
            src={currentSong.audio}
            onEnded={songEndHandler}
          />
        </>
      ) : (
        <div
          style={{
            margin: "0 auto",
            marginTop: "200px",
          }}
        >
          <Bars color={isDarkTheme ? "#81789b" : "#606060"} />
        </div>
      )}
    </div>
  );
}

// =================
// Helper function
// =================
const timeUpdateHandler = (event, songInfo, setSongInfo) => {
  // !exp currentTime and duration are audio element built in attributes (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
  const currentTime = event.target.currentTime;
  const duration = event.target.duration;

  // calculate percentage
  const roundedCurrent = Math.round(currentTime);
  const roundedDuration = Math.round(duration);
  const animation = Math.round((roundedCurrent / roundedDuration) * 100);

  setSongInfo({
    ...songInfo,
    currentTime,
    duration,
    animationPercentage: animation,
  });
};

const compare = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export default App;
