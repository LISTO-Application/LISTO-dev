import Ionicons from '@expo/vector-icons/Ionicons';
import {Button, Image, Platform, KeyboardAvoidingView, ScrollView} from 'react-native';
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';
import {router} from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';



export default function Register() {
  return (
    
    <ScrollView 
    contentContainerStyle={{ flexGrow: 1 }} 
    style={styles.mainContainer}
    showsVerticalScrollIndicator = {false}
    keyboardShouldPersistTaps = "handled"
    >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 400}
          style={styles.subContainer}
        >
          
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="title" style={styles.text}>Sign up</ThemedText>
            <ThemedInput type='outline' placeholder='First Name' />
            <ThemedInput type='outline' placeholder='Last Name' />
            <ThemedInput type='outline' placeholder='+63' />
            <ThemedInput type='outline' placeholder='Email' />
            <ThemedInput type='outline' placeholder='********' secureTextEntry />
            <SpacerView height={40} />
            <SpacerView height={40}>
              <ThemedButton title="Sign up" onPress={() => 
                {router.replace({
                  pathname: "/forgot",
                })}}/>
            </SpacerView>
            <SpacerView height={55}>
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" style={styles.text}>Already have an account? </ThemedText>
            
            </SpacerView>

        </KeyboardAvoidingView>

    </ScrollView>
  );
}
