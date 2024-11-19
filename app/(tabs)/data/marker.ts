import { GeoPoint } from "@react-native-firebase/firestore";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

export type CrimeType =
  | "murder"
  | "robbery"
  | "homicide"
  | "injury"
  | "rape"
  | "carnapping"
  | "theft";

export interface MarkerType {
  id: string;
  location: GeoPoint;
  date: string;
  details: string | undefined;
  crime: CrimeType;
  image: any;
}


crime type
date (string)
address (string)
coordinates (geopoint)
additional details
img_url

(dapat auto mga to so not included sa form)
id
reported_by (string)
time reported

export const crimeImages: { [key in CrimeType]: any } = {
  murder: require("../../../assets/images/knife-icon.png"),
  homicide: require("../../../assets/images/homicide-icon.png"),
  theft: require("../../../assets/images/thief-icon.png"),
  carnapping: require("../../../assets/images/car-icon.png"),
  injury: require("../../../assets/images/injury-icon.png"),
  robbery: require("../../../assets/images/robbery-icon.png"),
  rape: require("../../../assets/images/rape-icon.png"),
};

export const dummyMarkers: MarkerType[] = [
  {
    id: "1",
    date: "11-13-2024",
    location: new GeoPoint(14.677398674381005, 121.07831643519876),
    details: "Hi there!",
    crime: "robbery",
    image: crimeImages["robbery"],
  },
  {
    id: "2",
    date: "11-12-2024",
    location: new GeoPoint(14.67420200209759, 121.08917401729104),
    details: "Hello! This is marker 2",
    crime: "theft",
    image: crimeImages["theft"],
  },
  {
    id: "3",
    date: "11-13-2024",
    location: new GeoPoint(14.675904132114443, 121.07037709651468),
    details: "I'm new here",
    crime: "homicide",
    image: crimeImages["homicide"],
  },
  {
    id: "4",
    date: "11-13-2024",
    location: new GeoPoint(14.670382540210406, 121.07132123408792),
    details: "Same here!",
    crime: "rape",
    image: crimeImages["rape"],
  },
  {
    id: "5",
    date: "10-05-2024",
    location: new GeoPoint(14.676500312034, 121.07850000000001),
    details: "Another robbery incident",
    crime: "robbery",
    image: crimeImages["robbery"],
  },
  {
    id: "6",
    date: "10-22-2024",
    location: new GeoPoint(14.67412000000001, 121.08780000000002),
    details: "Stolen items reported",
    crime: "theft",
    image: crimeImages["theft"],
  },
  {
    id: "7",
    date: "12-01-2024",
    location: new GeoPoint(14.67510000000001, 121.06990000000001),
    details: "New homicide case found",
    crime: "homicide",
    image: crimeImages["homicide"],
  },
  {
    id: "8",
    date: "11-28-2024",
    location: new GeoPoint(14.67000000000001, 121.07010000000001),
    details: "Rape incident in the area",
    crime: "rape",
    image: crimeImages["rape"],
  },
  {
    id: "9",
    date: "11-10-2024",
    location: new GeoPoint(14.67600000000001, 121.07820000000002),
    details: "Robbery reported here",
    crime: "robbery",
    image: crimeImages["robbery"],
  },
  {
    id: "10",
    date: "11-16-2024",
    location: new GeoPoint(14.67350000000001, 121.08650000000001),
    details: "Theft in the vicinity",
    crime: "theft",
    image: crimeImages["theft"],
  },
  {
    id: "11",
    date: "12-15-2024",
    location: new GeoPoint(14.67800000000001, 121.07760000000002),
    details: "Homicide near the street",
    crime: "homicide",
    image: crimeImages["homicide"],
  },
  {
    id: "12",
    date: "10-18-2024",
    location: new GeoPoint(14.67550000000001, 121.06950000000001),
    details: "Rape incident last night",
    crime: "rape",
    image: crimeImages["rape"],
  },
  {
    id: "13",
    date: "10-30-2024",
    location: new GeoPoint(14.67680000000001, 121.07870000000001),
    details: "Robbery investigation",
    crime: "robbery",
    image: crimeImages["robbery"],
  },
  {
    id: "14",
    date: "11-03-2024",
    location: new GeoPoint(14.67300000000001, 121.08820000000001),
    details: "Theft case with suspects",
    crime: "theft",
    image: crimeImages["theft"],
  },
  {
    id: "15",
    date: "12-22-2024",
    location: new GeoPoint(14.67720000000001, 121.07100000000002),
    details: "Murder scene near here",
    crime: "homicide",
    image: crimeImages["homicide"],
  },
  {
    id: "16",
    date: "10-25-2024",
    location: new GeoPoint(14.67480000000001, 121.07210000000002),
    details: "Rape assault last week",
    crime: "rape",
    image: crimeImages["rape"],
  },
  {
    id: "17",
    date: "12-10-2024",
    location: new GeoPoint(14.67580000000001, 121.07340000000001),
    details: "Robbery attempt at night",
    crime: "robbery",
    image: crimeImages["robbery"],
  },
  {
    id: "18",
    date: "11-29-2024",
    location: new GeoPoint(14.67400000000001, 121.08500000000001),
    details: "Theft during daylight",
    crime: "theft",
    image: crimeImages["theft"],
  },
  {
    id: "19",
    date: "12-02-2024",
    location: new GeoPoint(14.67630000000001, 121.07230000000001),
    details: "Homicide in the area",
    crime: "homicide",
    image: crimeImages["homicide"],
  },
  {
    id: "20",
    date: "11-19-2024",
    location: new GeoPoint(14.67070000000001, 121.07150000000002),
    details: "Rape case under investigation",
    crime: "rape",
    image: crimeImages["rape"],
  },
];
