import { GeoPoint } from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import { Image } from "react-native-reanimated/lib/typescript/Animated";

export interface Report {
  id: string;
  icon: Image;
  category:
    | "murder"
    | "robbery"
    | "homicide"
    | "injury"
    | "rape"
    | "carnapping"
    | "theft";
  title: string;
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
  status: "PENDING" | "VALID" | "PENALIZED";
  timestamp: number;
}
