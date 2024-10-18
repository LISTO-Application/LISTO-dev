import { StyleSheet } from "react-native";

const webstyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    backgroundColor: "#115272",
    padding: "3%",
  },
  sidebar: {
    backgroundColor: "#115272", // Blue sidebar
    width: "25%",
    padding: 20,
    color: "white",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  sidebarItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sidebarText: {
    color: "white",
    fontSize: 18,
  },
  mainContainer: {
    backgroundColor: "white", // White background for the main part
    padding: 20,
    borderRadius: 30,
    width: "80%",
    flex: 1,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#115272",
  },
  reportList: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 10,
    margin: 5,
  },
  reportContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#115272",
    marginBottom: 10,
    borderRadius: 8, // Center align items vertically
  },
  dropdownList: {
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    width: "100%",
    zIndex: 1, // Ensure the dropdown appears above other content
  },

  backIcon: {
    position: "absolute",
    left: 10,
  },

  scrollViewContent: {
    display: "block",
    padding: "10px 20px",
  },

  reportIcon: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    borderWidth: 1,
  },
  reportTextContainer: {
    flex: 1,
    paddingLeft: "10px",
  },
  reportTitleValidate: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#115272", // Blue color for the title
  },
  // Updated details to blue
  reportDetails: {
    fontSize: "14px",
    color: "#115272", // Blue color for the details
  },
  timeText: {
    fontSize: 15,
    color: "white",
    marginLeft: 20,
    fontWeight: 600,
  },
  statusContainer: {
    marginRight: 10,
    // Add padding to make it larger
    paddingVertical: 5,
    paddingHorizontal: 10,
    // Optionally, set a fixed width or a minimum width
    minWidth: 80, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 8, // Increase vertical padding
    paddingHorizontal: 12, // Increase horizontal padding
    borderRadius: 15,
    textAlign: "center",
    fontSize: 14, // Adjust font size if needed
  },
  validateIcon: {
    paddingLeft: "5px",
    color: "#115272",
  },
  horizontalLine: {
    height: "1px",
    backgroundColor: "#d3d3d3",
    marginVertical: "10px",
  },

  item: {
    padding: 10,
  },

  itemText: {
    fontSize: 16,
  },

  fab: {
    position: "absolute",
    bottom: 20, // Adjust based on your layout needs
    right: 20, // Adjust based on your layout needs
    backgroundColor: "#0078A8", // Blue background
    borderRadius: 50, // Circular shape
    width: 56, // Diameter
    height: 56, // Diameter
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Optional for shadow
  },
  reportActions: {
    flexDirection: "row", // Ensure actions are in a row
    alignItems: "center",
    marginRight: 20,
  },
  reportTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1, // Allows the title to take up space
    marginLeft: 20,
  },

  editIcon: {
    cursor: "pointer",
    marginLeft: 8,
    width: 40,
    height: 40,
  },
  timeTextValdiate: {
    color: "#115272",
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#FF5B5B",
    padding: 12,
    borderRadius: 4,
    color: "#FFF",
    border: "none",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#0078A8",
    padding: 12,
    borderRadius: 4,
    color: "#FFF",
    border: "none",
    cursor: "pointer",
  },
  buttonText: {
    // Add this line for the button text style
    color: "#FFF", // Text color
    fontSize: 16, // Text size
    textAlign: "center", // Center align the text
  },

  inputField: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  buttonContainereditReport: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButtoneditReport: {
    borderWidth: 2, // Add border width
    // Set the border color
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 20, // Rounded corners
    flex: 1,
    marginRight: 10,
    alignItems: "center", // Center the text
    backgroundColor: "transparent", // Center the text
  },
  submitButtoneditReport: {
    backgroundColor: "#115272",
    paddingVertical: 10, // Vertical padding for more height
    paddingHorizontal: 20, // Horizontal padding for more width
    borderRadius: 20, // Increased radius for capsule shape
    flex: 1,
    alignItems: "center", // Center the text
  },
  buttonTexteditReport: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
});

export { webstyles };
