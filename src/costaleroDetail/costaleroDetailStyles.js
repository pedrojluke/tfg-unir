import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  listCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 2,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#6200EE",
    width: "90%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default styles;
