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
  name: string;
  time: string; // Store time in a string format for simplicity
}
