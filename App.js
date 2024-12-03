import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";

import { db } from "./src/service/firebase";

const App = () => {
  const [message, setMessage] = useState("");

  const insertData = async () => {
    try {
      await addDoc(collection(db, "mensaje"), {
        text: "exampleMessage",
        timestamp: new Date(),
      });

      console.log("Paso guardado correctamente en Firestore.");
    } catch (error) {
      console.error("Error al guardar el paso en Firestore:", error);
    }
  };

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mensaje"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mensaje recuperado:</Text>
      <Text style={styles.message}>{message || "Sin mensaje aún"}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Insertar Dato" onPress={insertData} />
        <Button title="Recuperar Dato" onPress={getData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    color: "blue",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default App;
