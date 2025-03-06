import {
  ActivityIndicator,
  Button,
  Card,
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

  // Recargar la lista de ensayos cada vez que la pantalla reciba el foco
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
        <Card>
          <Card.Title title={`Ensayos de ${nombrePaso}`} />
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Crear Ensayo", { pasoId })}
              style={styles.createButton}
            >
              Crear Ensayo
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.listCard}>
          <Card.Title title="Lista de Ensayos" />
          <Card.Content>
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
                    navigation.navigate("DetalleEnsayo", {
                      ensayoId: ensayo.id,
                    })
                  }
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay ensayos registrados</Text>
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
  createButton: {
    marginVertical: 10,
    backgroundColor: "#4B0082", // Morado cofrade
  },
  listCard: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: "center",
    color: "#000000",
    marginTop: 20,
  },
});

export default EnsayosMenu;
