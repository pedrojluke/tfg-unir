import { StyleSheet } from "react-native";

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  pasoButton: {
    width: "90%",
    marginBottom: 15,
    backgroundColor: "#6200EE",
    borderRadius: 10,
    elevation: 2,
  },
  pasoButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    backgroundColor: "#B8860B",
    width: "90%",
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default mainStyles;
