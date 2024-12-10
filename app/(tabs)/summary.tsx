//React Imports
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {Image, Platform, ScrollView, ImageBackground, Pressable, TouchableOpacity, View, Text, ActivityIndicator, PermissionsAndroid} from 'react-native';
import  { AnimatedCircularProgress} from 'react-native-circular-progress';
import { BarChart } from "react-native-gifted-charts";
import { Calendar } from 'react-native-calendars';

//Expo Imports
import {router} from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from "expo-file-system"

//Firebase Imports
import firestore, { Timestamp } from '@react-native-firebase/firestore';

//Date-FNS Imports
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
import { toDate, isToday, isThisWeek, isThisMonth, compareDesc, set, formatDate, subYears, isThisYear, isAfter, isBefore, getTime} from "date-fns";
=======
import { toDate, isToday, isThisWeek, isThisMonth, compareDesc, set, startOfDay, getUnixTime, endOfDay, getTime, startOfMonth, endOfMonth, startOfWeek, endOfWeek, formatDate, isThisYear, isAfter, isBefore, subYears, parse} from "date-fns";
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx

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

// Hooks
import useResponsive from '@/hooks/useResponsive';

  //Image Imports
  const texture = require('../../assets/images/texture.png');
  const user = require('../../assets/images/user-icon.png');
  const backArrow = require('../../assets/images/back-button-white.png');
  
