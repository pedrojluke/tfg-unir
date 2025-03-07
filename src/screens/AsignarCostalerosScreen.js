import { StyleSheet, Text, View } from "react-native";

import React from "react";

const AsignarCostalerosScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Costaleros</Text>
      {/* Aquí irá la lógica de asignación */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    textTransform: "uppercase",
  },
});

export default AsignarCostalerosScreen; // EXPORTACIÓN CORRECTA
