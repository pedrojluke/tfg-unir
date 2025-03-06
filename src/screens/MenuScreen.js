import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { db } from "../service/firebase";

const MenuScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [pasos, setPasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchPasos();
    }, [])
  );

  const fetchPasos = async () => {
    try {
      setLoading(true);
      const pasosCollection = collection(db, "pasos");
      const pasosSnapshot = await getDocs(pasosCollection);
      const pasosList = pasosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPasos(pasosList);
    } catch (error) {
      console.error("Error fetching pasos: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Selecciona un Paso</Text>

        {loading ? (
          <ActivityIndicator
            animating={true}
            size="large"
            color={theme.colors.primary}
          />
        ) : pasos.length > 0 ? (
          pasos.map((paso) => (
            <Button
              key={paso.id}
              mode="contained"
              style={styles.pasoButton}
              onPress={() =>
                navigation.navigate("PasoDetailMenu", {
                  pasoId: paso.id,
                  nombrePaso: paso.nombre,
                })
              }
            >
              {paso.nombre}
            </Button>
          ))
        ) : (
          <Text style={styles.noDataText}>No hay pasos registrados</Text>
        )}
      </ScrollView>

      {/* Botón de añadir paso con color diferente */}
      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Añadir Paso")}
          style={styles.addButton}
        >
          Añadir Paso
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Espacio para el botón fijo
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  pasoButton: {
    marginBottom: 10,
    backgroundColor: "#4B0082", // Morado cofrade para los botones de los pasos
  },
  noDataText: {
    textAlign: "center",
    color: "#000000",
    marginTop: 20,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#008000", // Verde para diferenciar el botón de añadir paso
  },
});

export default MenuScreen;
