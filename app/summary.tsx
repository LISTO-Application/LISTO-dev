//React Imports
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {Image, Platform, ScrollView, ImageBackground, Pressable, TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import  { AnimatedCircularProgress} from 'react-native-circular-progress';
import { BarChart } from "react-native-gifted-charts";

//Expo Imports
import {router} from 'expo-router';

//Firebase Imports
import firestore from '@react-native-firebase/firestore';

//Date-FNS Imports
import { toDate, isToday, isThisWeek, isThisMonth } from "date-fns";

//Function Imports
import { toFullDate } from '@/functions/toFullDate';

//Stylesheet Imports
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';

//Component Imports
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';

  //Image Imports
  const texture = require('../assets/images/texture.png');
  const user = require('../assets/images/user-icon.png');
  const backArrow = require('../assets/images/back-button-white.png');
  
export default function UserAccount() {

  //Incident Object Interface
  interface Incident {
    id: string;
    [key: string]: any;
  }

  //Time Range Constants
  const timeRange = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Week'},
    { id: 3, name: 'Month',},
    { id: 4, name: 'Custom'},
  ];

  //Circular Progress Constants
  const circularProgressSize = 150;

  //Firestore Collection Constants
  const incidentCollection = firestore().collection('incidents');

  //State for managing which time range is selected (blue background)
  const [timeRangeState, setTimeRangeState] = useState(1)

  //State and array of incidents with their details
  const [incidents, setIncidents] = useState<Incident[]>([]);

  //State and array of incidents and their counts
  const [homicideIncidents, setHomicideIncidentCount] = useState(0)
  const [injuryIncidents, setInjuryIncidentCount] = useState(0)
  const [theftIncidents, setTheftIncidentCount] = useState(0)
  const [robberyIncidents, setRobberyIncidentCount] = useState(0)
  const [kidnappingIncidents, setKidnappingIncidentCount] = useState(0)
  const [carnappingIncidents, setCarnappingIncidentCount] = useState(0)
  const [rapeIncidents, setRapeIncidentCount] = useState(0)

  //State for managing loading state
  const [loading, setLoading] = useState(true);

  const handleTimeRangePress = useCallback((index: number) => {
    setTimeRangeState(index);
  }, [timeRangeState]);

  const timeRangeIndex = useRef(1);

  //Fetch Data from Database, set incidents array and bar data array for use in the Bar Chart
  const handleDataChange = async () => {
    setLoading(true);
    const querySnapshot = await incidentCollection.get();
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setIncidents(data);
    setBarData(data, timeRangeIndex.current);
  };

    //Error Handling Function
    const fetchError =  (error : any) => {console.log(error);}

    //Attaches a Listener to the Incident Collection and cleans up when the component is unmounted
    useEffect(() => {
      const unsubscribe = incidentCollection.onSnapshot(handleDataChange, fetchError);
      return () => unsubscribe();
    }, [timeRangeIndex.current]);

  const setBarData = useCallback ((incidents : any, chosenDateRange: number) => {

    setLoading(true);

    // Initialize counters
    let homicideCount = 0;
    let injuryCount = 0;
    let theftCount = 0;
    let robberyCount = 0;
    let kidnappingCount = 0;
    let carnappingCount = 0;
    let rapeCount = 0;

    // Iterate through incidents once
    incidents.map((incident: any) => {
      if (incident.date) {
        const incidentDate = toDate(incident.date.toDate());
        if (chosenDateRange === 1) {
          if (isToday(incidentDate)) {
            switch (incident.type) {
              case 'Homicide':
                homicideCount++;
                break;
              case 'Injury':
                injuryCount++;
                break;
              case 'Theft':
                theftCount++;
                break;
              case 'Robbery':
                robberyCount++;
                break;
              case 'Kidnapping':
                kidnappingCount++;
                break;
              case 'Carnapping':
                carnappingCount++;
                break;
              case 'Rape':
                rapeCount++;
                break;
              default:
                break;
            }
          }
        } else if (chosenDateRange === 2) {
          if (isThisWeek(incidentDate)) {
            switch (incident.type) {
              case 'Homicide':
                homicideCount++;
                break;
              case 'Injury':
                injuryCount++;
                break;
              case 'Theft':
                theftCount++;
                break;
              case 'Robbery':
                robberyCount++;
                break;
              case 'Kidnapping':
                kidnappingCount++;
                break;
              case 'Carnapping':
                carnappingCount++;
                break;
              case 'Rape':
                rapeCount++;
                break;
              default:
                break;
            }
          }
        } else if (chosenDateRange === 3) {
          if (isThisMonth(incidentDate)) {
            switch (incident.type) {
              case 'Homicide':
                homicideCount++;
                break;
              case 'Injury':
                injuryCount++;
                break;
              case 'Theft':
                theftCount++;
                break;
              case 'Robbery':
                robberyCount++;
                break;
              case 'Kidnapping':
                kidnappingCount++;
                break;
              case 'Carnapping':
                carnappingCount++;
                break;
              case 'Rape':
                rapeCount++;
                break;
              default:
                break;
            }
          }
        } else if (chosenDateRange === 4) {
          // Handle 'Custom' case
        }
      }
    });

    // Set counts
    setHomicideIncidentCount(homicideCount);
    setInjuryIncidentCount(injuryCount);
    setTheftIncidentCount(theftCount);
    setRobberyIncidentCount(robberyCount);
    setKidnappingIncidentCount(kidnappingCount);
    setCarnappingIncidentCount(carnappingCount);
    setRapeIncidentCount(rapeCount);
    setLoading(false);
  },[incidents, timeRangeState]);


  //Bar data variables that updates when the incident collection changes
  const barData = 
    [{ value: homicideIncidents, label: 'Homicide', labelTextStyle: { color: '#F07E7F', fontWeight: 'bold' }, frontColor: '#115272' },
    { value: injuryIncidents, label: 'Injury', labelTextStyle: { color: '#B07731', fontWeight: 'bold' }, frontColor: '#DA4B46' },
    { value: theftIncidents, label: 'Theft', labelTextStyle: { color: '#878B00', fontWeight: 'bold' }, frontColor: '#FECF1A' },
    { value: robberyIncidents, label: 'Robbery', labelTextStyle: { color: '#35AE46', fontWeight: 'bold' }, frontColor: '#115272' },
    { value: kidnappingIncidents, label: 'Kidnapping', labelTextStyle: { color: '#002D9F', fontWeight: 'bold' }, frontColor: '#DA4B46' },
    { value: carnappingIncidents, label: 'Carnapping', labelTextStyle: { color: '#470088', fontWeight: 'bold' }, frontColor: '#FECF1A' },
    { value: rapeIncidents, label: 'Rape', labelTextStyle: { color: '#850456', fontWeight: 'bold' }, frontColor: '#115272' }]

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
                  onPress={() => {
                    handleTimeRangePress(index + 1);
                    timeRangeIndex.current = timeRange.id;
                    setBarData(incidents, timeRangeIndex.current);
                    }}>
                    <Text style = {[{width: '100%', height: 'auto', paddingVertical: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center'}, !(timeRangeIndex.current == timeRange.id) && {color: '#115272', backgroundColor: '#FFF'}, timeRangeIndex.current == timeRange.id && {color: '#FFF', backgroundColor: '#115272'}, timeRange.id === 1 && {borderTopLeftRadius: 50, borderBottomLeftRadius: 50}, timeRange.id === 4 && {borderTopRightRadius: 50, borderBottomRightRadius: 50}]}>{timeRange.name}</Text>
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
                fill={incidents.length}
                arcSweepAngle={220}
                rotation={250}
                tintColor='#DA4B46'
                lineCap='round'
                backgroundColor="#115272"
                padding= {10}
                duration={5}>
                {
                  (fill: number) => (
                    <Text style = {[{fontSize: 48, fontWeight:'900', color: '#115272'}, loading && {opacity: 0}]}>
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
                  padding= {10}
                  duration={5}
                  >
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
              { loading && <ActivityIndicator style = {{paddingVertical: '25%'}} color='#115272' size={'large'}/>}
              { !loading && <BarChart data={barData} initialSpacing={30} barWidth={17.5} barBorderTopLeftRadius={5} barBorderTopRightRadius={5} animationDuration={200} isAnimated/>}
              
            </View>

            <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#DA4B46', paddingVertical: '1.5%', borderRadius: 50, justifyContent: 'center'}} 
            onPress={() =>
              {
                router.replace({
                pathname: "/",
              });}} >
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
