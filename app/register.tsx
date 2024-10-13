//React Imports
import {Platform, KeyboardAvoidingView, ScrollView, Image, Pressable} from 'react-native';

//Expo Imports
import {router} from 'expo-router';

//Stylesheet Imports
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';

//Component Imports
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

//Icon Imports
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Register() {

  
const logo = require('../assets/images/logo.png');
  
  if(Platform.OS === 'android') {
    return (
      <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      style={[styles.mainContainer, utility.blueBackground]}
      showsVerticalScrollIndicator = {false}
      keyboardShouldPersistTaps = "handled"
      >
          <SpacerView height={60} />
          <KeyboardAvoidingView
            behavior={'height'}
            keyboardVerticalOffset={400}
            style={[styles.container, utility.blueBackground]}
          >
            
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="title">Sign up</ThemedText>
              <ThemedInput type='outline' placeholder='First Name' />
              <ThemedInput type='outline' placeholder='Last Name' />
              <ThemedInput type='outline' placeholder='+63' />
              <ThemedInput type='outline' placeholder='Email' />
              <ThemedInput type='outline' placeholder='********' secureTextEntry />
              <SpacerView height={40} />
              <SpacerView height={40}>
                <ThemedButton title="Sign up" onPress={() => 
                  {router.replace({
                    pathname: "/otp",
                  })}}/>
              </SpacerView>
              <SpacerView height={55} marginTop={20}>
              <Pressable 
                    style = 
                    {{
                      width: 'auto',
                      height: 'auto'
                    }}
                    onPress={() => {
                      router.replace({
                      pathname: "/",
                    })}}>
                  <ThemedText lightColor='#FFF' darkColor='#FFF' type="body">Already have an account? </ThemedText>
              </Pressable>
              </SpacerView>
  
          </KeyboardAvoidingView>
  
      </ScrollView>
    );
  }
  else if(Platform.OS === 'web') {
    return (
    
      <SpacerView
      height='100%'
      width='100%'
      style={[utility.blueBackground]}
      flexDirection='row'
      justifyContent='space-between'
      alignItems = 'center'
      >

          <SpacerView
            style={[utility.blueBackground]}
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='100%'
            width='50%'
          >
              <Image source={logo}></Image>

              <SpacerView height='5%' />

              <ThemedText lightColor='#FFF' darkColor='#FFF' type="display" >L I S T O</ThemedText>

          </SpacerView>
          
          <SpacerView
            style={[utility.blueBackground]}
            flexDirection='column'
            justifyContent='center'
            height='75%'
            width='50%'
          >
              <SpacerView
              height='100%'
              width='75%'
              style={[utility.whiteBackground]}
              borderRadius={20}
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              >
                <ThemedText lightColor='#115272' darkColor='#115272' type="subDisplay">Create an account</ThemedText>
                <SpacerView height='5%' />

                <SpacerView>
                  <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='First Name' />
                  <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='Last Name' />
                </SpacerView>

                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='+63' />
                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='Email' />
                
                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='********' secureTextEntry />
                <SpacerView height='5%' />
                  <ThemedButton width='25%' title="Sign up" onPress={() =>
                    {router.replace({
                      pathname: "/otp",
                    })}} />
                    <SpacerView height='2.5%'/>
                    
                    <Pressable 
                    style = 
                    {{
                      width: 'auto',
                      height: 'auto'
                    }}
                    onPress={() => {
                      router.replace({
                      pathname: "/",
                    })}}>
                        <ThemedText lightColor='#115272' darkColor='#115272' type="body" >Already have an account? </ThemedText>
                    </Pressable>
              
              </SpacerView>

          </SpacerView>
  
      </SpacerView>
    );
  }
  
}
