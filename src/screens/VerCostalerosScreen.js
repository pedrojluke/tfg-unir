import {
  ActivityIndicator,
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

      // Ordenar manualmente por altura en ascendente
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
      <TextInput
        label="Buscar Costalero"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={styles.searchBar}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title title="Lista de Costaleros" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  searchBar: {
    margin: 20,
  },
  noDataText: {
    textAlign: "center",
    color: "#000000",
    marginTop: 20,
  },
});

export default VerCostalerosScreen;