export default function Summary() {

  const { display, subDisplay, title, subtitle, body, small, tiny, height} = useResponsive();

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

<<<<<<< Updated upstream:app/(tabs)/summary.tsx
=======
  interface DateRange {
    start: Date | null;
    end: Date | null;
  }

  const calendarSheetRef = useRef<BottomSheet>(null);
  const [current, setCurrent] = useState(Timestamp.now().toDate());
  const [isCalendarSheetOpen, setIsCalendarSheetOpen] = useState(false);
  const initialDate = {timestamp: Timestamp.now().toMillis(), date: Timestamp.now().toDate()}
  const minDate = formatDate(subYears(initialDate.date, 4), "yyyy-MM-dd");
  const maxDate = formatDate(initialDate.date, "yyyy-MM-dd");
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { selected: boolean; selectedColor: string };
  }>({});
  const [selectedDate, setSelectedDate] = useState<DateRange>({start: null, end: null});

  const handleCalendarSheetChange = useCallback((index: any) => {
    setIsCalendarSheetOpen(index !== -1);
  }, []);
  const handleCalendarSnapPress = useCallback((index: number) => {
    calendarSheetRef.current?.snapToIndex(index);
  }, []);
  const handleCalendarClosePress = useCallback(() => {
    calendarSheetRef.current?.close();
  }, []);
  const calendarSnapPoints = useMemo(() => ["70%"], []);

  const load = useDynamicAnimation(() => {
    return {
      opacity: 1,
    }
  });

  
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
  //Circular Progress Constants
  const circularProgressSize = 125;

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

  //Calendar States & Constants
  const initialDate = {timestamp: Timestamp.now().toMillis(), date: Timestamp.now().toDate()};
  const [current, setCurrent] = useState(initialDate.date);
  const minDate = formatDate(subYears(initialDate.date, 4), "yyyy-MM-dd");
  const maxDate = formatDate(initialDate.date, "yyyy-MM-dd");
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { selected: boolean; selectedColor: string };
  }>({});
  const [dateMode, setDateMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(formatDate(initialDate.date, "yyyy-MM-dd").toString());
  
  //State for managing loading state
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
  const [loading, setLoading] = useState(true);
=======
  const [loading, setLoading] = useState(false);
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx

  const handleTimeRangePress = useCallback((index: number) => {
    setTimeRangeState(index);
  }, [timeRangeState]);


  const timeRangeIndex = useRef(1);

<<<<<<< Updated upstream:app/(tabs)/summary.tsx
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

=======
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
    //Attaches a Listener to the Incident Collection and cleans up when the component is unmounted
    useEffect(() => {
      const unsubscribe = incidentCollection.onSnapshot(handleDataChange, fetchError);
      return () => unsubscribe();
    }, [timeRangeIndex.current]);

  useMemo(() => {
    console.log("Setting Bar Data");
    setBarData(incidents);
  }, [incidents]);

  function setBarData(incidents : any) {
    setLoading(true);
    // Initialize counters
    let homicideCount = 0;
    let injuryCount = 0;
    let theftCount = 0;
    let robberyCount = 0;
    let kidnappingCount = 0;
    let carnappingCount = 0;
    let rapeCount = 0;

    function setCounts() {
      setHomicideIncidentCount(homicideCount);
      setInjuryIncidentCount(injuryCount);
      setTheftIncidentCount(theftCount);
      setRobberyIncidentCount(robberyCount);
      setKidnappingIncidentCount(kidnappingCount);
      setCarnappingIncidentCount(carnappingCount);
      setRapeIncidentCount(rapeCount);
      setLoading(false);
    }

    // Iterate through incidents once
    incidents.map((incident: any) => {
      if (incident.timeOfCrime) {
        console.log("YES THERE IS TIME")
        const incidentDate = incident.timeOfCrime.toDate();
        console.log(incidentDate);
        if (timeRangeState == 1) {
          if (isToday(incidentDate)) {
            switch (incident.category) {
              case 'homicide':
                homicideCount++;
                console.log("+1 Homicide");
                break;
              case 'injury':
                injuryCount++;
                console.log("+1 Injury");
                break;
              case 'theft':
                theftCount++;
                console.log("+1 Theft");
                break;
              case 'robbery':
                robberyCount++;
                console.log("+1 Robbery");
                break;
              case 'kidnapping':
                kidnappingCount++;
                console.log("+1 Kidnapping");
                break;
              case 'carnapping':
                carnappingCount++;
                console.log("+1 Carnapping");
                break;
              case 'rape':
                rapeCount++;
                console.log("+1 Rape");
                break;
              default:
                break;
            }
            setCounts();
          }
        } else if (timeRangeState == 2) {
          if (isThisWeek(incidentDate)) {
            switch (incident.category) {
              case 'homicide':
                homicideCount++;
                console.log("+1 Homicide");
                break;
              case 'injury':
                injuryCount++;
                console.log("+1 Injury");
                break;
              case 'theft':
                theftCount++;
                console.log("+1 Theft");
                break;
              case 'robbery':
                robberyCount++;
                console.log("+1 Robbery");
                break;
              case 'kidnapping':
                kidnappingCount++;
                console.log("+1 Kidnapping");
                break;
              case 'carnapping':
                carnappingCount++;
                console.log("+1 Carnapping");
                break;
              case 'rape':
                rapeCount++;
                console.log("+1 Rape");
                break;
              default:
                break;
            }
            setCounts();
          }
        } else if (timeRangeState == 3) {
          if (isThisMonth(incidentDate)) {
            switch (incident.category) {
              case 'homicide':
                homicideCount++;
                console.log("+1 Homicide");
                break;
              case 'injury':
                injuryCount++;
                console.log("+1 Injury");
                break;
              case 'theft':
                theftCount++;
                console.log("+1 Theft");
                break;
              case 'robbery':
                robberyCount++;
                console.log("+1 Robbery");
                break;
              case 'kidnapping':
                kidnappingCount++;
                console.log("+1 Kidnapping");
                break;
              case 'carnapping':
                carnappingCount++;
                console.log("+1 Carnapping");
                break;
              case 'rape':
                rapeCount++;
                console.log("+1 Rape");
                break;
              default:
                break;
            }
            setCounts();
          }
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
        } else if (chosenDateRange === 4) {

        }
      }
    });
  },[incidents, timeRangeState]);
