import { CrimeType, MarkerType } from "@/app/(tabs)/data/marker";
import { db } from "@/app/FirebaseConfig";

import {
  collection,
  GeoPoint,
  getDocs,
  query,
} from "@react-native-firebase/firestore";

export type MarkerProps = {
  coordinate: string;
  weight: number;
}[];

export type MarkersCollection = MarkerProps;

export async function loadMarkersFromFirestore(): Promise<MarkerProps> {
  try {
    const crimesCollection = collection(db, "crimes");
    const q = query(crimesCollection);
    const querySnapshot = await getDocs(q);
    const markers: MarkerType[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id, // Use Firestore document ID
        location: data.location || "",
        coordinate: data.coordinate as GeoPoint, // Cast to GeoPoint
        title: data.title || "",
        date: data.date || "",
        details: data.details,
        crime: data.crime as CrimeType, // Cast to CrimeType
        image: data.image,
      };
    });
    console.log(markers);

    const coordinateWeights: Record<string, number> = {};

    markers.forEach((marker) => {
      const key = `${marker.coordinate.latitude},${marker.coordinate.longitude}`;

      if (!coordinateWeights[key]) {
        coordinateWeights[key] = 1;
      } else {
        coordinateWeights[key] += 1;
      }
    });

    const result = Object.entries(coordinateWeights).map(
      ([coordinate, weight]) => ({
        coordinate,
        weight,
      })
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching markers from Firestore:", error);
    throw error;
  }
}
