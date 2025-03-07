import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
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
  updateDoc,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

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
  const [huecos, setHuecos] = useState("");
  const [loading, setLoading] = useState(false);
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
      setTrabajaderas(trabajaderasList);
    } catch (error) {
      console.error("Error loading trabajaderas: ", error);
    }
  };

  const addTrabajadera = () => {
    if (!altura || !huecos) return;
    setTrabajaderas([
      ...trabajaderas,
      { id: Date.now(), altura: parseInt(altura), huecos: parseInt(huecos) },
    ]);
    setAltura("");
    setHuecos("");
  };

  const savePaso = async () => {
    if (!nombre || !descripcion || loading) return;
    setLoading(true);
    try {
      let pasoRef;
      if (isEditing) {
        pasoRef = doc(db, "pasos", pasoId);
        await updateDoc(pasoRef, { nombre, descripcion });
      } else {
        pasoRef = await addDoc(collection(db, "pasos"), {
          nombre,
          descripcion,
        });
      }

      for (const trabajadera of trabajaderas) {
        await addDoc(collection(db, `pasos/${pasoRef.id}/trabajaderas`), {
          altura: trabajadera.altura,
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

        {/* Sección de trabajaderas */}
        <Text style={styles.sectionTitle}>Trabajaderas</Text>
        <TextInput
          label="Altura"
          value={altura}
          onChangeText={setAltura}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
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
          style={styles.optionButton}
          labelStyle={styles.buttonText}
        >
          Añadir Trabajadera
        </Button>

        {trabajaderas.length > 0 &&
          trabajaderas.map((trabajadera) => (
            <Text key={trabajadera.id} style={styles.trabajaderaText}>
              Altura: {trabajadera.altura} cm - Huecos: {trabajadera.huecos}
            </Text>
          ))}
      </ScrollView>

      {/* Botón para guardar */}
      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={savePaso}
          disabled={loading}
          style={styles.optionButton}
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
    backgroundColor: "#F7F7F7", // Fondo claro y neutro
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
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 20,
  },
  optionButton: {
    width: "90%",
    marginBottom: 15,
    backgroundColor: "#6200EE", // Morado elegante, igual que en los otros menús
    borderRadius: 10,
    alignSelf: "center",
    elevation: 2, // Sombra ligera
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default AddPasoScreen;
