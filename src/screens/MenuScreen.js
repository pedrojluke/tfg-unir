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
              labelStyle={styles.pasoButtonText}
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

      {/* Botón de añadir paso con un color diferenciado */}
      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Añadir Paso")}
          style={styles.addButton}
          labelStyle={styles.addButtonText}
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
    backgroundColor: "#F7F7F7", // Fondo claro y neutro
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
    backgroundColor: "#6200EE", // Morado elegante
    borderRadius: 10,
    elevation: 2, // Sombra ligera
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
    backgroundColor: "#B8860B", // Un tono diferenciado (rojo-anaranjado)
    width: "90%",
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default MenuScreen;