=======
        } else if (timeRangeState == 4) {
          if (selectedDate.start && selectedDate.end) {
            if (isAfter(incidentDate, selectedDate.start) && isBefore(incidentDate, selectedDate.end)) {
              switch (incident.category) {
                case 'homicide':
                  homicideCount++;
                  console.log("+1 Homicide");
                  break;
                case 'injury':
                  injuryCount++;
                  console.log("+1 Injury");
                  break;
                case 'theft':
                  theftCount++;
                  console.log("+1 Theft");
                  break;
                case 'robbery':
                  robberyCount++;
                  console.log("+1 Robbery");
                  break;
                case 'kidnapping':
                  kidnappingCount++;
                  console.log("+1 Kidnapping");
                  break;
                case 'carnapping':
                  carnappingCount++;
                  console.log("+1 Carnapping");
                  break;
                case 'rape':
                  rapeCount++;
                  console.log("+1 Rape");
                  break;
                default:
                  break;
              }
            }
          }
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
  }
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx


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

      //Fetch Data from Database, set incidents array and bar data array for use in the Bar Chart
  async function handleDataChange () {
    if(timeRangeState === 1) {
      console.log("DAY");
      crimesCollection
      .where("unixTOC", ">", getTime(startOfDay(new Date())))
      .where("unixTOC", "<", getTime(endOfDay(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setIncidents(data);
      })
    reportsCollection
    .where("unixTOC", ">", getTime(startOfDay(new Date())))
    .where("unixTOC", "<", getTime(endOfDay(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setReports(data);
      })
    } else if(timeRangeState == 2) {
      console.log("WEEK");
      crimesCollection
      .where("unixTOC", ">", getTime(startOfWeek(new Date())))
      .where("unixTOC", "<", getTime(startOfWeek(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setIncidents(data);
      })
    reportsCollection
    .where("unixTOC", ">", getTime(startOfWeek(new Date())))
    .where("unixTOC", "<", getTime(endOfWeek(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setReports(data);
      })
    } else if (timeRangeState == 3) {
      console.log("Month")
      crimesCollection
      .where("unixTOC", ">", getTime(startOfMonth(new Date())))
      .where("unixTOC", "<", getTime(endOfMonth(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setIncidents(data);
      })
    reportsCollection
    .where("unixTOC", ">", getTime(startOfMonth(new Date())))
    .where("unixTOC", "<", getTime(endOfMonth(new Date())))
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setReports(data);
      })
    } else if (timeRangeState == 4) {
      console.log("Custom")
      const start = selectedDate.start ? getTime(selectedDate.start) : 0;
      const end = selectedDate.end ? getTime(selectedDate.end) : 0;
      crimesCollection
      .where("unixTOC", "<=", end)
      .where("unixTOC", ">=", start)
      .get()
      .then((querySnapshot) => {
        let data: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          data.push({...doc.data() });
        });
        setIncidents(data);
      })
    reportsCollection
    .where("unixTOC", "<=", end)
    .where("unixTOC", ">=", start)
      .get()
      .then((querySnapshot) => {
        let report: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.docs.forEach(doc => {
          report.push({...doc.data() });
        });
        setReports(report);
    })
    console.log(incidents.length)
  }
};

    return (
    
      <ThemedView
      style={[styles.mainContainer, {opacity: loading ? 0.5 : 1}]}
      >
          <ScrollView style = {{backgroundColor: '#DADADA',}} contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}}>
  
            {/* MAIN CONTAINER */}
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
                    setLoading(true);
                    handleTimeRangePress(index + 1);
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
=======
                    if(timeRange.id === 4) {
                      handleCalendarSnapPress(0);
                    } else {
                      handleCalendarClosePress();
                    }
                    setTimeout(() => {
                      setLoading(false);
                    }, 1000);
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
                    timeRangeIndex.current = timeRange.id;
                    }}>
                    <Text style = {[{width: '100%', height: 'auto', paddingVertical: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center'}, !(timeRangeIndex.current == timeRange.id) && {color: '#115272', backgroundColor: '#FFF'}, timeRangeIndex.current == timeRange.id && {color: '#FFF', backgroundColor: '#115272'}, timeRange.id === 1 && {borderTopLeftRadius: 50, borderBottomLeftRadius: 50}, timeRange.id === 4 && {borderTopRightRadius: 50, borderBottomRightRadius: 50}]}>{timeRange.name}</Text>
                  </TouchableOpacity>
                  ))}
                    
                </View>
            </ImageBackground>
  
            <View style = {{width: '85%', justifyContent: 'space-around', backgroundColor: '#FFF', borderRadius: 20, marginVertical: '5%'}}>
              
              {/*CRIMES COUNT*/}
              <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
                <Text style = {{width: '100%', fontSize: 28, fontWeight:'bold', textAlign: 'center', color: '#115272'}}>Crimes</Text>
                <AnimatedCircularProgress
                style = {{height: "auto", aspectRatio: 1/1}}
                size={circularProgressSize}
                width={subtitle + 5}
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
                    <Text style = {[{fontSize: 48, fontWeight:'900', color: '#115272'},]}>
                      {fill}
                    </Text>
                  )
                }
                </AnimatedCircularProgress>
              </View>

