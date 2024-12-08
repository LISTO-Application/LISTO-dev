//React Imports
import {
  Image,
  Platform,
  ScrollView,
  ImageBackground,
  Pressable,
  Modal,
  Alert,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

//Expo Imports
import { Redirect, router} from "expo-router";

//Auth Imports
import { useSession } from "@/auth";

//Firebase Imports
import { FirebaseAuthTypes} from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";

// Hooks
import useResponsive from "@/hooks/useResponsive";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedText, SpacerView, ThemedButton, ThemedView, ThemedIcon, ThemedInput } from "@/components/";
import DeleteModal from "@/components/modal/DeleteModal";
import LogoutModal from "@/components/modal/LogoutModal";
import { Skeleton } from 'moti/skeleton'
import { LoadingScreen } from "@/components";
import { AnimatePresence, MotiView } from "moti";
import Email from "@/assets/images/email.svg";

export default function Account() {

  const session = firebase.auth().currentUser;
  if(session == null) {
    router.replace("../(auth)/login");
  }

  const { display, subDisplay, title, subtitle, body, small } = useResponsive();
  
  const texture = require("../../assets/images/texture.png");
  const image = require("../../assets/images/user-icon.png");
  const exit = require("../../assets/images/exit-button.png");

  //Track whether authentication is initializing
  const auth = useSession();
  const [initializing, setInitializing] = useState(true);
  const [reauthenticating, setReauthenticating] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  //User Details Display
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");

  //Re-authentication
  const [isLoading, setIsLoading] = useState(false);
  const [emailReauth, setEmailReauth] = useState("");
  const [password, setPassword] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);

  //Edit Information
  const [editEmail, setEditEmail] = useState<string | null>("");
  const [editPassword, setEditPassword] = useState<string | null>("");

  //Account Functions
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  //EDITABLE FIELDS
  const fields = [0, 1];

  const [fieldState, setFieldStates] = useState(
    fields.map(() => false)
  );

  const handleFieldPress = (index: number) => {
    setFieldStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~])[A-Za-z\d$^*.[\]{}()?"!@#%&/\\,><':;|_~]{6,}$/; // Minimum eight characters, at least one letter and one number

  // Handle user state changes
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });
    return subscriber;
  }, []);

useEffect( () => {
  const fetchUserData = async () => {
    firebase.firestore().collection('users')
      .doc(user?.uid)
      .get().then((doc) => {
        if (doc.exists) {
          setEmail(user?.email ?? "");
          const data = doc.data();
          if (data) {
            setFname(data.fname);
            setLname(data.lname);
            setPhone(data.pnumber);
          }
        }
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        if(error.code === "firestore/permission-denied") {
          if(user != null) {
            Alert.alert("User not found", "Account does not exist; please sign up again.",)
              user?.delete().catch(error => {
                if(error.code === 'auth/requires-recent-login') {
                  firebase.app().functions("asia-east1").useEmulator("localhost", 5001)
                  firebase.app().functions("asia-east1").httpsCallable("deleteUser")({uid: user?.uid})
                }
              });
            }
          }
        }
      );    
  };
  if(user != null) {
    setTimeout(() => {
      fetchUserData();
    }, 5000);
  }
}, [user]);

  if (initializing) return <LoadingScreen/>;

  if (!user) {return <Redirect href="../(auth)/login"/>;}

  //Delete account and prevent user from signing up again with same credentials for 1 month
function deleteAccount(email: string, phone: string, uid: string) {
  Alert.alert("Are you sure you want to delete your account?", 
    "This action cannot be undone, you will not be able to create a new account with your current phone number and email address for 1 month.",
   [{text: "Cancel"}, 
    {text: "Delete", 
      onPress: async () => {
        session?.delete()
        .catch(error => {
          if(error.code === 'auth/requires-recent-login') {
            Alert.alert("Re-authentication required", "Enter your credentials to proceed with account deletion", [{text: "Cancel"}, {text: "OK", onPress: () => {
              setReauthenticating(true)
              setDeleting(true);
            }}], {cancelable: true});
          }
          console.error(error);
        })
      }
    }
  ]);
}

