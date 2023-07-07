import { collection } from "firebase/firestore";
import { db } from ".";

const songsCollectionRef = collection(db, "songs");

export { songsCollectionRef };