<<<<<<< Updated upstream:app/(tabs)/summary.tsx
              {/*REPORTS COUNT*/}
=======
              </View>

              <View style = {{width: '85%', justifyContent: 'space-around', backgroundColor: '#FFF', borderRadius: 20, marginVertical: '5%'}}>
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
              <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style = {{width: '100%', fontSize: 28, fontWeight:'bold', textAlign: 'center', color: '#115272'}}>Reports</Text>
                  <AnimatedCircularProgress
                  style = {{height: "auto"}}
                  size={circularProgressSize}
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
                  width={20}
                  fill={24}
=======
                  width={subtitle + 5}
                  fill={reports.length}
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
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
              </View>
            </View>
      
            {/*BAR CHART*/}
            <View style = {{width: '85%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFF', marginVertical:'5%', paddingVertical: 25, borderRadius: 20,}}>
              {loading && 
                <View style = {{width: "100%", justifyContent: "center"}}>
                  <ActivityIndicator style = {{paddingVertical: '25%'}} color='#115272' size={'large'}/>
                </View>
                }
              <ScrollView horizontal>
                {!loading && <BarChart data={barData} initialSpacing={30} barWidth={17.5} barBorderTopLeftRadius={5} barBorderTopRightRadius={5} animationDuration={200} isAnimated/>}         
              </ScrollView>
            </View>

<<<<<<< Updated upstream:app/(tabs)/summary.tsx
            {/*GENERATE REPORTS BUTTON*/}
            <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#DA4B46', paddingVertical: '1.5%', borderRadius: 50, justifyContent: 'center', marginVertical: "5%"}} 
=======
            <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#115272', marginVertical: "2.5%", paddingVertical: '1.5%', borderRadius: 50, justifyContent: 'center'}} 
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
            onPress={ async () =>
              {
                setLoading(true);
                console.log(timeRangeState)
                handleDataChange();
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              } }>

                  <ThemedText style = {{width: "100%", textAlign: 'center'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Filter</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style = {{width: '50%', height: 'auto', backgroundColor: '#DA4B46', marginVertical: "2.5%", paddingVertical: '1.5%', borderRadius: 50, justifyContent: 'center'}} 
            onPress={ async () =>
              {
                setLoading(true);

                try{
                  // Check for Permission (check if permission is already given or not)
                  let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                  console.log(isPermitedExternalStorage)
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
                        Alert.alert("Need permissions", "The application needs storage permissions to generate the report.");
                    }
                } else {
                    // Already have Permission (calling our writeDataAndDownloadExcelFile function)
                    exportData();
                }
                } catch (e) {
                  console.log("Error checking permisison");
                  console.log(e);
                }
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              } }>
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
                  <Text style = {{width: "100%", fontSize: subtitle, color: "#FFF", fontWeight: "bold", textAlign: 'center'}} >Generate Reports</Text>
