import dayjs from "dayjs";
import { Image } from "react-native-reanimated/lib/typescript/Animated";

export interface Report {
  id: number;
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
  date: string;
  additionalInfo: string;
  location: string;
  name: string;
  time: string;
  image: {
    filename: string;
    uri: string;
  };
  timeStamp: string; // Store time in a string format for simplicity
}
