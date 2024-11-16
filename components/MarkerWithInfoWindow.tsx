//Advanced Marker with Info Window
//The markers are mapped and stored in a state, waiting to be inserted into the database
//Active Marker Id is the marker that is recently clicked, handleMarkerClick does that
//AdvancedMarker component uses ref prop to use the markerRefs as the current reference,
//basically using the active marker id
//Cannot be separated into a different component, Image props is not functioning well

import { crimeImages, CrimeType, MarkerType } from "@/app/(tabs)/data/marker";
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
}: {
  markers: MarkerType[];
  selectedDate: any;
  allMarkers: any;
  setMarkers: any;
}) => {
  //Marker Details
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [markerDetails, setMarkerDetails] = useState<string>();
  const [markerDate, setMarkerDate] = useState<string>();
  const markerRefs = useRef<{ [key: string]: any }>({});

  try {
    // Initialize markers and trigger drop animation
    useEffect(() => {
      markers.forEach((marker) => {
        // Add CSS class to trigger the drop animation
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
    console.log(selectedDate);
    markers.filter((marker: any) => {
      const markerDate = dayjs(marker.Date).format("MM-DD-YYYY");
      return markerDate === selectedDate.format("MM-DD-YYYY");
    });
  } catch (error) {
    console.error(error);
  }

  try {
    useEffect(() => {
      const today = dayjs(new Date()).month() + 1;
      const filteredMarkers = allMarkers.filter((marker: any) => {
        const markerMonth = dayjs(marker.date).month() + 1;
        return markerMonth === today;
      });
      setMarkers(filteredMarkers);
    }, [allMarkers, selectedDate]);
  } catch (error) {
    console.error(error);
  }
  try {
    useEffect(() => {
      markers.forEach((marker) => {
        console.log("Filtered markers: ", markers);
        // console.log("Selected Date: ", selectedDate.format("MM-DD-YYYY"));
        console.log("Marker Date:", dayjs(marker.date).format("MM-DD-YYYY"));
      });
    }, [markers, selectedDate]);
  } catch (error) {
    console.error(error);
  }

  const handleMarkerClick = (marker: MarkerType) => {
    setActiveMarkerId(marker.id);
    setMarkerDetails(marker.details);
    setMarkerDate(marker.date);
  };
  return (
    <>
      {markers.map((marker: any) => {
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
            <AdvancedMarker
              ref={markerRefs.current[marker.id]}
              key={marker.id}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => handleMarkerClick(marker)}
              style={markerStyle}
            >
              <Pin
                background={"red"}
                borderColor={"#115272"}
                glyphColor={"blue"}
              >
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
          </>
        );
      })}

      {activeMarkerId && markerRefs.current[activeMarkerId] && (
        <InfoWindow
          anchor={markerRefs.current[activeMarkerId].current}
          onClose={() => setActiveMarkerId(null)}
        >
          <h2>{activeMarkerId}</h2>
          <p>{markerDetails}</p>
          <p>{markerDate}</p>
        </InfoWindow>
      )}
    </>
  );
};
