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
  const [asistencia, setAsistencia] = useState([]);
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
      await addDoc(collection(db, `pasos/${pasoId}/ensayos`), {
        fecha: dayjs(fechaEnsayo).format("YYYY-MM-DD"),
        costaleros: asistencia,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error saving ensayo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Nuevo Ensayo</Text>

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
            {loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                color={theme.colors.primary}
              />
            ) : costaleros.length > 0 ? (
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
                    style={styles.listItem} // No aplica sombreado al seleccionar
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
          labelStyle={styles.buttonText}
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
    backgroundColor: "#F7F7F7",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
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
  listContainer: {
    maxHeight: 350, // Aumenta la altura de la lista de costaleros
  },
  scrollableList: {
    maxHeight: 350, // Scroll dentro de la tarjeta si hay muchos costaleros
  },
  listItem: {
    backgroundColor: "#FFFFFF", // No cambia de color al seleccionar
    borderRadius: 5,
    marginBottom: 5,
  },
  counterCard: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 30,
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
    color: "#000000",
    marginTop: 20,
  },
});

export default AddEnsayo;
