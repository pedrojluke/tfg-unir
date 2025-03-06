import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  List,
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

      navigation.navigate("Menú Principal", { refresh: true });
    } catch (error) {
      console.error("Error saving paso: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title title={isEditing ? "Editar Paso" : "Añadir Paso"} />
          <Card.Content>
            <TextInput
              label="Nombre del Paso"
              value={nombre}
              onChangeText={setNombre}
              style={{ marginBottom: 10 }}
              mode="outlined"
            />
            <TextInput
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              style={{ marginBottom: 10 }}
              mode="outlined"
            />
          </Card.Content>
        </Card>
        <Divider style={{ marginVertical: 20 }} />
        <Card>
          <Card.Title title="Trabajaderas" />
          <Card.Content>
            <TextInput
              label="Altura"
              value={altura}
              onChangeText={setAltura}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Huecos"
              value={huecos}
              onChangeText={setHuecos}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="contained"
              onPress={addTrabajadera}
              style={{ marginBottom: 10 }}
            >
              Añadir Trabajadera
            </Button>
            {trabajaderas.length > 0 ? (
              trabajaderas.map((trabajadera) => (
                <List.Item
                  key={trabajadera.id}
                  title={`Altura: ${trabajadera.altura} cm - Huecos: ${trabajadera.huecos}`}
                />
              ))
            ) : (
              <Text
                style={{ textAlign: "center", color: theme.colors.secondary }}
              >
                No hay trabajaderas añadidas
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          onPress={savePaso}
          disabled={loading}
          style={styles.fixedButton}
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
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Espacio para el botón fijo
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
    backgroundColor: "#4B0082", // Color morado cofrade
  },
});

export default AddPasoScreen;
