// //React Imports
// import {
//     Platform,
//     KeyboardAvoidingView,
//     ScrollView,
//     Image,
//     StyleSheet,
//     View,
//     Text,
//   } from "react-native";
  
//   //Expo Imports
//   import { Redirect, router, useLocalSearchParams } from "expo-router";
  
//   //Firebase Imports
//   import firestore from '@react-native-firebase/firestore';
//   import { FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';
  
//   //Crypto Imports
//   import * as Crypto from 'expo-crypto';
  
//   //Stylesheet Imports
//   import { styles } from "@/styles/styles";
//   import { utility } from "@/styles/utility";
  
//   //Component Imports
//   import { ThemedInput } from "@/components/ThemedInput";
//   import { ThemedText } from "@/components/ThemedText";
//   import { SpacerView } from "@/components/SpacerView";
//   import { ThemedButton } from "@/components/ThemedButton";
  
//   //OTP Imports
  
//   import { OtpInput, OtpInputRef } from "react-native-otp-entry";
//   import { useRef, useState } from "react";
  
//   interface ExportOtpInputRef extends OtpInputRef {
//     clear: () => void;
//   }
//   export default function OTP() {
    
//     const settings = firebase.auth().settings;
//     settings.forceRecaptchaFlowForTesting = true;
  
//     const [confirm, setConfirm] = useState(false);
//     const [accountCreated, setAccountCreated] = useState(false);
//     // const [confirm, setConfirm] = useState<FirebaseAuthTypes.PhoneAuthSnapshot | null>(null);
//     //const [code, setCode] = useState('');
  
//       // Handle the verify phone button press
//       async function verifyPhoneNumber(phoneNumber : string) {
//         try {
//           setConfirm(true);
//           // console.log('Verifying ' + phoneNumber)
//           // const confirmation = await firebase.auth().verifyPhoneNumber(phoneNumber, true);
//           // const confirmationState = await confirmation.state;
//           // if(confirmationState === 'sent') {
//           //   console.log('SMS sent');
//           //   setConfirm(confirmation);
//           // }
//           // else {
//           //   console.log('SMS not sent, SMS status: ' + confirmationState);
//           // }
          
  
//         } catch (error) {
//           console.error('SMS not sent:' + {error});
//         }
//       }
  
//         // Handle confirm code button press
//     async function createAccount(firstName: string, lastName: string, phone: string, email: string, password: string) {
//       firestore()
//       .collection('users')
//       .add({
//         fname: firstName,
//         lname: lastName,
//         pnum: phone,
//         email: email,
//         password: await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, password)
//       })
//       .then(() => {
//         setAccountCreated(true);
//       });
//     }
  
//     const formData = useLocalSearchParams(); // Access query parameters
//     const email = formData.email.toString();
//     const firstName = formData.firstName.toString();
//     const lastName = formData.lastName.toString();
//     const phone = formData.phone.toString();
//     const password = formData.password.toString();
    
//     const logo = require("../../assets/images/logo.png");
  
//     if (Platform.OS === "android") {
//       return (
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           style={[styles.mainContainer, utility.blueBackground]}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <SpacerView height={100} />
//           <KeyboardAvoidingView
//             behavior="height"
//             keyboardVerticalOffset={0}
//             style={[styles.container, utility.blueBackground]}
//           >
  
//             <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
//               OTP Verification
//             </ThemedText>
//             {!confirm && (
//               <>
//                 <SpacerView height={40} />
//                 <SpacerView height={40}>
//                 <ThemedButton
//                     title="Send OTP"
//                     onPress={() => {verifyPhoneNumber(phone)}}
//                   />
//                 </SpacerView>
//               </>
//             )}
//             {confirm && !accountCreated && (
//               <>
//               <ThemedInput type="outline" placeholder="_ _ _ _ _ _" />
//               <SpacerView height={40} />
//               <SpacerView height={40}>
//                 <ThemedButton
//                   title="Submit"
//                   onPress={() => {createAccount(firstName, lastName, phone, email, password)}
//                   }
//                 />
//               </SpacerView>
//               </>
//             )}
//             {accountCreated && (
//               <>
//             <SpacerView height={40} />
//             <ThemedText lightColor="#FFF" darkColor="#FFF" type="subtitle">
//               Your account has been created successfully, you may now login!
//             </ThemedText>
//               <SpacerView height={40} />
//               <SpacerView height={40}>
//                 <ThemedButton
//                   title="Continue to login"
//                   onPress={() => {router.replace("/(auth)/login")}
//                   }
//                 />
//               </SpacerView>
//               </>
//             )}
//             <SpacerView height={55} />
//           </KeyboardAvoidingView>
//         </ScrollView>
//       );
//     } else if (Platform.OS === "web") {
  
