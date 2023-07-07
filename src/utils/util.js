/**
 * If the isPlaying prop is true, play the audio file
 * @param isPlaying - a boolean that determines whether the audio should be playing or not
 * @param audioRef - This is the audio element that we want to play.
 */
export const playAudio = (isPlaying, audioRef) => {
  if (isPlaying) {
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then((audio) => {
          audioRef.current.play();
        })
        .catch((error) => console.log(error));
    }
  }
};
