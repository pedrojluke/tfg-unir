import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import { db } from "../service/firebase";

const AddPasoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const pasoId = route.params?.pasoId || null;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [trabajaderas, setTrabajaderas] = useState([]);
  const [altura, setAltura] = useState("");
  const [orden, setOrden] = useState("");
  const [huecos, setHuecos] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingTrabajadera, setAddingTrabajadera] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (pasoId) {
      loadPasoData();
      loadTrabajaderas();
    }
  }, [pasoId]);

  const loadPasoData = async () => {
    setLoading(true);
    try {
      const pasoRef = doc(db, "pasos", pasoId);
      const pasoSnap = await getDoc(pasoRef);
      if (pasoSnap.exists()) {
        const data = pasoSnap.data();
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error loading paso data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrabajaderas = async () => {
    try {
      const trabajaderasRef = collection(db, `pasos/${pasoId}/trabajaderas`);
      const trabajaderasSnap = await getDocs(trabajaderasRef);
      const trabajaderasList = trabajaderasSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por orden de menor a mayor
      setTrabajaderas(trabajaderasList.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error("Error loading trabajaderas: ", error);
    }
  };

  const addTrabajadera = async () => {
    if (!altura || !huecos || !orden) return;

    setAddingTrabajadera(true);

    const newTrabajadera = {
      id: Date.now(),
      altura: parseInt(altura),
      orden: parseInt(orden),
      huecos: parseInt(huecos),
    };

    setTrabajaderas(
      [...trabajaderas, newTrabajadera].sort((a, b) => a.orden - b.orden)
    );

    setAltura("");
    setOrden("");
    setHuecos("");

    setAddingTrabajadera(false);
  };

  const removeTrabajadera = (id) => {
    setTrabajaderas(
      trabajaderas.filter((trabajadera) => trabajadera.id !== id)
    );
  };

  const savePaso = async () => {
    if (!nombre || !descripcion || loading) return;
    setLoading(true);
    try {
      let pasoRef;
      if (isEditing) {
        pasoRef = doc(db, "pasos", pasoId);
        await updateDoc(pasoRef, { nombre, descripcion });

        // 🔥 Eliminar todas las trabajaderas antes de guardar las nuevas
        const trabajaderasRef = collection(db, `pasos/${pasoId}/trabajaderas`);
        const trabajaderasSnap = await getDocs(trabajaderasRef);
        for (const docSnapshot of trabajaderasSnap.docs) {
          await deleteDoc(
            doc(db, `pasos/${pasoId}/trabajaderas`, docSnapshot.id)
          );
        }
      } else {
        pasoRef = await addDoc(collection(db, "pasos"), {
          nombre,
          descripcion,
        });
      }

      // 🔄 Guardar nuevamente las trabajaderas en orden
      for (const trabajadera of trabajaderas) {
        await addDoc(collection(db, `pasos/${pasoRef.id}/trabajaderas`), {
          altura: trabajadera.altura,
          orden: trabajadera.orden,
          huecos: trabajadera.huecos,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving paso: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isEditing ? "Editar Paso" : "Añadir Paso"}
        </Text>

        <TextInput
          label="Nombre del Paso"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.sectionTitle}>Trabajaderas</Text>

        <View style={styles.row}>
          <TextInput
            label="Altura"
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="Orden"
            value={orden}
            onChangeText={setOrden}
            keyboardType="numeric"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <TextInput
          label="Huecos"
          value={huecos}
          onChangeText={setHuecos}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={addTrabajadera}
          style={styles.createButton}
          labelStyle={styles.buttonText}
          disabled={addingTrabajadera}
        >
          {addingTrabajadera ? (
            <ActivityIndicator animating={true} color="#ffffff" />
          ) : (
            "Añadir Trabajadera"
          )}
        </Button>

        {trabajaderas.length > 0 &&
          trabajaderas.map((trabajadera) => (
            <Card key={trabajadera.id} style={styles.trabajaderaCard}>
              <Card.Content style={styles.trabajaderaRow}>
                <Text style={styles.trabajaderaText}>
                  Orden: {trabajadera.orden} | Altura: {trabajadera.altura} cm |
                  Huecos: {trabajadera.huecos}
                </Text>
                <TouchableOpacity
                  onPress={() => removeTrabajadera(trabajadera.id)}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={savePaso}
          disabled={loading}
          style={styles.createButton}
          labelStyle={styles.buttonText}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="#ffffff" />
          ) : isEditing ? (
            "Actualizar Paso"
          ) : (
            "Guardar Paso"
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
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  createButton: {
    width: "90%",
    backgroundColor: "#6200EE",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default AddPasoScreen;
