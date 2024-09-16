import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    height: '100%',
    display: 'flex',
    flex: 1,
  },
  
  header: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  // White background section starts here
  whiteSectionContainer: {
    backgroundColor: '#fff',  // White background
    borderTopLeftRadius: 20,  // Optional, for rounded top corners
    borderTopRightRadius: 20, // Optional, for rounded top corners
    paddingVertical: 20,
    paddingHorizontal: '5%',
    flex: 1,
  },

  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#115272',  // Darker color for text against the white background
  },
  iconButton: {
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  infoLabel: {
    fontSize: 16,
    color: '#115272',  // Darker color for text against the white background
  },
  infoText: {
    fontSize: 16,
    color: '#115272',  // Darker color for text against the white background
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },

  blueBackground: {
    backgroundColor: '#003366',  // Blue background for the top section
  },
});

export { styles };
