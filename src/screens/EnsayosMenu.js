import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  useTheme,
} from "react-native-paper";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
      const q = query(ensayosRef, orderBy("fecha", "asc")); // Ordenamos por fecha ascendente
      const ensayosSnap = await getDocs(q);
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

        {/* Lista de Ensayos con Diseño Mejorado */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              color={theme.colors.primary}
            />
          ) : ensayos.length > 0 ? (
            ensayos.map((ensayo) => {
              const esPasado = dayjs(ensayo.fecha).isBefore(dayjs(), "day"); // 🔴 Verifica si el ensayo es pasado
              return (
                <Card
                  key={ensayo.id}
                  style={[styles.ensayoCard, esPasado && styles.ensayoPasado]} // 🔴 Aplica estilo si es pasado
                  onPress={() =>
                    navigation.navigate("AddEnsayo", {
                      pasoId,
                      ensayoId: ensayo.id,
                    })
                  }
                >
                  <Card.Content>
                    <Text style={styles.ensayoFecha}>
                      {dayjs(ensayo.fecha).format("DD/MM/YYYY")}
                    </Text>
                    <Text style={styles.ensayoSubtext}>
                      {ensayo.costaleros.length} costaleros registrados
                    </Text>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Text style={styles.noDataText}>No hay ensayos creados</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
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
    backgroundColor: "#6200EE",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    width: "100%",
  },
  ensayoCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3, // Sombra ligera
  },
  ensayoPasado: {
    backgroundColor: "#FFCCCC", // 🔴 Rojo claro para ensayos pasados
  },
  ensayoFecha: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  ensayoSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default EnsayosMenu;