async function updateDetails (userDetails: {email?: string | null, password?: string | null}) {
  console.log("Updating user details...");
  // Create an update object dynamically
  console.log("Checking for email...");
  if (userDetails.email != null && userDetails.email != "") {
    console.log("Updating email...");
    await session?.verifyBeforeUpdateEmail(userDetails.email)
    .then(() => {
      setVerifyEmail(true);
    })
    .catch((error) => {
      console.log(error);
      if(error.code === 'auth/invalid-email') {
        Alert.alert("Invalid email",'Please enter a valid email address.' , [{text: "OK"}], {cancelable: true});
      }
      if(error.code === 'auth/email-already-in-use') {
        Alert.alert("Email in use",'The email address is already in use.' , [{text: "OK"}], {cancelable: true});
      }
      if(error.code === 'auth/requires-recent-login') {
        console.log("Re-authentication required");
        Alert.alert("Re-authentication required",'Please sign in again to update email.' , [{text: "Cancel"}, {text: "OK", onPress: () => {
          setReauthenticating(true)
          setUpdating(true);
        }}], {cancelable: true});
      }
      if(error.code === 'auth/operation-not-allowed') {
        console.log("Re-authentication required");
        Alert.alert("Re-authentication required",'Please sign in again to update email.' , [{text: "Cancel"}, {text: "OK", onPress: () => {
          setReauthenticating(true)
          setUpdating(true);
        }}], {cancelable: true});
      }
    });
  }
  if (userDetails.password != null && userDetails.password != "") {
    console.log("Updating password...");
    await firebase.auth().currentUser?.updatePassword(userDetails.password)
    .catch((error) => {
      if(error.code === 'auth/weak-password') {
        Alert.alert("Weak password", "Password must contain 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 numeric character.", [{text: "OK"}], {cancelable: true});
      }
      if(error.code === 'auth/requires-recent-login') {
        Alert.alert("Re-authentication required",'Please sign in again to update email.' , [{text: "Cancel"}, {text: "OK", onPress: () => {
          setReauthenticating(true)
          setUpdating(true);
        }}], );
      }
    });
  }
}

  if (Platform.OS === "android") {
    return (
      <ThemedView style={[styles.mainContainer]}>
        <ScrollView>
          <ImageBackground source={texture} style={styles.header}>
            <SpacerView height={30} />
            <Image source={image}></Image>
            <SpacerView height={20} />
            {!loading ? 
            <Text style = {{width: "100%", fontSize: title, fontWeight: "bold", color: "#FFF", textAlign:"center"}}>
              {fname} {lname}
            </Text> :                 
            <View style = {{opacity: 0.1}}>
              <Skeleton colorMode="light" width={display * 5} height={36} show={loading} radius={20}/>
            </View>}
            <SpacerView height={20} />
          </ImageBackground>

          <SpacerView height={20} />

          <ThemedView style={[styles.container]}>
            <SpacerView
              style={utility.row}
              borderBottomWidth={5}
              borderBottomColor="#115272"
              height={40}
              marginBottom={10}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle">
                Personal Information
              </ThemedText>
            </SpacerView>

            <SpacerView
              height='auto'
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}>
                First Name
              </ThemedText>
              <View style = {utility.row}>
                {!loading ? 
                <ThemedText style = {accountStyle.info}>
                  {fname}
                </ThemedText> :
                <View style = {{marginBottom: 6}}>
                  <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
                </View>}
              </View>
            </SpacerView>

            <SpacerView
              height='auto'
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}>
                Last Name
              </ThemedText>
              {!loading ? <ThemedText style = {accountStyle.info}>
                {lname}
              </ThemedText> :                 
                <View style = {{marginBottom: 6}}>
                  <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
                </View>}
            </SpacerView>

            <SpacerView
              height= 'auto'
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}>                
                Email
              </ThemedText>
              <View style = {[utility.row, {justifyContent: 'space-between'}]}>
                {loading &&                 
                <View style = {{marginBottom: 6}}>
                  <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
                </View>}
                {!fieldState[0] && !loading && <ThemedText
                  style = {accountStyle.info}>
                  {email}
                </ThemedText>}
                {fieldState[0] && !loading &&  <TextInput
                  style={accountStyle.editInfo}
                  placeholder={email}
                  placeholderTextColor="#BBB"
                  onChangeText={setEditEmail}
                />}
                {!fieldState[0] && !loading && <ThemedIcon name="pencil" color='#115272' style = {accountStyle.editIcon} onPress={() => {
                    handleFieldPress(0);
                  }}/>
                }
                {fieldState[0] && !loading && <ThemedIcon name="close" color='#115272' style = {accountStyle.editIcon} onPress={() => {{
                  handleFieldPress(0);
                  setEditEmail(null);
                }
                  }}/>
                }
              </View>
            </SpacerView>

            <SpacerView
              height= 'auto'
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}>                
                Password
              </ThemedText>
              <View style = {[utility.row, {justifyContent: 'space-between'}]}>
                {loading &&                 
                <View style = {{marginBottom: 6}}>
                  <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
                </View>}
                {!fieldState[1] && !loading && <ThemedText
                  style = {accountStyle.info}>
                  **********
                </ThemedText>}
                {fieldState[1] && !loading && <TextInput
                  style={accountStyle.editInfo}
                  placeholder="**********"
                  placeholderTextColor="#BBB"
                  onChangeText={setEditPassword}
                  secureTextEntry
                />}
                {!fieldState[1] && !loading && <ThemedIcon name="pencil" color='#115272' style = {accountStyle.editIcon} onPress={() => {
                    handleFieldPress(1);
                  }}/>
                }
                {fieldState[1] && !loading && <ThemedIcon name="close" color='#115272' style = {accountStyle.editIcon} onPress={() => {{
                  handleFieldPress(1);
                  setEditPassword(null);
                }
                  }}/>
                }
              </View>
            </SpacerView>

            <SpacerView
              height="auto"
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}>
                Phone Number
              </ThemedText>
              {!loading ? <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                paddingVertical={2}>
                {phone}
              </ThemedText> :                 
              <View style = {{marginBottom: 6}}>
                <Skeleton colorMode="light" width={240} height={24} show={true} radius={20}/>
              </View>}
            </SpacerView>

            <SpacerView height={50} />

            <SpacerView
              style={utility.row}
              borderBottomWidth={5}
              borderBottomColor="#115272"
              height={50}
              marginBottom={10}>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle">
                Account Settings
              </ThemedText>
            </SpacerView>
            <SpacerView
              height={35}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              {!loading ? 
              <Pressable
                style={{
                  width: "auto",
                  height: "auto",
                }}
                onPress={() => {
                  if (email && phone && user?.uid) {
                    deleteAccount(email, phone, user?.uid);
                  } else {
                    Alert.alert("Error", "Missing user information.");
                  }
                }}>
                <ThemedText
                  lightColor="#DA4B46"
                  darkColor="#DA4B46"
                  type="body"
                  paddingVertical={2}>
                  Delete Account
                </ThemedText>
              </Pressable> : 
              
              <View style = {{marginBottom: 6}}>
                <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
              </View>}
            </SpacerView>

            <SpacerView
              height={35}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}>
              {!loading ? 
              <Pressable
                style={{
                  width: "auto",
                  height: "auto",
                }}
                onPress={() => {
                  auth.signOut();
                  console.log(session);
                }}>
                <ThemedText
                  lightColor="#DA4B46"
                  darkColor="#DA4B46"
                  type="body"
                  paddingVertical={2}>
                  {" "}
                  Logout{" "}
                </ThemedText>
              </Pressable> :
              
              <View style = {{marginBottom: 6}}>
                <Skeleton colorMode="light" width={240} height={24} show={loading} radius={20}/>
              </View>}
            </SpacerView>

            {(fieldState[0] || fieldState[1]) && (editEmail || editPassword) && 
            <ThemedButton
                title="Update"
                width="50%"
                height="auto"
                type="blue"
                paddingVertical="2.5%"
                marginHorizontal='auto'
                marginVertical='5%'
                onPress={() => {
                  if (editEmail != null && editEmail != "" && !emailRegex.test(editEmail)) {
                    Alert.alert("Invalid email", "Please enter a valid email address.", [{text: "OK"}], {cancelable: true});
                  } else if (editEmail != "" && editEmail == email) {
                    Alert.alert("Invalid email", "Please enter a different email address.", [{text: "OK"}], {cancelable: true});
                  } else if (editPassword != null && editPassword != "" && !passwordRegex.test(editPassword)) {
                    Alert.alert("Weak password", "Password must contain 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 numeric character.", [{text: "OK"}], {cancelable: true});
                  } else {
                    updateDetails({email: editEmail, password: editPassword})
                  }
                }}
              /> }

          </ThemedView>

          <SpacerView height={80} />
        </ScrollView>

        <AnimatePresence>
        {verifyEmail && 
        <Modal>
            <MotiView style = {{width: "100%", height: "100%", flexDirection: "column", backgroundColor:"#115272", justifyContent: 'center', alignItems:'center',}} from = {{opacity: 0}} animate={{opacity: 1}} exit = {{opacity: 0}}>
              <Email width="25%" height="25%" style = {{backgroundColor: 'rgba(0,0,0,0)', borderRadius: 200, marginBottom: "5%", aspectRatio: 1/1}}></Email>
              <Text style = {[{width: '75%', color: "#FFF", borderRadius: 10, textAlign: "center", marginBottom: "5%", fontWeight: "900"}, {fontSize: subtitle}]}>An email has been sent to your current email for verification to complete the email change process. {"\n\n"} Please log in again after verifying to continue!</Text>
            <TouchableOpacity
              style = {{width: "100%", height: "auto", backgroundColor: "#FFF", borderRadius: 50, justifyContent: "center", paddingVertical: "2.5%"}}
              onPress={() => {
                setVerifyEmail(false)
                auth.signOut();
                }}>
              <Text style = {[{width: '75%', color: "#115272", borderRadius: 10, textAlign: "center", fontWeight: "900", paddingHorizontal: "25%"}, {fontSize: subtitle}]}>OK</Text>
            </TouchableOpacity>
          </MotiView>
        </Modal>}
        </AnimatePresence>

        {reauthenticating && <Modal
            animationType="fade"
            transparent={true}
            >
              <View 
              style = {{backgroundColor: 'rgba(0,0,0, 0.5)', width: '100%', height: '100%'}}>
                <View             
                style = {accountStyle.modal}>
                  <TouchableOpacity style = {{width:'auto', alignSelf:'flex-start', justifyContent:'center', borderRadius: 50, backgroundColor: '#FFF'}}>
                    <Pressable onPress={() => {
                      setReauthenticating(false)
                      setDeleting(false)
                      setUpdating(false)
                    }}>
                      <Image style= {{width: 36, height: 36,}} source={exit}/>
                    </Pressable>
                  </TouchableOpacity>
                  {deleting && <Text style = {{marginVertical: '5%', alignSelf: 'center', fontSize: title, fontWeight: "bold", color: "#FFF"}} >
                    Confirm Deletion
                  </Text>}
                  {updating && <Text style = {{marginVertical: '5%', alignSelf: 'center', fontSize: title, fontWeight: "bold", color: "#FFF"}} >
                    Confirm Update
                  </Text>}
                  <TextInput style = {accountStyle.textInput} placeholder="Email" placeholderTextColor = "#BBB" onChangeText={setEmailReauth}/>
                  <TextInput style = {accountStyle.textInput} placeholder="Password"   placeholderTextColor = "#BBB" onChangeText={setPassword} secureTextEntry />
                  {!isLoading && <ThemedButton
                    title="Submit"
                    width='75%'
                    marginHorizontal='auto'
                    marginVertical='2.5%'
                    onPress={() => {
                      var credentials = firebase.auth.EmailAuthProvider.credential(emailReauth, password);
                      session?.reauthenticateWithCredential(credentials)
                      .then(result => {
                        if(deleting) {
                          result.user.delete()
                          .then(() => {
                            setReauthenticating(false);
                            setDeleting(false);
                            router.replace("../(auth)/login");
                          }).catch(error => {
                            console.error(error);
                          })
                        }
                        else if(updating) {
                          updateDetails({email: editEmail, password: editPassword})
                          .then(() => {
                            setReauthenticating(false);
                            setUpdating(false);
                            router.replace("../(tabs)/account");
                          }).catch(error => {
                            console.error(error);
                          })
                        }
                      })
                      .catch((error) => {
                        if (error.code === 'auth/too-many-requests') {
                          Alert.alert("Too many requests",'Too many subsequent login attempts, please try again in a few seconds!',  [{text: "OK"}], {cancelable: true});
                        }
                  
                        if (error.code === 'auth/invalid-credential') {
                          Alert.alert("Incorrect credentials",'The email or password is incorrect.' , [{text: "OK"}], {cancelable: true});
                        }
                  
                        if (error.code === 'auth/network-request-failed') {
                          Alert.alert("Poor connection",'Connection error, please try again later.' , [{text: "OK"}], {cancelable: true});
                        }
                        console.error(error);
                      })
                    }}

                  />}

                  {isLoading && 
                  <Pressable
                    style={{
                      backgroundColor: "#DA4B46",
                      height: 36,
                      width: "75%",
                      borderRadius: 50,
                      justifyContent: "center",
                    }}>
                      <ActivityIndicator size="large" color="#FFF"/>
                    </Pressable>}
                  </View>
                </View>
            </Modal>}


      </ThemedView>
    );
  } 
}

const accountStyle = StyleSheet.create({
  modal: {
    width: "80%",
    marginHorizontal:'auto',
    marginVertical: 'auto',
    backgroundColor: "#115272",
    paddingHorizontal: '2.5%',
    paddingVertical: '2.5%',
    borderRadius: 20,
  },
  textInput: {
    width: "80%",
    height: 48,
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: 50,
    borderColor: "#FFF",
    borderWidth: 3,
    marginTop: "5%",
    marginBottom: "5%",
    paddingLeft: 20,
    color: "#FFF",
    fontWeight: "bold",
    padding: 10,
  },
  info: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '90%',
    backgroundColor: "transparent",
    color: "#115272",
    paddingVertical: 2,
  },
  editInfo: {
    height: 32,
    width: '90%',
    padding: 0,
    backgroundColor: "transparent",
    color: "#115272",
    fontSize: 16,
    fontWeight: "bold",
  },
  editIcon: {
    marginHorizontal: 'auto',
  }
});