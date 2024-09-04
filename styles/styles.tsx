import { StyleSheet } from "react-native";

    const styles = StyleSheet.create({
        mainContainer: {
          backgroundColor: '#115272',
          flexDirection: 'column',
          height: '100%',
          display: 'flex',
          flex: 1,
        },
      
        subContainer: {
          backgroundColor: '#115272',
          marginLeft: '5%',
          marginRight: '5%',
          marginVertical: '20%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          flex: 1,
        },
      
        input: {
          backgroundColor: '#FFF',
          borderRadius: 5,
          borderColor: '#000',
          marginTop: '5%',
          marginBottom: '5%',
          lineHeight: 42,
          paddingLeft: 10,
        },

        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          },

        link: {
        marginTop: 15,
        paddingVertical: 15,
        },

        text: {
            flexDirection: 'column',
            marginTop: '5%',
            marginBottom: '5%',
        },

        submit: {
            backgroundColor: '#FFF',
            borderRadius: 5,
            marginTop: '5%',
            marginBottom: '5%',
            lineHeight: 48
        }
      });

export { styles };