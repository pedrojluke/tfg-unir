import {
  ActivityIndicator,
  Button,
  Card,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { db } from "../service/firebase";

const AddEnsayo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, ensayoId } = route.params || {};
  const theme = useTheme();

  const [fechaEnsayo, setFechaEnsayo] = useState(new Date());
  const [costaleros, setCostaleros] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCostaleros();
    if (ensayoId) {
      setIsEditing(true);
      loadEnsayoDetails();
    }
  }, [ensayoId]);

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

      // 🔥 Ordenar por altura ascendente
      costalerosList.sort((a, b) => a.altura - b.altura);

      setCostaleros(costalerosList);
    } catch (error) {
      console.error("Error fetching costaleros: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnsayoDetails = async () => {
    try {
      setLoading(true);
      const ensayoRef = doc(db, `pasos/${pasoId}/ensayos/${ensayoId}`);
      const ensayoSnap = await getDoc(ensayoRef);

      if (ensayoSnap.exists()) {
        const ensayoData = ensayoSnap.data();
        setFechaEnsayo(dayjs(ensayoData.fecha).toDate());

        // Obtener costaleros y ordenarlos por altura
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

        costalerosList.sort((a, b) => a.altura - b.altura);
        setCostaleros(costalerosList);

        // Filtrar los costaleros que están en el ensayo y marcarlos
        const costalerosSeleccionados = costalerosList
          .filter((costalero) => ensayoData.costaleros.includes(costalero.id))
          .map((c) => c.id);

        setAsistencia(costalerosSeleccionados);
      }
    } catch (error) {
      console.error("Error loading ensayo details: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando ensayo...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            {isEditing ? "Editar Ensayo" : "Nuevo Ensayo"}
          </Text>

          <Button
            mode="contained"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
            labelStyle={styles.buttonText}
          >
            Seleccionar Fecha: {dayjs(fechaEnsayo).format("DD/MM/YYYY")}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={fechaEnsayo}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setFechaEnsayo(selectedDate);
              }}
            />
          )}

          <Card style={styles.listCard}>
            <Card.Title title="Asistencia de Costaleros" />
            <Card.Content style={styles.listContainer}>
              <ScrollView style={styles.scrollableList}>
                {costaleros.map((costalero) => (
                  <List.Item
                    key={costalero.id}
                    title={`${costalero.nombre} ${costalero.apellidos}`}
                    description={`Altura: ${costalero.altura} cm`}
                    left={(props) => <List.Icon {...props} icon="account" />}
                    right={(props) => (
                      <List.Icon
                        {...props}
                        icon={
                          asistencia.includes(costalero.id)
                            ? "check-circle"
                            : "checkbox-blank-circle-outline"
                        }
                        color={
                          asistencia.includes(costalero.id)
                            ? theme.colors.primary
                            : "#ccc"
                        }
                      />
                    )}
                    onPress={() =>
                      setAsistencia((prevAsistencia) =>
                        prevAsistencia.includes(costalero.id)
                          ? prevAsistencia.filter((id) => id !== costalero.id)
                          : [...prevAsistencia, costalero.id]
                      )
                    }
                  />
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  dateButton: {
    marginBottom: 10,
    backgroundColor: "#6200EE",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listCard: {
    marginTop: 20,
  },
  scrollableList: {
    maxHeight: 350,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AddEnsayo;