//       const otpInputRef = useRef<ExportOtpInputRef>(null);
//       const [error, setError] = useState("");
    
//       const handleOtpFilled = (otp: string) => {
//         console.log("Entered OTP:", otp);
//         if (otp === "999999") {
//           console.log("OTP Accepted");
//           router.replace({
//             pathname: "/changepass",
//             params: {},
//           });
//         } else {
//           setError("Wrong OTP, please try again");
//           if (otpInputRef.current) {
//             otpInputRef.current.clear();
//           }
//         }
//       };
  
//       return (
//         <SpacerView
//           height="100%"
//           width="100%"
//           style={[utility.blueBackground, { margin: 20 }]}
//           flexDirection="column"
//           alignItems="center"
//         >
//           <SpacerView height="10%" />
//           <SpacerView
//             style={[utility.blueBackground]}
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             height="25%"
//             width="25%"
//           >
//             <Image source={logo} style={{ width: 200, height: 200 }}></Image>
  
//             <ThemedText lightColor="#FFF" darkColor="#FFF" type="subDisplay">
//               L I S T O
//             </ThemedText>
//           </SpacerView>
//           <SpacerView height="5%" />
//           <SpacerView
//             style={[
//               utility.blueBackground,
//               otpStyle.shadowBox,
//               { borderRadius: 20 },
//             ]}
//             flexDirection="column"
//             justifyContent="center"
//             height="30%"
//             width="30%"
//           >
//             <SpacerView
//               height="100%"
//               width="100%"
//               style={[utility.whiteBackground]}
//               borderRadius={20}
//               flexDirection="column"
//               justifyContent="center"
//               alignItems="center"
//             >
//               <ThemedText
//                 lightColor="#115272"
//                 darkColor="#115272"
//                 type="default"
//                 style={{ textAlign: "center", marginHorizontal: 70 }}
//               >
//                 An One-Time Password (OTP) was sent to your email, insert your otp
//                 before it expires
//               </ThemedText>
//               <ThemedText
//                 lightColor="#115272"
//                 darkColor="#115272"
//                 type="subDisplay"
//               >
//                 Enter OTP
//               </ThemedText>
//               <View
//                 style={{
//                   alignSelf: "center",
//                   margin: 10,
//                 }}
//               >
//                 <OtpInput
//                   numberOfDigits={6}
//                   blurOnFilled={true}
//                   type={"numeric"}
//                   theme={{
//                     containerStyle: otpStyle.container,
//                     pinCodeContainerStyle: otpStyle.pinCodeContainer,
//                     focusedPinCodeContainerStyle: otpStyle.pinCodeFocusContainer,
//                     focusStickStyle: otpStyle.stickFocus,
//                   }}
//                   focusStickBlinkingDuration={500}
//                   onFilled={handleOtpFilled}
//                   onBlur={() => {
//                     console.log("input blurred");
//                   }}
//                   ref={otpInputRef}
//                 />
//               </View>
//               {error ? (
//                 <ThemedText
//                   type="subtitle"
//                   style={{ color: "red", marginTop: 5 }}
//                 >
//                   {error}
//                 </ThemedText>
//               ) : null}
//               <SpacerView height="5%" />
//               <ThemedButton
//                 width="25%"
//                 title="Clear"
//                 onPress={() => {
//                   if (otpInputRef.current) {
//                     otpInputRef.current.clear();
//                   } else {
//                     console.warn("OTP input reference is null");
//                   }
//                 }}
//               />
//               <SpacerView height="2.5%" />
//             </SpacerView>
//           </SpacerView>
//           <SpacerView height="10%" />
//         </SpacerView>
//       );
//     }
//   }
  
//   const otpStyle = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "space-evenly",
//     },
//     pinCodeContainer: {
//       borderColor: "#7CB7D8",
//       margin: 5,
//     },
//     pinCodeFocusContainer: {
//       borderColor: "#115272",
//     },
//     stickFocus: {
//       backgroundColor: "#115272",
//     },
//     shadowBox: {
//       shadowColor: "#333333",
//       shadowOffset: {
//         width: 10,
//         height: 10,
//       },
//       shadowOpacity: 0.6,
//       shadowRadius: 4,
//     },
//   });
  