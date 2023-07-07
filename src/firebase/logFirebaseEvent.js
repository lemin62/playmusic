import { logEvent } from "firebase/analytics";
import { analytics } from "./";
/**
 * It takes an event object and a song name, and logs the event to Firebase Analytics
 * @param event - The event object that we created in the previous step.
 * @param songName - The name of the song that was played.
 */
export const logFirebaseEvent = (event, songName) => {
  logEvent(analytics, event.eventName, {
    ...event.params,
    songName: songName ?? "",
  });
};
