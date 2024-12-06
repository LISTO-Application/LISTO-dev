// import  { useEffect, useCallback, useReducer } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';

// //General flow:
// // App attempts to load JWT from local or secure storage
// // If JWT is found, uses it to authenticate user during sign-in
// // If JWT is not found, clears local and secure storage of key values
// // Further authentication attempts must be made by user using signIn()

// //Type for state hooks for generic types
// // In-app implementation: [[isLoading, session]], (setSession) = > void]
// type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// //Initializes authentication state tuple as [true, null]
// //In-app implementation: (isLoading = true & session = null)
// function useAsyncState<T>(
//     initialValue: [boolean, T | null] = [true, null],
//   ): UseStateHook<T> {
//     return useReducer(
//       (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
//       initialValue
//     ) as UseStateHook<T>;
//   }

//   //Function to store authorization tokens in secure or local storage using key-value pairs
//   //In-app implementation: (key = "session" & value = JWT)
//   export async function setStorageItemAsync(key: string, value: string | null) {
//     if (Platform.OS === 'web') {
//       try {
//         if (value === null) {
//           localStorage.removeItem(key);
//         } else {
//           localStorage.setItem(key, value);
//         }
//       } catch (e) {
//         console.error('Local storage is unavailable:', e);
//       }
//     } else {
//       if (value == null) {
//         await SecureStore.deleteItemAsync(key);
//       } else {
//         await SecureStore.setItemAsync(key, value);
//       }
//     }
//   }

//   //Function to get authorization tokens from secure or local storage
//   //In-app implementation: (key = "session")
//   export function useStorageState(key: string): UseStateHook<string> {
    
//     // Sets isLoading and session values
//     const [state, setState] = useAsyncState<string>();
  
//     //Sets the session variable to the JWT
//     //Attempts to acquire JWT from local or secure storage
//     // Runs on initial load and everytime the key value changes (default: key = "session")
//     useEffect(() => {
//       if (Platform.OS === 'web') {
//         try {
//           if (typeof localStorage !== 'undefined') {
//             setState(localStorage.getItem(key));
//           }
//         } catch (e) {
//           console.error('Local storage is unavailable:', e);
//         }
//       } else {
//         SecureStore.getItemAsync(key).then(value => {
//           setState(value);
//         });
//       }
//     }, [key]);

//       // Sets the session variable to the JWT or to null in the authentication flow
//       // Called during sign-in or sign-out
//       // If JWT is not passed, clears the local and secure storage of keys
//   const setValue = useCallback(
//     (value: string | null) => {
//       setState(value);
//       setStorageItemAsync(key, value);
//     },
//     [key]
//   );

//   return [state, setValue];
// }