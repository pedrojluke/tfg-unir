import * as SETTINGS from "../utils/Settings";

import { Card, Text, TextInput, Title } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../service/firebase";

export default function CostalerosScreen({ navigation, route }) {
  const { pasoId } = route.params;
  const [costaleros, setCostaleros] = useState([]);
  const [filteredCostaleros, setFilteredCostaleros] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCostaleros = async () => {
    const q = query(
      collection(db, "costaleros"),
      where("pasoId", "==", pasoId)
    );
    const costalerosSnapshot = await getDocs(q);
    const costalerosList = costalerosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCostaleros(costalerosList);
    setFilteredCostaleros(costalerosList);
  };

  useEffect(() => {
    fetchCostaleros();
  }, [pasoId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = costaleros.filter((costalero) =>
      `${costalero.nombre} ${costalero.apellidos}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredCostaleros(filtered);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <Card.Content>
          <Title style={styles.title}>Listado de Costaleros</Title>

          <View style={styles.searchContainer}>
            <TextInput
              label="Buscar costalero"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.input}
              mode="outlined"
              right={<TextInput.Icon name="magnify" />}
            />
          </View>

          <FlatList
            data={filteredCostaleros}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                style={styles.card}
                onPress={() =>
                  navigation.navigate("CostaleroDetail", {
                    costaleroId: item.id,
                  })
                }
              >
                <Card.Content>
                  <Title style={styles.cardTitle}>
                    {item.nombre} {item.apellidos} | {item.altura} cm
                  </Title>
                  <Text style={styles.cardText}>{item.telefono}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  cardContainer: {
    borderRadius: 12,
    elevation: 8,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: SETTINGS.COLOURS.textInputBorder,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: SETTINGS.COLOURS.textInputBorder,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
  },
});
