//React Imports
import {Platform, KeyboardAvoidingView, ScrollView, Image} from 'react-native';

//Expo Imports
import {router} from 'expo-router';

//Stylesheet Imports
import { styles } from '@/styles/styles';
import {utility} from '@/styles/utility';

//Component Imports
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

export default function Forgot() {

  const logo = require('../assets/images/logo.png');

  if(Platform.OS === 'android') {
   
    return (
      <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      style={[styles.mainContainer, utility.blueBackground]}
      showsVerticalScrollIndicator = {false}
      keyboardShouldPersistTaps = "handled"
      >
          <SpacerView height={100} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            style={[styles.subContainer, utility.blueBackground]}
          >
            
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="title">Enter OTP</ThemedText>
              <ThemedInput type='outline' placeholder='_ _ _ _ _ _' />
              <SpacerView height={40} />
              <SpacerView height={40}>
                <ThemedButton title="Submit" 
                onPress={() => 
                  router.replace({
                    pathname: "/[id]",
                    params: { 
                      id: 'John Doe' },
                      
                  })} />
              </SpacerView>
              <SpacerView height={55}/>
  
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
            height='50%'
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
                <ThemedText lightColor='#115272' darkColor='#115272' type="subDisplay">Enter OTP</ThemedText>
                <SpacerView height='5%' />
                <ThemedInput width='75%' backgroundColor='#115272' type='outline' marginVertical='2.5%' placeholderTextColor = "#DDD" placeholder='_ _ _ _ _ _' />
                <SpacerView height='5%' />
                  <ThemedButton width='25%' title="Submit" onPress={() =>
                    {router.replace({
                      pathname: "/[id]",
                      params: { 
                        id: 'John Doe' },
                    })}} />
                    <SpacerView height='2.5%'/>
              </SpacerView>

          </SpacerView>
  
      </SpacerView>
    )
  }
}
