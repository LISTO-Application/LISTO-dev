import { StyleSheet } from 'react-native';

const webstyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  sidebar: {
    backgroundColor: '#115272', // Blue sidebar
    width: '25%',
    padding: 20,
    color: 'white',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  sidebarItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sidebarText: {
    color: 'white',
    fontSize: 18,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for the main part
    padding: 20,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  reportList: {
    paddingBottom: 20,
  },
  reportContainer: {
    backgroundColor: '#0078A8',
    borderRadius: 25,
    padding: 20,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row', // Change this to row
    justifyContent: 'space-between', // Space between title and actions
    alignItems: 'center', // Center align items vertically
  },
  dropdownList: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    zIndex: 1, // Ensure the dropdown appears above other content
},

item: {
    padding: 10,
},

itemText: {
    fontSize: 16,
},

  fab: {
    position: 'absolute',
    bottom: 20, // Adjust based on your layout needs
    right: 20, // Adjust based on your layout needs
    backgroundColor: '#0078A8', // Blue background
    borderRadius: 50, // Circular shape
    width: 56, // Diameter
    height: 56, // Diameter
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Optional for shadow
  },
  reportActions: {
    flexDirection: 'row', // Ensure actions are in a row
    alignItems: 'center',
  },
  reportTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1, // Allows the title to take up space
  },
  
  editIcon: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#FF5B5B',
    padding: 12,
    borderRadius: 4,
    color: '#FFF',
    border: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#0078A8',
    padding: 12,
    borderRadius: 4,
    color: '#FFF',
    border: 'none',
    cursor: 'pointer',
  },
  buttonText: {  // Add this line for the button text style
    color: '#FFF', // Text color
    fontSize: 16, // Text size
    textAlign: 'center', // Center align the text
  },
 
  inputField: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  buttonContainereditReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButtoneditReport: {
    borderWidth: 2,              // Add border width
     // Set the border color
    paddingVertical: 10,         // Vertical padding
    paddingHorizontal: 20,       // Horizontal padding
    borderRadius: 20,            // Rounded corners
    flex: 1,
    marginRight: 10,
    alignItems: 'center',        // Center the text
    backgroundColor: 'transparent',  // Center the text
  },
  submitButtoneditReport: {
    backgroundColor: '#115272',
    paddingVertical: 10,  // Vertical padding for more height
    paddingHorizontal: 20, // Horizontal padding for more width
    borderRadius: 20,      // Increased radius for capsule shape
    flex: 1,
    alignItems: 'center',  // Center the text
  },
  buttonTexteditReport: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },

  
});

export { webstyles };
