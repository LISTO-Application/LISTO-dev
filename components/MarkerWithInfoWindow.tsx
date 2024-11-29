//Advanced Marker with Info Window
//The markers are mapped and stored in a state, waiting to be inserted into the database
//Active Marker Id is the marker that is recently clicked, handleMarkerClick does that
//AdvancedMarker component uses ref prop to use the markerRefs as the current reference,
//basically using the active marker id
//Cannot be separated into a different component, Image props is not functioning well

import { CrimeFilter } from "@/app/(tabs)/crimemap";
import {
  crimeImages,
  CrimeType,
  dummyMarkers,
  MarkerType,
} from "@/app/(tabs)/data/marker";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, StyleSheet } from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import styled, { createGlobalStyle, keyframes } from "styled-components";

export const MarkerWithInfoWindow = ({
  markers,
  selectedDate,
  allMarkers,
  setMarkers,
  selectedCrimeFilters,
}: {
  markers: MarkerType[];
  selectedDate: any;
  allMarkers: any;
  setMarkers: any;
  selectedCrimeFilters: CrimeFilter[];
}) => {
  //Marker Details
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [markerDetails, setMarkerDetails] = useState<string>();
  const [markerDate, setMarkerDate] = useState<string>();
  const [markerCrime, setMarkerCrime] = useState<CrimeType | undefined>();
  const [markerName, setMarkerName] = useState<string>();
  const markerRefs = useRef<{ [key: string]: any }>({});
  const [filteredCrimeItems, setFilteredCrimeItems] = useState<MarkerType[]>(
    []
  );
  try {
    useEffect(() => {
      markers.forEach((marker) => {
        const markerElement = markerRefs.current[marker.id]?.current;
        if (markerElement) {
          markerElement.classList.add("dropAnimation");
        }
      });
    }, [markers]);
  } catch (error) {
    console.warn(error);
  }

  try {
    useEffect(() => {
      filterMarkers();
    }, [selectedCrimeFilters, selectedDate, allMarkers]);

    const filterMarkers = () => {
      let filteredMarkers = allMarkers;

      if (selectedDate) {
        const selectedMonth = dayjs(selectedDate).month() + 1;
        filteredMarkers = filteredMarkers.filter((marker: any) => {
          const markerMonth = dayjs(marker.date).month() + 1;
          return markerMonth === selectedMonth;
        });
      }
      console.log("All Markers:", allMarkers);
      console.log(
        "Selected Month:",
        selectedDate ? dayjs(selectedDate).month() + 1 : "None"
      );
      console.log(
        "Selected Crimes:",
        selectedCrimeFilters.map((filter) => filter.label)
      );
      console.log("Filtered Markers:", filteredMarkers);
      if (selectedCrimeFilters.length > 0) {
        const filteredMarkers = markers.filter((marker: any) =>
          selectedCrimeFilters.some((filter) => filter.label === marker.crime)
        );
        // console.log("TempItems", tempItems);
        setFilteredCrimeItems(filteredMarkers);
        // setMarkers(tempItems.flat());
      } else {
        setFilteredCrimeItems([]);
      }
    };
    // Example: Initialize allMarkers and markers
    // useEffect(() => {
    //   // Assuming fetchMarkers() fetches the original marker data
    //   const fetchMarkers = async () => {
    //     const data = await getMarkerData(); // Replace with your actual data fetching logic
    //     setAllMarkers(data);
    //     setMarkers(data); // Initially, markers are the same as allMarkers
    //   };

    //   fetchMarkers();
    // }, []);
  } catch (error) {}

  const handleMarkerClick = (marker: MarkerType) => {
    setActiveMarkerId(marker.id);
    setMarkerDetails(marker.details);
    setMarkerDate(marker.date);
    setMarkerCrime(marker.crime);
    setMarkerName(marker.title);
  };

  //To display them
  const displayMarkers =
    filteredCrimeItems.length > 0 ? filteredCrimeItems : markers;

  return (
    <>
      <style>
        {`
          @keyframes drop {
            0% {
              transform: translateY(-200px) scaleY(0.9);
              opacity: 0;
            }
            5% {
              opacity: 0.7;
            }
            50% {
              transform: translateY(0px) scaleY(1);
              opacity: 1;
            }
            65% {
              transform: translateY(-17px) scaleY(0.9);
              opacity: 1;
            }
            75% {
              transform: translateY(-22px) scaleY(0.9);
              opacity: 1;
            }
            100% {
              transform: translateY(0px) scaleY(1);
              opacity: 1;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
            .drop {
              animation: drop 0.3s linear forwards var(--delay-time);
            }
          }
        `}
      </style>
      {displayMarkers.map((marker: any) => {
        const latitude = marker.location._latitude;
        const longitude = marker.location._longitude;

        markerRefs.current[marker.id] =
          markerRefs.current[marker.id] || React.createRef();

        const crimeTypeImage = crimeImages[marker.crime as CrimeType];
        const randomDelay = `${Math.random() * 2}s`;

        const markerStyle = {
          animation: `drop 600ms ease-in-out ${randomDelay} forwards`,
          opacity: 0,
        };
        return (
          <AdvancedMarker
            ref={markerRefs.current[marker.id]}
            key={marker.id}
            position={{ lat: latitude, lng: longitude }}
            onClick={() => handleMarkerClick(marker)}
            style={markerStyle}
          >
            <Pin background={"red"} glyphColor={"blue"} >
              {crimeTypeImage ? (
                <Image
                  source={crimeTypeImage}
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <Text>No image available</Text>
              )}
            </Pin>
          </AdvancedMarker>
        );
      })}

      {activeMarkerId && markerRefs.current[activeMarkerId] && (
       <InfoWindow
       anchor={markerRefs.current[activeMarkerId].current}
       onClose={() => setActiveMarkerId(null)}
     >
       <div className="custom-info-window">
         <h2>{markerName}</h2>
         <div>
           <p><strong>Details:</strong> {markerDetails}</p>
           <p><strong>Date:</strong> {markerDate}</p>
           <p><strong>Crime Type:</strong> {markerCrime}</p>
         </div>
       </div>
     </InfoWindow>
      )}
    </>
  );
};
