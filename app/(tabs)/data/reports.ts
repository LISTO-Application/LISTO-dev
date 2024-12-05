import { GeoPoint } from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { Image } from "react-native-reanimated/lib/typescript/Animated";

export interface Report {
  uid: string;
  phone: string;
  category:
    | "murder"
    | "robbery"
    | "homicide"
    | "injury"
    | "rape"
    | "carnapping"
    | "theft";
  date: Date;
  additionalInfo: string;
  location: string;
  coordinate: GeoPoint;
  name: string;
  time: string;
  image: {
    filename: string;
    uri: string;
  };
  status: boolean;
  timestamp: number;
}
