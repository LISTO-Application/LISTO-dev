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
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';



export default function UserAccount() {
  
  const { id } = useLocalSearchParams();

  return (
    
    <ThemedView
    style={styles.mainContainer}
    >
        <SpacerView height={60} />
        <ThemedView
          style={styles.subContainer}
        >
          
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="title" style={styles.text}>User {id} </ThemedText>
            <ThemedInput type='outline' placeholder='Email' />
            <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >Welcome!</ThemedText>
            <SpacerView height={40} />
            <SpacerView height={40}>
              <ThemedButton title="Login" onPress={() => 
                {router.replace({
                  pathname: "/",
                })}} />
            </SpacerView>
            <SpacerView height={55}/>

        </ThemedView>

    </ThemedView>
  );
}
