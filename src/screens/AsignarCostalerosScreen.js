import {
  ActivityIndicator,
  Card,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native"; // 🔥 Asegurar que route está disponible

import munkres from "munkres-js";

const AsignarCostalerosScreen = () => {
  const route = useRoute(); // 🔥 Se obtiene route correctamente
  const navigation = useNavigation();

  // 🔥 Se manejan los parámetros de manera segura
  const { pasoId, asistencia } = route?.params || {
    pasoId: null,
    asistencia: [],
  };

  if (!pasoId || !asistencia) {
    console.warn("⚠️ Error: pasoId o asistencia no recibidos");
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          ❌ Error: No se han recibido los datos necesarios.
        </Text>
      </View>
    );
  }

  const theme = useTheme();
  const flatListRef = useRef(null);

  const [costalerosDetalles, setCostalerosDetalles] = useState([]);
  const [trabajaderas, setTrabajaderas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [pasoId, asistencia]);

  const fetchData = async () => {
    const db = getFirestore();

    try {
      const costalerosRef = collection(db, "usuarios");
      const costalerosQuery = query(
        costalerosRef,
        where("rol", "==", "costalero"),
        where("pasoId", "==", pasoId)
      );
      const costalerosSnapshot = await getDocs(costalerosQuery);
      let todosLosCostaleros = costalerosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let detallesArray = todosLosCostaleros.filter((costalero) =>
        asistencia.includes(costalero.id)
      );

      detallesArray.sort((a, b) => a.altura - b.altura);
      setCostalerosDetalles(detallesArray);

      const pasoDocRef = doc(db, "pasos", pasoId);
      const trabajaderasRef = collection(pasoDocRef, "trabajaderas");
      const trabajaderasSnapshot = await getDocs(trabajaderasRef);
      let trabajaderasArray = trabajaderasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      trabajaderasArray.sort(
        (a, b) => a.orden - b.orden || a.altura - b.altura
      );
      setTrabajaderas(trabajaderasArray);

      const asignacionesArray = asignarCostalerosATrabajaderas(
        detallesArray,
        trabajaderasArray
      );
      setAsignaciones(asignacionesArray);
    } catch (error) {
      console.error("🔥 Error en la consulta a Firestore:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const asignarCostalerosATrabajaderas = (costaleros, trabajaderas) => {
    let totalHuecos = trabajaderas.reduce((sum, t) => sum + t.huecos, 0);

    if (costaleros.length === 0 || totalHuecos === 0) return [];

    let costMatrix = Array(costaleros.length)
      .fill(null)
      .map(() => Array(totalHuecos).fill(Infinity));

    let huecosArray = [];

    trabajaderas.forEach((trabajadera, tIndex) => {
      for (let i = 0; i < trabajadera.huecos; i++) {
        huecosArray.push({ trabajadera, tIndex });
      }
    });

    costaleros.forEach((costalero, cIndex) => {
      huecosArray.forEach((hueco, hIndex) => {
        if (costalero.altura <= hueco.trabajadera.altura) {
          costMatrix[cIndex][hIndex] = Math.abs(
            costalero.altura - hueco.trabajadera.altura
          );
        }
      });
    });

    const assignment = munkres(costMatrix);

    let asignaciones = assignment.map(([cIndex, hIndex]) => ({
      costalero: costaleros[cIndex],
      trabajadera: huecosArray[hIndex]?.trabajadera || null,
    }));

    return asignaciones.filter((a) => a.trabajadera !== null);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={trabajaderas}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.trabajaderaCard}>
              <Card.Title
                title={`Trabajadera ${item.orden} (${item.altura} cm)`}
                subtitle={`Huecos: ${item.huecos}`}
              />
              <Card.Content>
                {asignaciones
                  .filter((a) => a.trabajadera.id === item.id)
                  .map(({ costalero }) => {
                    const suplemento =
                      costalero.altura < item.altura
                        ? ` (+${item.altura - costalero.altura} cm)`
                        : "";
                    return (
                      <List.Item
                        key={costalero.id}
                        title={`${costalero.nombre} ${costalero.apellidos} ${suplemento}`}
                        description={`Altura: ${costalero.altura} cm`}
                        left={(props) => (
                          <List.Icon {...props} icon="human-male-board" />
                        )}
                      />
                    );
                  })}
              </Card.Content>
            </Card>
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  trabajaderaCard: { width: 300, marginHorizontal: 10 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});

export default AsignarCostalerosScreen;
