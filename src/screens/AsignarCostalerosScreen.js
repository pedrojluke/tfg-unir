import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const AsignarCostalerosScreen = ({ route }) => {
  const { pasoId, asistencia } = route.params;
  const [costalerosDetalles, setCostalerosDetalles] = useState([]);

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

    const fetchCostalerosDetalles = async () => {
      const db = getFirestore();
      const costalerosRef = collection(db, "usuarios");
      const q = query(
        costalerosRef,
        where("rol", "==", "costalero"),
        where("pasoId", "==", pasoId)
      );

      try {
        const querySnapshot = await getDocs(q);
        const todosLosCostaleros = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📋 Costaleros en Firestore:", todosLosCostaleros);
        console.log("📌 Asistencia recibida:", asistencia);

        // 🔍 Verificar si los IDs coinciden en formato
        const detallesArray = todosLosCostaleros.filter((costalero) =>
          asistencia.includes(costalero.id)
        );

        console.log("✅ Costaleros filtrados por asistencia:", detallesArray);
        setCostalerosDetalles(detallesArray);
      } catch (error) {
        console.error("🔥 Error en la consulta a Firestore:", error.message);
      }
    };

    fetchCostalerosDetalles();
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
    </View>
  );
};

export default AsignarCostalerosScreen;
