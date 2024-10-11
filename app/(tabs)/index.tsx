//React Imports
import {Platform, KeyboardAvoidingView, ScrollView, Image, StyleSheet, Pressable, View, Text, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import {Map, APIProvider, useMapsLibrary, useMap} from '@vis.gl/react-google-maps'
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useMemo, useCallback, useRef, useState, useEffect} from 'react';

//Expo Imports
import { useFocusEffect } from 'expo-router';

//Component Imports
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

//Bottom Sheet Import
import BottomSheet, {BottomSheetScrollView, } from "@gorhom/bottom-sheet";

//Portal Imports
import { Portal } from '@gorhom/portal';

const toggler = require('../../assets/images/toggler.png');
const filter = require('../../assets/images/filter.png');
const heatmap = require('../../assets/images/heatmap.png');
const leftArrow = require('../../assets/images/left-arrow-icon.png');
const rightArrow = require('../../assets/images/right-arrow-icon.png');


const murder = require('../../assets/images/knife-icon.png');
const homicide = require('../../assets/images/homicide-icon.png');
const theft = require('../../assets/images/thief-icon.png');
const carnapping = require('../../assets/images/car-icon.png');
const injury = require('../../assets/images/injury-icon.png')
const robbery = require('../../assets/images/robbery-icon.png')
const rape = require('../../assets/images/rape-icon.png')

const PlacesLibrary = () => {
    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const [markers, setMarkers] = useState<google.maps.places.PlaceResult[]>([]);
  
    useEffect(() => {
      if (!placesLib || !map) return;
  
      const svc = new placesLib.PlacesService(map);

    }, [placesLib, map]);

    return null;
  };


