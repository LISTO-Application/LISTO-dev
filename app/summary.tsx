//React Imports
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {Image, Platform, ScrollView, ImageBackground, Pressable, TouchableOpacity, View, Text, ActivityIndicator, PermissionsAndroid} from 'react-native';
import  { AnimatedCircularProgress} from 'react-native-circular-progress';
import { BarChart } from "react-native-gifted-charts";

//Expo Imports
import {router} from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from "expo-file-system"

//Firebase Imports
import { firebase } from '@react-native-firebase/firestore';

//Date-FNS Imports
import { toDate, isToday, isThisWeek, isThisMonth, compareDesc, set} from "date-fns";

//XLSX Imports
import xlsx from 'xlsx';

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
  
export default function Summary() {

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
  const crimesCollection = firebase.firestore().collection("crimes");
  const reportsCollection = firebase.firestore().collection("reprots");

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
    console.log("WTF");
    setLoading(true);
    crimesCollection
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIncidents(data);
        setBarData(data, timeRangeIndex.current);
        setLoading(false);
      })
  };

    //Error Handling Function
    const fetchError =  (error : any) => {console.log(error);}

    //Attaches a Listener to the Incident Collection and cleans up when the component is unmounted
    useEffect(() => {
      console.log("Incident Collection Listener Attached");
      const unsubscribe = crimesCollection.onSnapshot(handleDataChange, fetchError);
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


  const saveData = async (file: string, filename: string, mimeType: any) => {
    try {
      //Calls the File Picker and requests for directory permissions
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await file;
        const uri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimeType);
        console.log('File created at:', uri);
        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        console.log('File written successfully');
        } else {
          const localUri = FileSystem.documentDirectory + filename;
          await FileSystem.writeAsStringAsync(localUri, file, {
            encoding: FileSystem.EncodingType.Base64
          });
          await Sharing.shareAsync(localUri);
        }

      } catch (e) {
        console.error('Error saving file:', e);
        const localUri = FileSystem.documentDirectory + filename;
        await FileSystem.writeAsStringAsync(localUri, file, {
          encoding: FileSystem.EncodingType.Base64
        });
        await Sharing.shareAsync(localUri);
    }
  };

  const exportData = () => {
    try {
      // Fetches incidents array
      let rawIncidents = incidents;
      // Convert timestamp dates to date object
      let processedIncidents = rawIncidents.map((incident) => {
        return {
          type: incident.type,
          date: toDate(incident.date.toDate()),
          longitude: incident.coordinates.longitude,
          latitude: incident.coordinates.latitude
        };
      });
      // Sorts date from most recent to least
      let sortedIncidents = processedIncidents.sort((a, b) => compareDesc(a.date, b.date));
      // Convert JSON objects to sheet
      const worksheet = xlsx.utils.json_to_sheet(sortedIncidents);
      // Create a new workbook
      const workbook = xlsx.utils.book_new();
      // Configure width to be 10 char
      const max_width = sortedIncidents.reduce((w, r) => Math.max(w, r.date.length), 10);
      worksheet["!cols"] = [{ wch: max_width }];
      // Append sheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Incidents');
      // Configure worksheet headers
      xlsx.utils.sheet_add_aoa(worksheet, [["Type", "Date", "Latitude", "Longitude"]], { origin: "A1" });
      // Convert worksheet into base64 string
      const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'base64' });
      saveData(wbout, "Incidents", 'xlsx');
    } catch (e) {
      console.error('Error exporting data:', e);
    }
  };


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
            onPress={ async () =>
              {
                try{
                  // Check for Permission (check if permission is already given or not)
                  let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                  if (!isPermitedExternalStorage) {

                    // Ask for permission
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: "Storage permission needed",
                            message: "This app needs access to your storage to save the report.",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                        }
                    );
    
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // Permission Granted (calling our writeDataAndDownloadExcelFile function)
                        exportData();
                        console.log("Permission granted");
                    } else {
                        // Permission denied
                        console.log("Permission denied");
                    }
                } else {
                    // Already have Permission (calling our writeDataAndDownloadExcelFile function)
                    exportData();
                }
                } catch (e) {
                  console.log("Error checking permisison");
                  console.log(e);
                }
                {/*router.replace({
                pathname: "/",
              });}*/}
              } }>
                  <ThemedText style = {{width: "100%", textAlign: 'center'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Generate Reports</ThemedText>
            </TouchableOpacity>
  
          </ScrollView>
  
      </ThemedView>
    );
  }

}