=======

                  <ThemedText style = {{width: "100%", textAlign: 'center'}} lightColor='#FFF' darkColor='#FFF' type="subtitle" >Generate Report</ThemedText>
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
            </TouchableOpacity>

            <SpacerView height={display} />
  
          </ScrollView>

          {/*CALENDAR*/}
          {timeRangeState == 4 && 
          <View
                style={{
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: "5%",
                  paddingVertical: "2.5%",
                  justifyContent: "center",
                }}
              >
                <Calendar
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
                  style={{width: "100%", height: "80%",}}
=======
                  style={{width: "100%", height: "85%", marginBottom: "5%"}}
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
                  current={formatDate(current, "yyyy-MM-dd")}
                  key={formatDate(current, "yyyy-MM-dd")}
                  theme={{
                    calendarBackground: "#115272", textDayFontWeight: "bold", textDayHeaderFontWeight: "bold",
                    selectedDayBackgroundColor: "#DA4B46", dayTextColor: "#FFF", arrowColor: "#FFF",
                    selectedDayTextColor: "#FFF", textSectionTitleColor: "#FFF", monthTextColor: "#FFF",
                    textMonthFontWeight: "black", todayTextColor: "#FECF1A", arrowWidth: 5,
                  }}
                  initialDate={formatDate(current, "yyyy-MM-dd")}
                  minDate={minDate}
                  maxDate={maxDate}
                  hideExtraDays={true}
                  markingType="dot"
                  markedDates={markedDates}
<<<<<<< Updated upstream:app/(tabs)/summary.tsx
                  onMonthChange={(month) => {
                      if(isThisYear(month.dateString) && !isAfter(month.dateString, maxDate) && !isBefore(month.dateString, minDate)) {
                        setDateMode("month");
                        setSelectedDate(month.dateString);
                      }
                  }}
                  onDayPress={(day) => {
                    setSelectedDate(formatDate(day.dateString, 'yyyy-MM-dddd'));
                    setDateMode("day");
                    console.log(getTime(selectedDate));
                    setMarkedDates({
                      [day.dateString]: {
                        selected: true,
                        selectedColor: "#DA4B46",
                      },
                    });
=======
                  onDayPress={(day: { dateString: string }) => {
                    setLoading(true);
                    if(selectedDate.start == null) {
                      setSelectedDate({start: parse(day.dateString, "yyyy-MM-dd", new Date()), end: null});
                      setMarkedDates({
                        [String(day.dateString)]: {
                          selected: true,
                          selectedColor: "#DA4B46",
                        }, 
                      });
                    } else if (selectedDate.start != null && selectedDate.end == null) {
                      if(!isBefore(parse(day.dateString, "yyyy-MM-dd", new Date()), selectedDate.start)) {
                        setSelectedDate({start: selectedDate.start, end: parse(day.dateString, "yyyy-MM-dd", new Date())});
                        setMarkedDates({
                          ...markedDates,
                          [String(day.dateString)]: {
                            selected: true,
                            selectedColor: "#FECF1A",
                          },
                        });
                      } else {
                        Alert.alert("Invalid Date Range", "End date cannot be before start date.");
                      }
                    }  else if (selectedDate.start != null && selectedDate.end != null) {
                      setSelectedDate({start: parse(day.dateString, "yyyy-MM-dd", new Date()), end: null});
                      setMarkedDates({
                        [String(day.dateString)]: {
                          selected: true,
                          selectedColor: "#DA4B46",
                        },
                      });
                    }
                    setLoading(false);
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
                  }}
                />

                {!loading && 
                <Pressable
                  style={{
                    backgroundColor: "#DA4B46",
                    height: 36,
                    width: "100%",
                    borderRadius: 50,
                    justifyContent: "center",
                    marginVertical: '10%',
                    alignSelf: "center",
                  }}
                onPress={async () => {
<<<<<<< Updated upstream:app/(tabs)/summary.tsx

=======
                  setLoading(true);
                  handleCalendarClosePress();
                  if (selectedDate.start && selectedDate.end) {
                    handleDataChange();
                  } else {
                    console.log("Start date is null");
                  }
>>>>>>> Stashed changes:app/(tabs)/adminSummary.tsx
                }}>
                  <Text
                    style = {{width: '100%', height: "100%", color: "#FFF", fontWeight: "bold", fontSize: 16, textAlign: "center", textAlignVertical: "center"}}>
                      Filter
                  </Text>
                </Pressable>}

                {loading && 
                <Pressable
                  style={{backgroundColor: "#DA4B46", height: 36, width: "100%", borderRadius: 50, justifyContent: "center", marginVertical: '5%', alignSelf: "center", paddingVertical: loading ? '2.5%' : 0
                  }}>
                    <ActivityIndicator size="large" color="#FFF"/>
                </Pressable>}
          </View>}
  
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
                                  {router.replace("/(tabs)/emergency")}} />

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
                                  {router.replace("/(auth)/login")}} />  

                            <ThemedButton width='35%' title="Logout" onPress={() =>
                                   {router.replace("/(auth)/login")}} />  

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