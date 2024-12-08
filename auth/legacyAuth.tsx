// //DEPRECATED: This file is no longer in use and is kept for reference purposes only. The current authentication system is implemented in the auth file. (Ctrl + K + U to uncomment all code)

// //React Imports
// import { useContext, createContext, type PropsWithChildren } from 'react';
// import { Alert } from 'react-native';

// //Auth Imports
// import { useStorageState } from './useStorageState';

// //Crypto Imports
// import * as Crypto from 'expo-crypto';

// //Firebase Imports
// import firestore, { FirebaseFirestoreTypes, query } from '@react-native-firebase/firestore';
// import { firebase } from '@react-native-firebase/functions';

// //Expo Imports
// import { Redirect, router } from 'expo-router';

// //Context to structure authentication methods and data
// const AuthContext = createContext<{
//     signIn: (email: string, password: string) => void;
//     signOut: () => void;
//     session?: string | null;
//     isLoading: boolean;
//   }>({
//     signIn: () => null,
//     signOut: () => null,
//     session: null,
//     isLoading: false,
//   });
//   // This hook can be used to access the user session methods and data.
//   // Use in components to access the session state and methods
//   // (ex.)
//   // const auth = useLegacySession();
//   // <Pressable onPress={auth.signIn}>Sign In</Pressable>
  
// export function useLegacySession() {
//     const value = useContext(AuthContext);
//     if (process.env.NODE_ENV !== 'production') {
//       if (!value) {
//         throw new Error('useLegacySession must be wrapped in a <SessionProvider />');
//       }
//     }
  
//     return value;
//   }

//    export async function authenticate(email: string, password: string) {
//      try {
//        const hashedPass = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, password)
//        const querySnapshot = await firestore().collection('users')
//        .where('email', '==', email)
//        .get()

//        for (const documentSnapshot of querySnapshot.docs) {
//          if (hashedPass === documentSnapshot.get("password")) {
//            const id = documentSnapshot.id;
//            return id;
//          }
//          else {
//            return null;
//          }
//        }
//      }
//      catch(error) {
//        alert("Error encountered: " + error)
//        throw error;
//      }
//    }

//   // This component provides the authentication context to the app
//   export function SessionProvider({ children }: PropsWithChildren) {
//     //Handles JWT storing in local and secure storage and contextualization for authentication
//     const [[isLoading, session], setLegacySession] = useStorageState('session');
  
//     return (
//       <AuthContext.Provider
//         value={{
//           signIn: async (email, password) => {
//             if(session == null) {
//               try {
//                 const payload = authenticate(email, password);
//                 if(payload != null) {
//                   firebase.app().functions("asia-east1").useEmulator("localhost", 5001)
//                   firebase.app().functions("asia-east1").httpsCallable("getToken")({payload: payload}).then(result => {
//                   const jwt =  result.data as string;
//                   setLegacySession(jwt);
//                   return <Redirect href="/(tabs)/"/>
//                   }).catch(error => {console.log(error)}); 
//                  }
//                  else {
//                    Alert.alert("Login failed","Invalid username or password", [{text: "OK"}]), {cancelable: true};
//                  }
//               }
//               catch(error) {
//                 console.log(error)
//               }
//             }
//             else {
//               alert("User is already logged in!")
//               router.replace("/(tabs)")
//             }
//           },
//           signOut: () => {
//             setLegacySession(null);
//             firebase.auth().signOut();
//             return <Redirect href="/(auth)/login"/>
//           },
//            session,
//            isLoading,
//         }}>
//         {children}
//       </AuthContext.Provider>
//     );
//   }