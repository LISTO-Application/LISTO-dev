//REACT IMPORTS
import {Image, Platform, KeyboardAvoidingView, ScrollView, StyleSheet, View, ImageSourcePropType, Pressable, TouchableOpacity, Linking, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useMemo, useCallback, useRef, useState,} from 'react';

//EXPO IMPORTS
import {router, useFocusEffect} from 'expo-router';

//STYLESHEET IMPORTS
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';

//COMPONENT IMPORTS
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

//PORTAL IMPORTS
import { Portal } from '@gorhom/portal';

//BOTTOM SHEET IMPORT
import BottomSheet, { BottomSheetScrollView, BottomSheetView, } from "@gorhom/bottom-sheet";

//IMAGE IMPORTS
const qcLogo = require('../../assets/images/qc-logo.png');
const holyspiritLogo = require('../../assets/images/holyspirit-logo.png');
const balaraLogo = require('../../assets/images/balara-logo.png')
const backArrow = require('../../assets/images/back-button-white.png');
const hotline = require('../../assets/images/hotline-icon.png');

export default function Emergency() {

  //REPORT TO SETTINGS
  const reportTo = [
    { id: 1, name: 'Holy Spirit'},
    { id: 2, name: 'Matandang Balara'},
  ]

  const [reportToStates, setReportToStates] = useState(
    reportTo.map(() => false)
  );

  const handleReportToPress = (index: number) => {
    setReportToStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  //EMERGENCY TYPE SETTINGS

  const emergencyType = [
    { id: 1, name: 'Violent Crime'},
    { id: 2, name: 'Active Fire'},
    { id: 3, name: 'Serious Injury'},
  ]

  const [emergencyTypeStates, setEmergencyTypeStates] = useState(
    emergencyType.map(() => false)
  );

  const handleEmergencyTypePress = (index: number) => {
    setEmergencyTypeStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

    //BOTTOM SHEET SETTINGS
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%"], []);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    //BOTTOM SHEET CONTACTS
    const barangays = [
      { id: 1, name: 'QC Hotline', icon: qcLogo as ImageSourcePropType, phone: '09123456789'},
      { id: 2, name: 'Holy Spirit', icon: holyspiritLogo as ImageSourcePropType, phone: '09123456789'},
      { id: 3, name: 'Old Balara', icon: balaraLogo as ImageSourcePropType, phone: '09123456789'},
    ];


    // BOTTOM SHEET CALLBACKS
    const handleSheetChange = useCallback((index: any) => {
      setIsBottomSheetOpen(index !== -1);
    }, []);

    const handleSnapPress = useCallback((index: number) => {
      sheetRef.current?.snapToIndex(index);
    }, []);

    const handleClosePress = useCallback(() => {
      sheetRef.current?.close();
    }, []);

    useFocusEffect(
      useCallback(() => {
        return () => sheetRef.current?.close()
      }, [])
    );
  
  if(Platform.OS === 'android') {
    return (
    
      <GestureHandlerRootView>
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.mainContainer, utility.redBackground]}
        showsVerticalScrollIndicator = {false}
        keyboardShouldPersistTaps = "handled"
        >
            <TouchableOpacity onPress={() => {
                      router.replace({
                        pathname: "/",
                      })}}>
                <Image 
                style = {{
                  width: 40, 
                  height: 40,
                  position: 'absolute',
                  top: 40,
                  left: 20
                }} 
                source={backArrow} />
            </TouchableOpacity>

            <SpacerView height={100} />
            <KeyboardAvoidingView
              behavior='height'
              keyboardVerticalOffset={0}
              style={[styles.container, utility.redBackground]}
            >
        
                <ThemedText lightColor='#FFF' darkColor='#FFF' type="subDisplay" >Send a distress message</ThemedText>
                <ThemedText style = {{marginBottom: '2.5%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle">Send to</ThemedText>
        
                <SpacerView height = "5%" marginBottom = '5%'>
                    <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    contentContainerStyle = {{paddingHorizontal: '2.5%'}}
                    >   

                        {/* REPORT TO CATEGORIES */}
                        {reportTo.map((report, index) => (
                        
                        <Pressable key={report.id} style = {[style.scrollViewItem, reportToStates[index] && {backgroundColor: "#FFF", borderColor: '#FFF'}, !reportToStates[index] && {borderColor: '#FFF'}]} onPress={() => {handleReportToPress(index)}}>
                            <Text style = {[style.scrollViewText, reportToStates[index] && {color: "#DA4B46"}, !reportToStates[index] && {color: '#FFF'}]}> {report.name} </Text>
                        </Pressable>
                          ))}

                    </ScrollView>
                </SpacerView>



                <ThemedText style = {{marginBottom: '2.5%'}} lightColor='#FFF' darkColor='#FFF' type="subtitle">Emergency Type</ThemedText>
                <SpacerView height = "5%" marginBottom = '5%'>
                    <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    contentContainerStyle = {{paddingHorizontal: '2.5%'}}>   

                        {/* EMERGENCY CATEGORIES */}
                        {emergencyType.map((emergency, index) => (
                        
                        <Pressable key={emergency.id} style = {[style.scrollViewItem, emergencyTypeStates[index] && {backgroundColor: "#FFF", borderColor: '#FFF'}, !emergencyTypeStates[index] && {borderColor: '#FFF'}]} onPress={() => {handleEmergencyTypePress(index)}}>
                            <Text style = {[style.scrollViewText, emergencyTypeStates[index] && {color: "#DA4B46"}, !emergencyTypeStates[index] && {color: '#FFF'}]}> {emergency.name} </Text>
                        </Pressable>
                          ))}

                    </ScrollView>
                </SpacerView>
                
                <ThemedText lightColor='#FFF' darkColor='#FFF' type="subtitle" >Additional Information</ThemedText>
                <ThemedInput marginTop = {10} borderRadius = {15} height = {100} placeholder='Additional Information' textAlign = "left" textAlignVertical = "top" placeholderTextColor = '#EDA5A3'/>
                <SpacerView height={20} />
                <SpacerView width='100%' flexDirection='column' justifyContent = "space-evenly" alignItems = 'center' height = 'auto'>
                    <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#FFF', paddingVertical: '2.5%', borderRadius: 50, justifyContent: 'center'}} onPress={() =>
                    {router.replace({
                      pathname: "/",
                    })}} >
                        <ThemedText style = {{width: "100%", textAlign: 'center'}} lightColor='#DA4B46' darkColor='#DA4B46' type="subtitle" >Submit</ThemedText>
                    </TouchableOpacity>

                </SpacerView>

            </KeyboardAvoidingView>
        </ScrollView>

              <TouchableOpacity
                    style = {[{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                    }, isBottomSheetOpen && {display: 'none'}]} 
                    onPress={() => handleSnapPress(0)}
                    >
                      <Image style = {{
                      width: 50,
                      height: 50,
                      }}
                      source={hotline}/>
                </TouchableOpacity>

        <Portal>
            <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} onChange={handleSheetChange} backgroundStyle={{backgroundColor: '#115272'}} handleIndicatorStyle={{backgroundColor: '#FFF', width: '40%'}} enablePanDownToClose={true}>
                    <View style = {{ width: "100%", height: "100%",}}>
                            <BottomSheetScrollView contentContainerStyle = {{justifyContent: 'center', alignItems: "center", padding: '2.5%'}} horizontal = {true}>

                            {/* CRIME CATEGORIES */}
                            {barangays.map((category, index) => (
                                
                                            <View key={category.id} style={style.bottomSheetItem}>
                                                <TouchableOpacity style={[style.bottomSheetImageContainer]} onPress={() => {Linking.openURL(`tel:${category.phone}`)}}>
                                                        <Image style={style.bottomSheetImage} source={category.icon} />
                                                </TouchableOpacity>
                                                <ThemedText style={style.bottomSheetItemTitle} lightColor='#FFF' darkColor='#FFF' type='subtitle'>
                                                    {category.name}
                                                </ThemedText>
                                            </View>
                            ))}

                            </BottomSheetScrollView>
                    </View>
            </BottomSheet>
        </Portal>
      </GestureHandlerRootView>
    );
  }
  else if (Platform.OS === 'web') {
    return (
    
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.mainContainer, utility.redBackground]}
        showsVerticalScrollIndicator = {false}
        keyboardShouldPersistTaps = "handled"
        >
            <SpacerView
              backgroundColor='#DA4B46'
              flex={1}
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              marginBottom = "5%"
            >
        
                <SpacerView height = 'auto' width='40%' justifyContent='center' marginTop='2.5%' marginBottom='2.5%'>
                  <ThemedText lightColor='#FFF' darkColor='#FFF' type="display" textAlign='center'>Send a distress message</ThemedText>
                </SpacerView>

                  
                    <SpacerView justifyContent='flex-start' width = '50%' height='auto' marginBottom = '1%'>
                      <ThemedText style = {{marginBottom: '2.5%'}} lightColor='#FFF' darkColor='#FFF' type="title">Send to</ThemedText>
                    </SpacerView>
                    
                    <SpacerView
                    width='50%'
                    height='auto'
                    justifyContent='space-between'
                    marginBottom = "5%"
                    >
                        <ThemedButton title='Batasan Hills' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                            {router.replace({
                              pathname: "/",
                            })}} />
                        <ThemedButton title='Holy Spirit' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                            {router.replace({
                              pathname: "/",
                            })}} />
                        <ThemedButton title='Matandang Balara' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                            {router.replace({
                              pathname: "/",
                            })}} />
                    </SpacerView>
                
                <SpacerView justifyContent='flex-start' width = '50%' height='auto' marginBottom = "1%">
                    <ThemedText style = {{marginBottom: '2.5%'}} lightColor='#FFF' darkColor='#FFF' type="title">Emergency Type</ThemedText>
                </SpacerView>

                    <SpacerView
                    width='50%'
                    height='auto'
                    justifyContent='space-between'
                    marginBottom = "5%" 
                    >
                            <ThemedButton title='Violent Crime' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                                {router.replace({
                                  pathname: "/",
                                })}} />
                            <ThemedButton title='Active Fire' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                                {router.replace({
                                  pathname: "/",
                                })}} />
                            <ThemedButton title='Serious Injury' width = "auto" height = '100%' paddingHorizontal = '5%' paddingVertical = '0.5%' type = "white-outline" onPress={() =>
                                {router.replace({
                                  pathname: "/",
                                })}} />
                    </SpacerView>

                <SpacerView height = "auto" flexDirection='column' width='50%'>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="title" >Additional Information</ThemedText>
                    <ThemedInput width = "100%" height = {150} borderRadius = {15} placeholder='Additional Information' textAlign = "left" textAlignVertical = "top" placeholderTextColor = '#EDA5A3'/>
                </SpacerView>
                
                <SpacerView width = '25%' height='auto' justifyContent = "center" flexDirection = "column">
                  <ThemedButton title="Submit" width = "auto" height = "auto" paddingVertical = '2.5%' type = "blue" onPress={() =>
                    {router.replace({
                      pathname: "/",
                    })}} />
                    <SpacerView height = "5%" />
                  <ThemedButton title="Submit" width = "auto" height = "auto" paddingVertical = '2.5%' type = "blue" onPress={() =>
                    {router.replace({
                      pathname: "/(tabs)",
                    })}} />
                </SpacerView>
            </SpacerView>
        </ScrollView>
    );
  }
  
}

const style = StyleSheet.create({

  //GENERAL STYLES
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },

  //DISTRESS MESSAGE STYLES
  scrollViewItem: {
    width: 'auto',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginHorizontal: 5,
    borderWidth: 3,
    borderRadius: 50,
  },
  scrollViewText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  //BOTTOM SHEET STYLES
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
  }, 
  bottomSheetItem: {
    width: 100,
    height: '100%',
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  bottomSheetImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "#FFF",
  },
  bottomSheetImage: {
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  bottomSheetItemTitle: {
    width: "100%",
    height: "25%",
    textAlign: "center",
    verticalAlign: "middle",
  }

});