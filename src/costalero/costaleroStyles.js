import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  input: { marginBottom: 15, backgroundColor: "#FFF" },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  saveButton: { backgroundColor: "#6200EE", width: "90%", borderRadius: 10 },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
});

export default styles;
