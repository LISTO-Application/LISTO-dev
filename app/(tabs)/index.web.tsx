//React Imports
import {Platform, KeyboardAvoidingView, ScrollView, Image, StyleSheet, Pressable, View, Text} from 'react-native';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useMemo, useCallback, useRef, useState} from 'react';

//Expo Imports
import {router} from 'expo-router';

//Stylesheet Imports
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';

//Component Imports
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

//Bottom Sheet Import
import BottomSheet, {BottomSheetScrollView, } from "@gorhom/bottom-sheet";

//Portal Imports
import { Portal } from '@gorhom/portal';

const logo = require('../../assets/images/report-icon.png');
const toggler = require('../../assets/images/toggler.png');
const filter = require('../../assets/images/filter.png');
const heatmap = require('../../assets/images/heatmap.png');

const homicide = require('../../assets/images/knife-icon.png');
const theft = require('../../assets/images/thief-icon.png');
const carnapping = require('../../assets/images/car-icon.png');

export default function CrimeMap() {

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["3%", "25%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);

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

  if(Platform.OS === 'web') {
    const mapRef = useRef<MapView>(null);
    return (
    
      <GestureHandlerRootView>

        <SpacerView
        height='100%'
        width='100%'
        justifyContent='center'
        alignItems='center'
        >

            <MapView
            ref = {mapRef}
            style = {{width: '100%', height: '100%', flex: 1,}}
            provider='google'
            googleMapsApiKey = "AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0"
            loadingFallback={
              <View>
                <Text>Loading...</Text>
              </View>}
              />
        

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

        <Portal>
            <BottomSheet
                ref={sheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                backgroundStyle={{backgroundColor: '#115272'}}
                handleIndicatorStyle={{backgroundColor: '#FFF', width: '40%'}}>

                <BottomSheetScrollView style = {{height: 'auto', width: 'auto', backgroundColor: "#115272"}} horizontal = {true}>
                    
                    <SpacerView width = "33.3%" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" padding = "75%" borderRadius = {10} >
                            <Image source = {homicide} />
                        </SpacerView>
                    
                        <SpacerView  width = "auto" height = "auto" justifyContent = "center" marginTop='1%'>
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Homicide</ThemedText>
                        </SpacerView>
                    </SpacerView>

                    <SpacerView width = "33.3%" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" padding = "75%" borderRadius = {10}>
                            <Image source = {theft} />
                        </SpacerView>

                        <SpacerView  width = "auto" height = "auto" justifyContent = "center" marginTop='1%'>
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Theft</ThemedText>
                        </SpacerView>
                    </SpacerView>

                    <SpacerView width = "33.3%" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#DA4B46" justifyContent = "center" padding = "75%" borderRadius = {10}>
                            <Image source = {carnapping} />
                        </SpacerView>
                        <SpacerView  width = "auto" height = "auto" justifyContent = "center" marginTop='1%'>
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Carnapping</ThemedText>
                        </SpacerView>
                    </SpacerView>

                    <SpacerView width={160} height='auto'></SpacerView>

                </BottomSheetScrollView>

            </BottomSheet>
        </Portal>

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