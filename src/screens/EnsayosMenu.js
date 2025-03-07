import {
  ActivityIndicator,
  Button,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import dayjs from "dayjs"; // Para formatear fechas
import { db } from "../service/firebase";

const EnsayosMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, nombrePaso } = route.params;
  const theme = useTheme();

  const [ensayos, setEnsayos] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchEnsayos();
    }, [])
  );

  const fetchEnsayos = async () => {
    try {
      setLoading(true);
      const ensayosRef = collection(db, `pasos/${pasoId}/ensayos`);
      const ensayosSnap = await getDocs(ensayosRef);
      const ensayosList = ensayosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnsayos(ensayosList);
    } catch (error) {
      console.error("Error fetching ensayos: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ensayos de {nombrePaso}</Text>

        {/* Botón Crear Ensayo */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate("AddEnsayo", { pasoId })}
          style={styles.createButton}
          labelStyle={styles.buttonText}
        >
          Crear Ensayo
        </Button>

        {/* Lista de Ensayos */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              color={theme.colors.primary}
            />
          ) : ensayos.length > 0 ? (
            ensayos.map((ensayo) => (
              <List.Item
                key={ensayo.id}
                title={dayjs(ensayo.fecha).format("DD/MM/YYYY")} // Formato de fecha
                onPress={() =>
                  navigation.navigate("DetalleEnsayo", { ensayoId: ensayo.id })
                }
                style={styles.listItem}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No hay ensayos registrados</Text>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  createButton: {
    width: "90%",
    backgroundColor: "#6200EE", // Morado elegante
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2, // Sombra ligera
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    width: "100%",
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2, // Sombra ligera
    paddingHorizontal: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default EnsayosMenu;
