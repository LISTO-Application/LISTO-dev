import { GeoPoint } from "firebase/firestore";

export interface Distress {
  acknowledged: Boolean;
  addInfo: string;
  barangay: string;
  emergencyType: {
    crime: Boolean;
    fire: Boolean;
    injury: Boolean;
  };
  location: GeoPoint;
  timestamp: number;
}
