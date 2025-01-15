import { Appbar, Card, FAB, Paragraph, Title } from "react-native-paper";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../service/firebase";

export default function MainScreen({ navigation }) {
  const [pasos, setPasos] = useState([]);

  const fetchPasos = async () => {
    const pasosCollection = collection(db, "pasos");
    const pasosSnapshot = await getDocs(pasosCollection);
    const pasosList = pasosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPasos(pasosList);
  };

  useEffect(() => {
    fetchPasos();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Mis Pasos" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <FlatList
        data={pasos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PasoDetail", {
                pasoId: item.id,
                pasoNombre: item.nombre,
              })
            }
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.cardTitle}>{item.nombre}</Title>
                </View>
                <Paragraph style={styles.cardSubtitle}>
                  {`Trabajaderas: ${item.trabajaderas.length} | Huecos: ${
                    item.huecos || 0
                  }`}
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        label="Añadir Nuevo Paso"
        onPress={() => navigation.navigate("PasoScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: 20,
  },
  appbar: {
    backgroundColor: "#1c1c1c",
    elevation: 10,
  },
  appbarTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 8,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A148C",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffb300",
    borderRadius: 50,
    elevation: 10,
  },
});
