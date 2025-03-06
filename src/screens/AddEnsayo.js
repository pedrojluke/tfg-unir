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
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs"; // Para formatear fechas
import { db } from "../service/firebase";

const AddEnsayo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId } = route.params;
  const theme = useTheme();

  const [fechaEnsayo, setFechaEnsayo] = useState(new Date());
  const [costaleros, setCostaleros] = useState([]);
  const [asistencia, setAsistencia] = useState([]); // Ahora usamos un array
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchCostaleros();
  }, []);

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

      setCostaleros(costalerosList);
    } catch (error) {
      console.error("Error fetching costaleros: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar/desmarcar la asistencia de un costalero
  const toggleAsistencia = (costaleroId) => {
    console.log("Pulsando costalero numero: ", costaleroId);
    setAsistencia((prevAsistencia) => {
      if (prevAsistencia.includes(costaleroId)) {
        return prevAsistencia.filter((id) => id !== costaleroId); // Quitar si ya estaba
      } else {
        return [...prevAsistencia, costaleroId]; // Agregar si no estaba
      }
    });
  };

  const saveEnsayo = async () => {
    try {
      setLoading(true);

      await addDoc(collection(db, `pasos/${pasoId}/ensayos`), {
        fecha: dayjs(fechaEnsayo).format("YYYY-MM-DD"), // Fecha en formato correcto
        costaleros: asistencia, // IDs de costaleros que asistieron
      });

      navigation.goBack(); // Volver automáticamente a EnsayosMenu
    } catch (error) {
      console.error("Error saving ensayo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title title="Nuevo Ensayo" />
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
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
          </Card.Content>
        </Card>

        <Card style={styles.listCard}>
          <Card.Title title="Asistencia de Costaleros" />
          <Card.Content>
            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                color={theme.colors.primary}
              />
            ) : costaleros.length > 0 ? (
              costaleros.map((costalero) => (
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
                  onPress={() => toggleAsistencia(costalero.id)} // Mueve la lógica de selección aquí
                />
              ))
            ) : (
              <Text style={styles.noDataText}>
                No hay costaleros registrados
              </Text>
            )}
          </Card.Content>
        </Card>
        {/* Contador de Costaleros Seleccionados */}
        <Card style={styles.counterCard}>
          <Card.Content>
            <Text style={styles.counterText}>
              Costaleros Seleccionados: {asistencia.length}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={saveEnsayo}
          disabled={loading}
          style={styles.fixedButton}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="#ffffff" />
          ) : (
            "Guardar Ensayo"
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  dateButton: {
    marginBottom: 10,
    backgroundColor: "#4B0082", // Morado cofrade
  },
  listCard: {
    marginTop: 20,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  fixedButton: {
    backgroundColor: "#4B0082",
  },
  noDataText: {
    textAlign: "center",
    color: "#000000",
    marginTop: 20,
  },
});

export default AddEnsayo;