export default function CrimeMap() {

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["3%", "25%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isHeatMapOn, setIsHeatMapOn] = useState(false);
  const position = {lat: 14.685992094228787, lng: 121.07589171824928};

  useFocusEffect(
    useCallback(() => {
      return () => sheetRef.current?.close()
    }, [])
  );

  // Static array of points for testing
  const heatmapPoints = [
    { latitude: 14.685992094228787, longitude: 121.07589171824928, weight: 1 },
    { latitude: 14.686502094228787, longitude: 121.07629171824928, weight: 1 },
    { latitude: 14.685502094228787, longitude: 121.07539171824928, weight: 1 },
    { latitude: 14.685002094228787, longitude: 121.07679171824928, weight: 1 },
    { latitude: 14.6857002094228787, longitude: 121.07489171824928, weight: 1 },
    { latitude: 14.686992094228787, longitude: 121.07789171824928, weight: 1 },
    { latitude: 14.687992094228787, longitude: 121.07889171824928, weight: 1 },
    { latitude: 14.688992094228787, longitude: 121.07989171824928, weight: 1 },
    { latitude: 14.689992094228787, longitude: 121.08089171824928, weight: 1 },
    { latitude: 14.690992094228787, longitude: 121.08189171824928, weight: 1 },
    { latitude: 14.691992094228787, longitude: 121.08289171824928, weight: 1 },
    { latitude: 14.692992094228787, longitude: 121.08389171824928, weight: 1 },
    { latitude: 14.693992094228787, longitude: 121.08489171824928, weight: 1 },
    { latitude: 14.694992094228787, longitude: 121.08589171824928, weight: 1 },
    { latitude: 14.695992094228787, longitude: 121.08689171824928, weight: 1 },
    { latitude: 14.696992094228787, longitude: 121.08789171824928, weight: 1 },
    { latitude: 14.697992094228787, longitude: 121.08889171824928, weight: 1 },
    { latitude: 14.698992094228787, longitude: 121.08989171824928, weight: 1 },
    { latitude: 14.699992094228787, longitude: 121.09089171824928, weight: 1 },
    { latitude: 14.700992094228787, longitude: 121.09189171824928, weight: 1 },
  ];

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    setIsBottomSheetOpen(index !== -1);
  }, []);

  const handlePresentModalPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  if(Platform.OS === 'android') {

    return (
    
    <GestureHandlerRootView>

        <SpacerView
        height='100%'
        width='100%'
        justifyContent='center'
        alignItems='center'
        >

            <MapView
            style = {style.map}
            provider={PROVIDER_GOOGLE}
            minZoomLevel={14}
            maxZoomLevel={17}
            cameraZoomRange = {{
            minCenterCoordinateDistance: 14,
            maxCenterCoordinateDistance: 17,
            animated: true,
            }}
            region={{
            latitude:14.685992094228787,
            longitude:121.07589171824928,
            latitudeDelta:0.009351,
            longitudeDelta:0.005772,
            }}>

                {!isHeatMapOn &&
                <Marker
                key={0}
                title='Crime Scene #1'
                coordinate={{
                latitude:14.685992094228787,
                longitude:121.07589171824928,
                }}/>
                }

                {isHeatMapOn &&
                <Heatmap
                points={heatmapPoints}
                radius={40}>
                </Heatmap>
                }

            </MapView>

            <Pressable
            style = {{
            position: 'absolute',
            top: 30,
            left: 20,
            }}
            onPress={() =>
            {}}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={toggler}/>
            </Pressable>

            {!isBottomSheetOpen && <TouchableOpacity
            style = {{
            position: 'absolute',
            top: 30,
            right: 20,
            }}
            onPress={() => handlePresentModalPress(1)}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={filter}/>
            </TouchableOpacity>}

            {isBottomSheetOpen && <TouchableOpacity
            style = {{
            position: 'absolute',
            top: 30,
            right: 20,
            }}
            onPress={() => handleClosePress()}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={filter}/>
            </TouchableOpacity>}
            
            
            <TouchableOpacity
            style = {{
            position: 'absolute',
            top: 110,
            right: 20,
            }} 
            onPress={() => {setIsHeatMapOn(!isHeatMapOn)}}
            >
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={heatmap}/>
            </TouchableOpacity>

            <View style = {{position: 'absolute', bottom: 30, width: '75%', height: 'auto', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
                
                <Pressable
                style = {{
                    width: 'auto',
                    height: 'auto',
                }}
                onPress={() => {}}
                >
                    <Image style = {{width: 36, height: 36}} source={leftArrow}/>

                </Pressable>
                
                <Pressable
                style = {{
                    
                }}
                onPress={() => {}}
                >
                        <Text style = {{ 
                        width: 'auto',
                        height: 'auto',
                        paddingVertical: '1%',
                        backgroundColor: '#115272',
                        paddingHorizontal: '5%',
                        color: '#FFF', 
                        fontWeight: 'bold',
                        fontSize: 18,
                        borderRadius: 50
                        }}>
                            09/02/2024
                        </Text>
                </Pressable>

                <Pressable
                style = {{
                    width: 'auto',
                    height: 'auto',
                }}
                onPress={() => {}}
                >
                    <Image style = {{width: 36, height: 36}} source={rightArrow}/>

                </Pressable>
            </View>

        </SpacerView>

        <Portal>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                backgroundStyle={{backgroundColor: '#115272'}}
                handleIndicatorStyle={{backgroundColor: '#FFF', width: '40%'}}
                enablePanDownToClose={true}
                >

                <BottomSheetScrollView style = {{height: 'auto', backgroundColor: "#115272",}} horizontal = {true} contentContainerStyle = {{alignItems:"center", width: 'auto', paddingVertical: '2.5%' }}>
                    
                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='25%' paddingRight='25%' paddingTop='25%' paddingBottom='25%' borderRadius = {10} borderWidth={3} >
                            <Image source = {murder} />
                        </SpacerView>
                            <ThemedText style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Murder</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='25%' paddingRight='25%' paddingTop='25%' paddingBottom='25%' borderRadius = {10} borderWidth={3}>
                            <Image source = {theft} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Theft</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='21%' paddingRight='21%' paddingTop='30%' paddingBottom='30%' borderRadius = {10} borderWidth={3}>
                            <Image source = {carnapping} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Carnapping</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='23%' paddingRight='23%' paddingTop='29%' paddingBottom='29%' borderRadius = {10} borderWidth={3}>
                            <Image source = {homicide} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Homicide</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='30%' paddingRight='30%' paddingTop='22%' paddingBottom='22%' borderRadius = {10} borderWidth={3}>
                            <Image source = {injury} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Injury</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='26%' paddingRight='26%' paddingTop='22%' paddingBottom='22%' borderRadius = {10} borderWidth={3}>
                            <Image source = {robbery} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Robbery</ThemedText>
                    </SpacerView>

                    <SpacerView width = "14%" height = "100%" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" padding='2.5%'>
                        <SpacerView style = {{borderColor: "#FFF"}}  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" paddingLeft='19%' paddingRight='19%' paddingTop='19%' paddingBottom='19%' borderRadius = {10} borderWidth={3}>
                            <Image source = {rape} />
                        </SpacerView>
                            <ThemedText  style = {{marginTop: '3%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Rape</ThemedText>
                    </SpacerView>

                    <SpacerView width={560} height='auto'></SpacerView>

                </BottomSheetScrollView>

            </BottomSheet>
        </Portal>

    </GestureHandlerRootView>
    );
  }
  else if(Platform.OS === 'web') {
    return (
    
      <GestureHandlerRootView>

        <SpacerView
        height='100%'
        width='100%'
        justifyContent='center'
        alignItems='center'
        >
        <APIProvider apiKey={'AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0'}>
                <Map defaultCenter={position} 
                defaultZoom={15} 
                mapId="5cc51025f805d25d" 
                mapTypeControl = {false}
                streetViewControl={false}
                mapTypeId='roadmap'
                restriction=
                {{latLngBounds: {
                    north: 14.693963, 
                    south: 14.669975, 
                    west: 121.069508, 
                    east: 121.087376
                    }
                }}
                minZoom={15}
                maxZoom={18}
                >
                        
                        <PlacesLibrary />
                </Map>
        </APIProvider>

            <Pressable
            style = {{
            position: 'absolute',
            top: 30,
            left: 20,
            }}
            onPress={() =>
            {}}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={toggler}/>
            </Pressable>

            {!isBottomSheetOpen && <Pressable
            style = {{
            position: 'absolute',
            top: 30,
            right: 20,
            }}
            onPress={() => handlePresentModalPress(1)}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={filter}/>
            </Pressable>}

            {isBottomSheetOpen && <Pressable
            style = {{
            position: 'absolute',
            top: 30,
            right: 20,
            }}
            onPress={() => handleClosePress()}>
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={filter}/>
            </Pressable>}
            
            
            <Pressable
            style = {{
            position: 'absolute',
            top: 110,
            right: 20,
            }} 
            onPress={() => {}}
            >
                <Image style = {{
                width: 50,
                height: 50,
                }}
                source={heatmap}/>
            </Pressable>

        </SpacerView>


    </GestureHandlerRootView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },

  map: {
    width: '100%',
    height: '100%'
  },
  bottomSheet: {
    position: 'absolute',
    bottom:0,
  },
  bottomSheetTitle: {
    justifyContent: "center",
  }
})