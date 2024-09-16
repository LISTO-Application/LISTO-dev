import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    height: '100%',
    display: 'flex',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: '#115272', // Blue color
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // White text color
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  reportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#115272',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  reportIcon: {
    marginRight: 10,
    backgroundColor: '#DA4B46',
    padding: 10,
    borderRadius: 50,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#FFF',
  },
  editIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#115272',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#115272',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#115272',
    fontSize: 16,
    fontWeight: 'bold',
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
