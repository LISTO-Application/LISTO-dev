//React Imports
import {Platform, KeyboardAvoidingView, ScrollView, Image, StyleSheet, Pressable} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
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
import BottomSheetModal, {BottomSheetScrollView, BottomSheetView, } from "@gorhom/bottom-sheet";

//Portal Imports
import { Portal } from '@gorhom/portal';

const logo = require('../../assets/images/report-icon.png');
const toggler = require('../../assets/images/toggler.png');
const filter = require('../../assets/images/filter.png');
const heatmap = require('../../assets/images/heatmap.png');

const qcLogo = require('../../assets/images/qc-logo.png');
const holyspiritLogo = require('../../assets/images/holyspirit-logo.png');
const balaraLogo = require('../../assets/images/balara-logo.png');

export default function CrimeMap() {

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["3%", "25%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    setIsBottomSheetOpen(index !== -1);
  }, []);

  const handlePresentModalPress = () => sheetRef.current?.present();

  const handleSnapPress = useCallback((index: number) => {
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

                <Marker
                key={0}
                title='Crime Scene #1'
                coordinate={{
                latitude:14.685992094228787,
                longitude:121.07589171824928,
                }}/>

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

            {!isBottomSheetOpen && <Pressable
            style = {{
            position: 'absolute',
            top: 30,
            right: 20,
            }}
            onPress={() => handlePresentModalPress()}>
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
            <BottomSheetModal
                ref={sheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                backgroundStyle={{backgroundColor: '#115272'}}
                handleIndicatorStyle={{backgroundColor: '#FFF'}}>

                <BottomSheetView style = {style.bottomSheetTitle}>
                <SpacerView height={0}></SpacerView>
                </BottomSheetView>

                <BottomSheetScrollView style = {{height: 'auto', width: 'auto', backgroundColor: "#115272"}} horizontal = {true}>
                    
                    <SpacerView width = "1/3" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" marginLeft='2.5%' marginRight='2.5%' backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#FFF" justifyContent = "center" padding = "10%" borderRadius = {10} >
                            <Image source = {qcLogo} />
                        </SpacerView>
                    
                        <SpacerView  width = "auto" height = "auto" justifyContent = "center">
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >QC Hotline</ThemedText>
                        </SpacerView>
                    </SpacerView>

                    <SpacerView width = "1/3" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" marginLeft='2.5%' marginRight='2.5%' backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#FFF" justifyContent = "center" padding = "10%" borderRadius = {10}>
                            <Image source = {holyspiritLogo} />
                        </SpacerView>

                        <SpacerView  width = "auto" height = "auto" justifyContent = "center">
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Holy Spirit</ThemedText>
                        </SpacerView>
                    </SpacerView>

                    <SpacerView width = "1/3" height = "auto" flexDirection = "column" justifyContent = "center" alignItems = "center" marginLeft='2.5%' marginRight='2.5%' backgroundColor = "#115272" paddingLeft = "2.5%" paddingRight = "2.5%">
                        <SpacerView  width = "auto" height = "auto" backgroundColor = "#FFF" justifyContent = "center" padding = "10%" borderRadius = {10}>
                            <Image source = {balaraLogo} />
                        </SpacerView>
                        <SpacerView  width = "auto" height = "auto" justifyContent = "center">
                            <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Old Balara</ThemedText>
                        </SpacerView>
                    </SpacerView>
                    <SpacerView width={160} height='auto'></SpacerView>

                </BottomSheetScrollView>

            </BottomSheetModal>
        </Portal>

    </GestureHandlerRootView>
    );
  }
  else if(Platform.OS === 'web') {
    return (
    
      <SpacerView
      height='100%'
      width='100%'
      style={[utility.blueBackground]}
      flexDirection='row'
      justifyContent='space-between'
      alignItems = 'center'
      >

          <SpacerView
            style={[utility.blueBackground]}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='100%'
            width='50%'
          >
              <Image source={logo}></Image>

              <SpacerView height='5%' />

              <ThemedText lightColor='#FFF' darkColor='#FFF' type="display" >L I S T O</ThemedText>

          </SpacerView>
          
          <SpacerView
            style={[utility.blueBackground]}
            flexDirection='column'
            justifyContent='center'
            height='75%'
            width='50%'
          >
              <SpacerView
              height='75%'
              width='75%'
              style={[utility.whiteBackground]}
              borderRadius={20}
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              >
                <ThemedText lightColor='#115272' darkColor='#115272' type="display">Log In</ThemedText>
                <SpacerView height='10%' />
                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='Email' />
                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='********' secureTextEntry />
                <ThemedText lightColor='#115272' darkColor='#115272' type="body" textAlign='left'>Forgot Password?</ThemedText>
                <SpacerView height='5%' />
                  <ThemedButton width='25%' title="Login" onPress={() =>
                    {router.replace({
                      pathname: "/register",
                    })}} />
                <SpacerView height={55} marginTop={20}>
                    <ThemedText lightColor='#115272' darkColor='#115272' type="body" >Don't have an account? </ThemedText>
                </SpacerView>
              </SpacerView>

          </SpacerView>
  
      </SpacerView>
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
    borderTopWidth: 3,
    borderTopColor: "#FFF",
  }
})