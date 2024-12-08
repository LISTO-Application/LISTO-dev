//Expo Imports
import { useSession } from "@/auth";
import { Redirect } from "expo-router"
import "core-js/stable/atob";
import { firebase } from "@react-native-firebase/firestore";

export default function Index() {
    const auth = useSession();
    const session = firebase.auth().currentUser;

    if(session != null) {
        return <Redirect href="/(tabs)"/>;
    }
    else {
        return (
            <Redirect href = "/login"/>
        )
    }
}