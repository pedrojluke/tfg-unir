import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const AsignarCostalerosScreen = ({ route }) => {
  const { pasoId, asistencia } = route.params;
  const [costalerosDetalles, setCostalerosDetalles] = useState([]);
  const [trabajaderas, setTrabajaderas] = useState([]);

  useEffect(() => {
    console.log("🚀 useEffect ejecutado!");
    console.log("📌 Paso ID recibido:", pasoId);
    console.log("📌 Asistencia recibida:", asistencia);

    if (!pasoId || !asistencia || asistencia.length === 0) {
      console.warn(
        "⚠️ pasoId o asistencia están vacíos, no se ejecutará la consulta."
      );
      return;
    }

    const fetchData = async () => {
      const db = getFirestore();

      try {
        // 🔍 Recuperar costaleros del paso con asistencia
        const costalerosRef = collection(db, "usuarios");
        const costalerosQuery = query(
          costalerosRef,
          where("rol", "==", "costalero"),
          where("pasoId", "==", pasoId)
        );
        const costalerosSnapshot = await getDocs(costalerosQuery);
        const todosLosCostaleros = costalerosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📋 Costaleros en Firestore:", todosLosCostaleros);

        // Filtrar los costaleros según asistencia
        const detallesArray = todosLosCostaleros.filter((costalero) =>
          asistencia.includes(costalero.id)
        );

        console.log("✅ Costaleros filtrados por asistencia:", detallesArray);
        setCostalerosDetalles(detallesArray);

        // 🔍 Recuperar trabajaderas desde la subcolección pasos/{pasoId}/trabajaderas
        const pasoDocRef = doc(db, "pasos", pasoId);
        const trabajaderasRef = collection(pasoDocRef, "trabajaderas");
        const trabajaderasSnapshot = await getDocs(trabajaderasRef);
        const trabajaderasArray = trabajaderasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📋 Trabajaderas en Firestore:", trabajaderasArray);
        setTrabajaderas(trabajaderasArray);
      } catch (error) {
        console.error("🔥 Error en la consulta a Firestore:", error.message);
      }
    };

    fetchData();
  }, [pasoId, asistencia]);

  return (
    <View>
      <Text>Asignación de Costaleros</Text>

      {costalerosDetalles.length > 0 ? (
        costalerosDetalles.map((costalero) => (
          <Text key={costalero.id}>
            {costalero.nombre} {costalero.apellidos} - {costalero.altura} cm
          </Text>
        ))
      ) : (
        <Text>⚠️ No hay costaleros disponibles</Text>
      )}

      <Text>---------------------</Text>
      <Text>Trabajaderas del Paso</Text>

      {trabajaderas.length > 0 ? (
        trabajaderas.map((trabajadera) => (
          <Text key={trabajadera.id}>
            Fila {trabajadera.fila} - Altura: {trabajadera.altura} cm
          </Text>
        ))
      ) : (
        <Text>⚠️ No hay trabajaderas disponibles</Text>
      )}
    </View>
  );
};

export default AsignarCostalerosScreen;
