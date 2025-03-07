import {
  ActivityIndicator,
  Button,
  Card,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { db } from "../service/firebase";

const VerCostalerosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId } = route.params;
  const theme = useTheme();

  const [costaleros, setCostaleros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchCostaleros();
    }, [])
  );

  const fetchCostaleros = async () => {
    try {
      setLoading(true);
      const costalerosRef = collection(db, "usuarios");
      const q = query(
        costalerosRef,
        where("pasoId", "==", pasoId),
        where("rol", "==", "costalero")
      );
      const costalerosSnap = await getDocs(q);
      let costalerosList = costalerosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ordenar por altura ascendente
      costalerosList = costalerosList.sort((a, b) => a.altura - b.altura);

      setCostaleros(costalerosList);
    } catch (error) {
      console.error("Error fetching costaleros: ", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCostaleros = costaleros.filter((costalero) =>
    `${costalero.nombre} ${costalero.apellidos}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Costaleros</Text>

        <TextInput
          label="Buscar Costalero"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchBar}
        />

        <Card style={styles.listCard}>
          <Card.Content>
            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                color={theme.colors.primary}
              />
            ) : filteredCostaleros.length > 0 ? (
              filteredCostaleros.map((costalero) => (
                <List.Item
                  key={costalero.id}
                  title={`${costalero.nombre} ${costalero.apellidos}`}
                  description={`Tel: ${costalero.telefono} - Altura: ${costalero.altura} cm`}
                  left={(props) => <List.Icon {...props} icon="account" />}
                  onPress={() =>
                    navigation.navigate("Añadir Costalero", {
                      costaleroId: costalero.id,
                      pasoId,
                    })
                  }
                />
              ))
            ) : (
              <Text style={styles.noDataText}>
                No hay costaleros registrados
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Añadir Costalero", { pasoId })}
          style={styles.addButton}
          labelStyle={styles.buttonText}
        >
          Añadir Costalero
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  searchBar: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  listCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 2, // Sombra ligera para resaltar la lista
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
    backgroundColor: "#6200EE", // Morado elegante
    width: "90%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default VerCostalerosScreen;
