import { Button, Card, Title } from "react-native-paper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../service/firebase";

export default function MainScreen({ navigation }) {
  const [pasos, setPasos] = useState([]);

  useEffect(() => {
    const fetchPasos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pasos"));
        const pasosData = querySnapshot.docs.map((doc) => doc.data());
        console.log(pasosData);

        if (Array.isArray(pasosData)) {
          setPasos(pasosData);
        } else {
          console.error("Error al obtener los pasos:", error);
        }
      } catch (error) {
        console.error("Error al obtener los pasos:", error);
      }
    };

    fetchPasos();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Mis Pasos</Title>
        </Card.Content>
      </Card>

      {Array.isArray(pasos) && pasos.length > 0 ? (
        <FlatList
          data={pasos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>{item.nombre}</Title>
                <Text style={styles.text}>{item.descripcion || ""}</Text>{" "}
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("PasoDetail", {
                      pasoId: item.id,
                      pasoNombre: item.nombre,
                    })
                  }
                  style={styles.button}
                >
                  Ver detalles
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No hay pasos disponibles.</Text>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate("CreateEditPasoScreen")}
        style={styles.addButton}
      >
        Añadir Nuevo Paso
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 8,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A148C",
    textAlign: "center",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#03a9f4",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A148C",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#6200ee",
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});
