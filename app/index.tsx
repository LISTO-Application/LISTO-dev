import Ionicons from '@expo/vector-icons/Ionicons';
import {Button, Image, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity} from 'react-native';
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';
import {router} from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';

export default function Login() {
  return (
    
    <ScrollView 
    contentContainerStyle={{ flexGrow: 1 }} 
    style={[styles.mainContainer, utility.blueBackground]}
    showsVerticalScrollIndicator = {false}
    keyboardShouldPersistTaps = "handled"
    >
        <SpacerView height={80} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={[styles.subContainer, utility.blueBackground]}
        >
          
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="title" >Login</ThemedText>
            <ThemedInput type='outline' placeholder='Email' />
            
            <ThemedInput type='outline' placeholder='Phone Number' />
            <ThemedInput type='outline' placeholder='********' secureTextEntry />
            <TouchableOpacity onPress={() => router.push("/forgot")}>
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >Forgot Password?</ThemedText>
            </TouchableOpacity>
            <SpacerView height={40} />
            <SpacerView height={40}>

              <ThemedButton title="Login" onPress={() => 
              //check if has account
                {router.replace({
                  pathname: "/adminLogin",
                })}} />
            </SpacerView>
            <SpacerView height={55} marginTop={20}>
                <TouchableOpacity onPress={() => router.push("/register")}>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >Don't have an account? </ThemedText>
                </TouchableOpacity>
            </SpacerView>
            <TouchableOpacity onPress={() => router.push("/changeAdminInformation")}>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >change Admin Info </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/changeUserInformation")}>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >change User Info </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/viewReports")}>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >View Reports</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/validateReports")}>
                    <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >View Admin Reports</ThemedText>
                </TouchableOpacity>
        </KeyboardAvoidingView>

    </ScrollView>
  );
}
