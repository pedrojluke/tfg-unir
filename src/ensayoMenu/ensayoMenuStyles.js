import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  createButton: {
    width: "90%",
    backgroundColor: "#6200EE",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    width: "100%",
  },
  ensayoCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  ensayoPasado: {
    backgroundColor: "#FFCCCC",
  },
  ensayoFecha: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  ensayoSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default styles;
