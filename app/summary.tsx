//React Imports
import { useState, useCallback } from 'react';
import {Image, Platform, ScrollView, ImageBackground, Pressable, TouchableOpacity, View, Text} from 'react-native';
import { useRoute } from '@react-navigation/native';
import  { AnimatedCircularProgress, CircularProgress } from 'react-native-circular-progress';
import { BarChart } from "react-native-gifted-charts";

//Expo Imports
import { useLocalSearchParams } from 'expo-router';
import {router} from 'expo-router';

//Stylesheet Imports
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';

//Component Imports
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedImageBackground } from '@/components/ThemedImageBackground';

export default function UserAccount() {
  const texture = require('../assets/images/texture.png');
  const user = require('../assets/images/user-icon.png');
  const backArrow = require('../assets/images/back-button-white.png');

  const circularProgressSize = 150;

  const barData = [
    {value: 15, label: 'Homicide', labelTextStyle: {color: '#F07E7F', fontWeight: 'bold'}, frontColor: '#115272'}, 
    {value: 30, label: 'Injury', labelTextStyle: {color: '#B07731', fontWeight: 'bold'}, frontColor: '#DA4B46'}, 
    {value: 26, label: 'Theft', labelTextStyle: {color: '#878B00', fontWeight: 'bold'}, frontColor: '#FECF1A'}, 
    {value: 40, label: 'Robbery', labelTextStyle: {color: '#35AE46', fontWeight: 'bold'}, frontColor: '#115272'}, 
    {value: 15, label: 'Kidnapping', labelTextStyle: {color: '#002D9F', fontWeight: 'bold'}, frontColor: '#DA4B46'}, 
    {value: 30, label: 'Carnapping', labelTextStyle: {color: '#470088', fontWeight: 'bold'}, frontColor: '#FECF1A'}, 
    {value: 26, label: 'Rape', labelTextStyle: {color: '#850456', fontWeight: 'bold'}, frontColor: '#115272'}, ];
  const barGraphSize = 200;

  const timeRange = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Week'},
    { id: 3, name: 'Month',},
    { id: 4, name: 'Custom'},
  ];

  const [timeRangeStates, setTimeRangeStates] = useState(
    timeRange.map((_, index) => index === 0)
  );

  const handleTimeRangeyPress = useCallback((index: number) => {
    setTimeRangeStates((prevStates) =>
      prevStates.map((_, i) => i === index)
    );
  }, []);

  if(Platform.OS === 'android') {
    return (
    
      <ThemedView
      style={[styles.mainContainer]}
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

          <ScrollView style = {{backgroundColor: '#DADADA'}} contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}}>
  
            <ImageBackground
            source = {texture}
            style={[{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingVertical: 25}]}>

                <ThemedText style = {{marginVertical: 12}} lightColor='#FFF' darkColor='#FFF' type="subtitle"> Incident Statistics </ThemedText>

                <View style = {{width: '75%', height: 'auto', flexDirection: 'row', borderRadius: 50}}>

                  {timeRange.map((timeRange, index) => (
                  <TouchableOpacity
                  style = {[{flex:1, justifyContent: 'center', alignItems: 'center',}, timeRange.id === 1 && {borderTopLeftRadius: 50, borderBottomLeftRadius: 50}, timeRange.id === 4 && {borderTopRightRadius: 50, borderBottomRightRadius: 50}]}
                  key={timeRange.id}
                  onPress={() => {handleTimeRangeyPress(index)}}>
                    <Text style = {[{width: '100%', height: 'auto', paddingVertical: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center'}, !timeRangeStates[index] && {color: '#115272', backgroundColor: '#FFF'}, timeRangeStates[index] && {color: '#FFF', backgroundColor: '#115272'}, timeRange.id === 1 && {borderTopLeftRadius: 50, borderBottomLeftRadius: 50}, timeRange.id === 4 && {borderTopRightRadius: 50, borderBottomRightRadius: 50}]}>{timeRange.name}</Text>
                  </TouchableOpacity>
                  ))}
                    
                </View>
            </ImageBackground>
  
            <View style = {{width: '85%', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, marginVertical: '5%'}}>
              
              <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
                <AnimatedCircularProgress
                style = {{height: circularProgressSize * .75}}
                size={circularProgressSize}
                width={20}
                fill={69}
                arcSweepAngle={220}
                rotation={250}
                tintColor='#DA4B46'
                lineCap='round'
                backgroundColor="#115272"
                padding= {10}>
                {
                  (fill: number) => (
                    <Text style = {{fontSize: 48, fontWeight:'900', color: '#115272'}}>
                      {fill}
                    </Text>
                  )
                }
                </AnimatedCircularProgress>
                <Text style = {{width: '100%', fontSize: 28, fontWeight:'bold', textAlign: 'center', color: '#115272'}}>Crimes</Text>
              </View>

              <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <AnimatedCircularProgress
                  style = {{height: circularProgressSize * .75}}
                  size={circularProgressSize}
                  width={20}
                  fill={24}
                  arcSweepAngle={220}
                  rotation={250}
                  tintColor='#DA4B46'
                  lineCap='round'
                  backgroundColor="#115272"
                  padding= {10}>
                  {
                    (fill: number) => (
                      <Text style = {{fontSize: 48, fontWeight:'900', color: '#115272'}}>
                        {fill}
                      </Text>
                    )
                  }
                  </AnimatedCircularProgress>
                  <Text style = {{width: '100%', fontSize: 28, fontWeight:'bold', textAlign: 'center', color: '#115272'}}>Reports</Text>

              </View>
              
            </View>
      

            <View style = {{width: '85%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFF', marginVertical:'5%', paddingVertical: 25, borderRadius: 20,}}>
              
                <BarChart data={barData} initialSpacing={30} maxValue={50} barWidth={17.5} barBorderTopLeftRadius={5} barBorderTopRightRadius={5} isAnimated/>
              
            </View>

            <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#DA4B46', paddingVertical: '1.5%', borderRadius: 50, justifyContent: 'center'}} onPress={() =>
              {}} >
                  <ThemedText style = {{width: "100%", textAlign: 'center'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Generate Reports</ThemedText>
            </TouchableOpacity>
  
          </ScrollView>
  
      </ThemedView>
    );
  }
  else if (Platform.OS === 'web') {
    return (
    
      <ThemedView
      style={[styles.mainContainer, utility.blueBackground]}
      >
          <ScrollView
          contentContainerStyle={{ flexGrow: 1 }} >
            
            {/* MAIN CONTAINER */}
            <SpacerView
            flex={1}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'>

                {/* MIDDLE COLUMN */}
                <SpacerView
                flex={1}
                height="100%"
                width="75%"
                flexDirection='column'
                justifyContent='space-evenly'>

                    <SpacerView
                    backgroundColor = "#FFF"
                    justifyContent='center'
                    alignItems='center'
                    flexDirection='column'
                    width='100%'
                    borderRadius={20}
                    height='auto'
                    paddingTop='2%'
                    paddingBottom='2%'>
                        <Image source={user}/>
                        <ThemedText lightColor='#115272' darkColor='#115272' type="title" paddingVertical = {2}> John Doe </ThemedText>
                    </SpacerView>
                
                    <SpacerView
                    height='auto'
                    justifyContent='space-between'>
                    
                        <SpacerView
                        backgroundColor='#FFF'
                        height="auto"
                        width='45%'
                        flexDirection='column'
                        justifyContent='center'
                        paddingLeft='2%'
                        paddingRight='2%'
                        paddingTop='1%'
                        paddingBottom='1%'
                        borderRadius={20}
                        >
                          
                            <SpacerView
                            borderBottomWidth={5}
                            borderBottomColor='#115272'
                            height='auto'
                            marginTop='5%'
                            marginBottom = '5%'
                            >
                                <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle">Personal Information</ThemedText>

                            </SpacerView>

                            <SpacerView
                            flex={1}
                            justifyContent='space-between'
                            height='auto'
                            >

                                <SpacerView
                                height='auto'
                                width="45%"
                                flexDirection='column'
                                >
                                    <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle"> First Name </ThemedText>
                                    <ThemedInput borderRadius = {5} backgroundColor='#FFF' type='blueOutline' placeholderTextColor = "#115272" placeholder="John Doe"/>
                                </SpacerView>

                                <SpacerView
                                height='auto'
                                width="45%"
                                flexDirection='column'>
                                    <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle" paddingVertical = {2}> Last Name </ThemedText>
                                    <ThemedInput borderRadius = {5} backgroundColor='#FFF' type='blueOutline' marginVertical='2.5%' placeholderTextColor = "#115272" placeholder="John Doe" />
                                </SpacerView>

                            </SpacerView>

                            <SpacerView
                            flexDirection='column'
                            height='auto'
                            >
                              <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle"> Email </ThemedText>
                              <ThemedInput width='45%' borderRadius = {5} backgroundColor='#FFF' type='blueOutline' marginVertical='2.5%' placeholderTextColor = "#115272" placeholder='@gmail.com' />
                              
                              <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle"> Phone Number </ThemedText>
                              <ThemedInput width='45%' borderRadius = {5} backgroundColor='#FFF' type='blueOutline' marginVertical='2.5%' placeholderTextColor = "#115272" placeholder='+63' />
                            </SpacerView>

                            <SpacerView
 
                            justifyContent='center'
                            alignItems='flex-end'
                            height='auto'
                            marginTop='5%'
                            >

                                <ThemedButton width='35%' title="Login" onPress={() =>
                                  {router.replace({
                                    pathname: "/emergency",
                                  })}} />

                            </SpacerView>

                        </SpacerView>

                        <SpacerView
                        backgroundColor='#FFF'
                        height="50%"
                        width='45%'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'>

                            <SpacerView
                            borderBottomWidth={5}
                            borderBottomColor='#115272'
                            height='auto'
                            marginTop='5%'
                            marginBottom = '5%'
                            width='90%'
                            >
                                <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle">Account Settings</ThemedText>

                            </SpacerView>

                            <SpacerView
                            flex={1}
                            flexDirection='column'
                            justifyContent='space-evenly'
                            alignItems='center'
                            height='auto'
                            width='100%'
                            >

                            <ThemedButton width='35%' title="Delete Account" onPress={() =>
                                  {router.replace({
                                    pathname: "/emergency",
                                  })}} />  

                            <ThemedButton width='35%' title="Logout" onPress={() =>
                                  {router.replace({
                                    pathname: "/emergency",
                                  })}} />  

                            </SpacerView>

                        </SpacerView>

                    </SpacerView>

                </SpacerView>

            </SpacerView>
  
          </ScrollView>
  
      </ThemedView>
    );
  }

}
