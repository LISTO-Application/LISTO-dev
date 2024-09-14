import {Button, Image, Platform, KeyboardAvoidingView, ScrollView} from 'react-native';
import { styles } from '@/styles/styles';
import {utility} from '@/styles/utility';
import {router} from 'expo-router';

import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';



export default function Forgot() {
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
          
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="title">Forgot your password?</ThemedText>
            <ThemedInput type='outline' placeholder='Email' />
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
