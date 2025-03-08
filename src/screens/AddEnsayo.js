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
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { db } from "../service/firebase";

const AddEnsayo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, ensayoId } = route.params || {}; // Puede ser undefined si es nuevo
  const theme = useTheme();

  const [fechaEnsayo, setFechaEnsayo] = useState(new Date());
  const [costaleros, setCostaleros] = useState([]);
  const [asistencia, setAsistencia] = useState([]); // Costaleros seleccionados
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Modo edición

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
      const costalerosList = costalerosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCostaleros(costalerosList.sort((a, b) => a.altura - b.altura));
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

        // Esperar a que se carguen los costaleros antes de marcar los seleccionados
        const costalerosRef = collection(db, "usuarios");
        const q = query(
          costalerosRef,
          where("pasoId", "==", pasoId),
          where("rol", "==", "costalero")
        );
        const costalerosSnap = await getDocs(q);
        const costalerosList = costalerosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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

  const toggleAsistencia = (costaleroId) => {
    setAsistencia((prevAsistencia) =>
      prevAsistencia.includes(costaleroId)
        ? prevAsistencia.filter((id) => id !== costaleroId)
        : [...prevAsistencia, costaleroId]
    );
  };

  const saveEnsayo = async () => {
    try {
      setLoading(true);
      const ensayoRef = ensayoId
        ? doc(db, `pasos/${pasoId}/ensayos/${ensayoId}`)
        : collection(db, `pasos/${pasoId}/ensayos`);

      if (ensayoId) {
        await updateDoc(ensayoRef, {
          fecha: dayjs(fechaEnsayo).format("YYYY-MM-DD"),
          costaleros: asistencia,
        });
      } else {
        await addDoc(ensayoRef, {
          fecha: dayjs(fechaEnsayo).format("YYYY-MM-DD"),
          costaleros: asistencia,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving ensayo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? ( // 🔴 Muestra el spinner si estamos cargando datos en modo edición
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
              {costaleros.length > 0 ? (
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
                      onPress={() => toggleAsistencia(costalero.id)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noDataText}>
                  No hay costaleros registrados
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Contador de Costaleros Seleccionados */}
          <View style={styles.counterContainer}>
            <Card style={styles.counterCard}>
              <Card.Content>
                <Text style={styles.counterText}>
                  Costaleros Seleccionados: {asistencia.length}
                </Text>
              </Card.Content>
            </Card>

            {/* Botón Asignar Costaleros */}
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate("AsignarCostaleros", {
                  pasoId,
                  ensayoId,
                  asistencia,
                })
              }
              style={styles.assignButton}
              labelStyle={styles.buttonText}
              disabled={
                asistencia.length === 0 ||
                dayjs(fechaEnsayo).isBefore(dayjs(), "day")
              }
            >
              Asignar Costaleros
            </Button>
          </View>
        </ScrollView>
      )}

      {/* Botón Guardar/Actualizar Ensayo */}
      {!loading && (
        <View style={styles.fixedButtonContainer}>
          <Button
            mode="contained"
            onPress={saveEnsayo}
            disabled={loading}
            style={styles.fixedButton}
            labelStyle={styles.buttonText}
          >
            {loading ? (
              <ActivityIndicator animating={true} color="#ffffff" />
            ) : isEditing ? (
              "Actualizar Ensayo"
            ) : (
              "Guardar Ensayo"
            )}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Ajustado para evitar solapamiento con el botón de guardar
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
  counterContainer: {
    marginTop: 30, // 🔴 Espacio entre la lista de asistencia y el contador
    alignItems: "center",
  },
  counterCard: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    width: "90%",
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  assignButton: {
    backgroundColor: "#03A9F4", // Azul para diferenciarlo del botón de guardar
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10, // 🔴 Espacio entre el contador y el botón "Asignar Costaleros"
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20, // 🔴 Asegura que está completamente al fondo
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fixedButton: {
    backgroundColor: "#6200EE",
    width: "90%",
    borderRadius: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#000",
    marginTop: 20,
  },
});

export default AddEnsayo;
