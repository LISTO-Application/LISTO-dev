//React Imports
import { useContext, createContext, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';

//Firebase Imports
import firestore, { FieldValue, FirebaseFirestoreTypes, GeoPoint, query } from '@react-native-firebase/firestore';
import { FirebaseAuthTypes, reauthenticateWithCredential} from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/functions';
import "core-js/stable/atob";

//Expo Imports
import { Redirect, router } from 'expo-router';

//Context to structure authentication methods and data
const AuthContext = createContext<{
    signIn: (email: string, password: string) => void;
    signOut: () => void;

    adminRegister: (
        email: string, 
        password: string, 
        uname: string, 
        pnumber: string,
        otp: string ) => Promise<{success: boolean; message: string;}>;

    penalizeUser: (uid: string) => void;

    distress: (
      reportTo: string,
      emergency: {
        crime: boolean, 
        fire: boolean, 
        injury: boolean},
      info: string,
      loc: GeoPoint,
      uid: string ) => Promise<{success: boolean; message: string;}>;
  }>({
    signIn: () => null,
    signOut: () => null,
    adminRegister: async () => ({ success: false, message: 'Not implemented' }),
    distress: async () => ({ success: false, message: 'Not implemented' }),
    penalizeUser: () => null,
  });

  // This hook can be used to access the user session methods and data.
  // Use in components to access the session state and methods
  // (ex.)
  // const auth = useSession();
  // <Pressable onPress={auth.signIn}>Sign In</Pressable>
  
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
      if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
      }
    }
    return value;
  }

  // May not be necessary since we are using Firebase authentication

  // Old flow: Pass credentials to backend > acquire JWT with roles > 
  // set JWT in session > use JWT to access user details

  // New flow: Pass credentials to backend > Assign claims to user using Cloud Functions >
  // Use Firebase authentication to access user details

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // export async function setSession(token: string) {
  //   firebase.auth().signInWithCustomToken(token)
  //   .catch((error) => {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log("Error encountered while signing in: " + errorCode + " - " + errorMessage);
  //   });
  // }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  export function authenticate(email: string, password: string) {
    console.log("Attempting to login");
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      if(result.user){
        console.log("Logged in successfully");
        return <Redirect href="/(tabs)"/>
      }
    })
    .catch(error => {
      if (error.code === 'auth/too-many-requests') {
        Alert.alert("Too many requests",'Too many subsequent login attempts, please try again in a few seconds!',  [{text: "OK"}], {cancelable: true});
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert("Invalid email",'Please enter a valid email address.' , [{text: "OK"}], {cancelable: true});
      }

      if (error.code === 'auth/invalid-credential') {
        Alert.alert("Incorrect credentials",'The email or password is incorrect.' , [{text: "OK"}], {cancelable: true});
      }

      if (error.code === 'auth/network-request-failed') {
        Alert.alert("Poor connection",'Network unstable, please try again later.' , [{text: "OK"}], {cancelable: true});
      }

      if(error.code === 'firestore/permission-denied') {
        Alert.alert("Registration failed","Permission denied, please try again later.", [{text: "OK"}], {cancelable: true});
      }

      console.error(error);
    });
  }

  // This component provides the authentication context to the app
  export function SessionProvider({ children }: PropsWithChildren) {
    return (
      <AuthContext.Provider
        value={{
          signIn: (email, password) => {
            if(firebase.auth().currentUser == null) {
                authenticate(email, password);
            }
            else {
              Alert.alert("Sign in failed","User is already logged in!")
              router.replace("/(tabs)")
            }
          },
          signOut: () => {
            firebase.auth().signOut();
            router.replace("/(auth)/login");
          },
          adminRegister: async (email, password, uname, pnumber, otp) => {
            console.log("Creating user...");
            console.log(typeof email, typeof password, typeof uname, typeof pnumber, typeof otp);
            const createAdminResult = await firebase.app().functions("asia-east1").httpsCallable("makeAdmin")({
              email: email,
              password: password,
              uname: uname,
              pnumber: pnumber, 
              otp: otp,
            })
            .then(async (result) => {
              console.log("SERVER RESPONSE: ", result.data);
              const response = result.data as { success: boolean, message: string };
              // If the user is successfully created, sign in the user 
              // and store user details in Firestore
              if(response.success) {
                console.log("User created successfully, signing in...");
                return await firebase.app().auth().signInWithEmailAndPassword(email, password)
                .then((result) => {
                  if (result.user) {
                    return { success: true, message: "ADMIN_CREATED" };
                  } else {
                    return { success: false, message: "ADMIN_NOT_CREATED" };
                  }
                })
                .catch((error) => {
                  console.log("Error signing in admin:", error);
                  return { success: false, message: "UNKNOWN" };
                });
              }
              // If response failed, return server response
              else {
                return { success: false, message: response.message };
              }
            })
            .catch((error) => {
              console.log("Error calling sign-up function:", error);
              return { success: false, message: "SERVER_ERROR" };
            });
            return createAdminResult;
            },

          distress: async (reportTo, emergency, info, loc, uid) => {
          console.log("Reporting distress...");
          console.log("Reporting ", emergency, " to: ", reportTo, " with additional info: ", info, " at location: ", loc.latitude, ", ", loc.longitude);
          return await firebase.firestore().collection('distress')
            .doc(uid)
            .set({
              barangay: reportTo,
              emergencyType: emergency,
              addInfo: info,
              location: loc,
              acknowledged: false,
              timestamp: firebase.firestore.Timestamp.now().toMillis() + 3600000,
            })
            .then(() => {
              console.log(("Distress reported successfully!"));
              return { success: true, message: "DISTRESS_REPORTED" };
            })
            .catch((error) => {
              console.log("Error reporting distress:", error.code);
              return { success: false, message: error.code };
            });
          },
          penalizeUser: async (uid) => {
            await firebase.app().functions("asia-east1").httpsCallable("makeAdmin")({
              uid: uid,
            })
          }
        }}>
        {children}
      </AuthContext.Provider>
    );
  }