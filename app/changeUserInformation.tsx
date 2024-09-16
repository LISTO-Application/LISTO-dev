import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Image, Platform, KeyboardAvoidingView, ScrollView, ImageBackground,Alert,TouchableOpacity, View, Text} from 'react-native';
import { styles } from '@/styles/styles';
import { utility } from '@/styles/utility';
import { router } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { SpacerView } from '@/components/SpacerView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { ThemedIcon } from '@/components/ThemedIcon';

export default function UserAccount() {
  
  const { id } = useLocalSearchParams();
  const texture = require('../assets/images/texture.png');
  const image = require('../assets/images/user-icon.png');

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // Implement logout functionality here
            console.log('User logged out');
            // You can navigate the user or perform any other action after logging out.
            router.replace('/');  // Example navigation
          }
        }
      ]
    );
  };
  return (
    
    <ThemedView style={[styles.mainContainer]}>
      <ScrollView>

        <ImageBackground source={texture} style={styles.header}>
          <SpacerView height={30} />
          <Image source={image} style={styles.profileImage} />
          <SpacerView height={20} />
          {/* Display User Name (id) */}
          <ThemedText lightColor='#FFF' darkColor='#FFF' type="title"> {id} </ThemedText>
          <SpacerView height={10} />
          
          
          <SpacerView height={20} />
        </ImageBackground>

        <SpacerView height={20} />

        <ThemedView style={[styles.subContainer]}>
          {/* Personal Information Section */}
          <SpacerView style={utility.row} borderBottomWidth={5} borderBottomColor='#115272' height={40} marginBottom={10}>
            <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle">Personal Information</ThemedText>
            <ThemedIcon name='pencil'></ThemedIcon>
          </SpacerView>

          <SpacerView height={65} borderBottomWidth={3} borderBottomColor='#C3D3DB' flexDirection="column" marginBottom={5}>
            <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle" paddingVertical={2}>Name</ThemedText>
            <ThemedText lightColor='#115272' darkColor='#115272' type="body" paddingVertical={2}>{id}</ThemedText>
          </SpacerView>

          <SpacerView height={65} borderBottomWidth={3} borderBottomColor='#C3D3DB' flexDirection="column" marginBottom={5}>
            <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle" paddingVertical={2}>Email</ThemedText>
            <ThemedText lightColor='#115272' darkColor='#115272' type="body" paddingVertical={2}>johndoe@gmail.com</ThemedText>
          </SpacerView>

          <SpacerView height={65} borderBottomWidth={3} borderBottomColor='#C3D3DB' flexDirection="column" marginBottom={5}>
            <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle" paddingVertical={2}>Phone Number</ThemedText>
            <ThemedText lightColor='#115272' darkColor='#115272' type="body" paddingVertical={2}>+639123456789</ThemedText>
          </SpacerView>

          <SpacerView height={50} />

          {/* Account Settings Section */}
          <SpacerView style={utility.row} borderBottomWidth={5} borderBottomColor='#115272' height={50} marginBottom={10}>
            <ThemedText lightColor='#115272' darkColor='#115272' type="subtitle">Account Settings</ThemedText>
          </SpacerView>

          <SpacerView height={35} borderBottomWidth={3} borderBottomColor='#C3D3DB' flexDirection="column" marginBottom={5}>
            <ThemedText lightColor='#DA4B46' darkColor='#DA4B46' type="body" paddingVertical={2}>Request for Account Deletion</ThemedText>
          </SpacerView>

          <SpacerView height={35} borderBottomWidth={3} borderBottomColor='#C3D3DB' flexDirection="column" marginBottom={5}>
            <TouchableOpacity>
            <ThemedText lightColor='#DA4B46' darkColor='#DA4B46' type="body" paddingVertical={2} onPress={handleLogout}>Logout</ThemedText>
            </TouchableOpacity>
          </SpacerView>

          {/* Home Button */}
          <ThemedButton title="Home" onPress={() => router.replace({ pathname: "/emergency" })} />

        </ThemedView>

        <SpacerView height={80} />

      </ScrollView>

     
    </ThemedView>
  );
}
