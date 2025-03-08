import {
  ActivityIndicator,
  Button,
  Card,
  List,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

import munkres from "munkres-js";

const AsignarCostalerosScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const db = getFirestore();

  const pasoId = route.params?.pasoId || null;
  const ensayoId = route.params?.ensayoId || null;
  const asistencia = route.params?.asistencia || [];

  if (!pasoId || !ensayoId || asistencia.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          ❌ Error: Datos no recibidos correctamente.
        </Text>
      </View>
    );
  }

  const [costalerosDetalles, setCostalerosDetalles] = useState([]);
  const [trabajaderas, setTrabajaderas] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTrabajadera, setSelectedTrabajadera] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingPosition, setSelectingPosition] = useState(null);
  const [modalSelectVisible, setModalSelectVisible] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pasoId, asistencia]);

  const fetchData = async () => {
    try {
      const costalerosRef = collection(db, "usuarios");
      const costalerosQuery = query(
        costalerosRef,
        where("rol", "==", "costalero"),
        where("pasoId", "==", pasoId)
      );
      const costalerosSnapshot = await getDocs(costalerosQuery);
      let detallesArray = costalerosSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((costalero) => asistencia.includes(costalero.id))
        .sort((a, b) => a.altura - b.altura);

      setCostalerosDetalles(detallesArray);

      const trabajaderasRef = collection(
        doc(db, "pasos", pasoId),
        "trabajaderas"
      );
      const trabajaderasSnapshot = await getDocs(trabajaderasRef);
      let trabajaderasArray = trabajaderasSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.orden - b.orden || a.altura - b.altura);

      setTrabajaderas(trabajaderasArray);

      let asignacionesIniciales = {};
      trabajaderasArray.forEach((t) => {
        asignacionesIniciales[t.id] = Array(t.huecos).fill(null);
      });
      setAsignaciones(asignacionesIniciales);
    } catch (error) {
      console.error("🔥 Error en Firestore:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalTrabajadera = (trabajadera) => {
    setSelectedTrabajadera(trabajadera);
    setModalVisible(true);
  };

  const abrirModalSeleccionCostalero = (posicion) => {
    setSelectingPosition(posicion);
    setModalSelectVisible(true);
  };

  const asignarCostalero = (costalero) => {
    if (!selectedTrabajadera) return;

    setAsignaciones((prev) => ({
      ...prev,
      [selectedTrabajadera.id]: prev[selectedTrabajadera.id].map((c, i) =>
        i === selectingPosition ? costalero : c
      ),
    }));

    setModalSelectVisible(false);
  };

  const costalerosDisponibles = () => {
    if (!selectedTrabajadera) return [];

    const alturaTrabajadera = selectedTrabajadera.altura;
    const limiteInferior = alturaTrabajadera - 10;

    const asignados = Object.values(asignaciones).flat();

    return costalerosDetalles
      .filter((c) => !asignados.some((a) => a?.id === c.id)) // Excluir ya asignados
      .filter(
        (c) => c.altura >= limiteInferior && c.altura <= alturaTrabajadera
      ); // Excluir fuera del rango
  };

  const borrarAsignacion = (trabajaderaId, posicion) => {
    setAsignaciones((prev) => {
      const nuevaAsignacion = [...prev[trabajaderaId]];
      nuevaAsignacion[posicion] = null; // Se deja vacío

      return {
        ...prev,
        [trabajaderaId]: nuevaAsignacion,
      };
    });
  };

  const asignarAutomaticamente = () => {
    setLoadingAssign(true);
    try {
      let noAsignados = costalerosDetalles.filter(
        (c) =>
          !Object.values(asignaciones)
            .flat()
            .some((a) => a?.id === c.id)
      );

      let costoMatriz = [];
      let huecosArray = [];

      trabajaderas.forEach((t) => {
        for (let i = 0; i < t.huecos; i++) {
          if (!asignaciones[t.id][i]) {
            huecosArray.push({ trabajadera: t, posicion: i });
          }
        }
      });

      noAsignados.forEach((c) => {
        let fila = huecosArray.map((h) =>
          c.altura <= h.trabajadera.altura
            ? Math.abs(c.altura - h.trabajadera.altura)
            : Infinity
        );
        costoMatriz.push(fila);
      });

      const asignacionesMunkres = munkres(costoMatriz);

      let nuevasAsignaciones = { ...asignaciones };

      asignacionesMunkres.forEach(([costaleroIndex, huecoIndex]) => {
        let costalero = noAsignados[costaleroIndex];
        let hueco = huecosArray[huecoIndex];

        if (costalero && hueco) {
          nuevasAsignaciones[hueco.trabajadera.id][hueco.posicion] = costalero;
        }
      });

      setAsignaciones(nuevasAsignaciones);
    } catch {
    } finally {
      setLoadingAssign(false);
    }
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
        <ScrollView>
          {trabajaderas.map((trabajadera) => (
            <Card
              key={trabajadera.id}
              style={[styles.trabajaderaCard]}
              onPress={() => abrirModalTrabajadera(trabajadera)}
            >
              <Card.Title
                title={`Trabajadera ${trabajadera.orden} (${trabajadera.altura} cm)`}
                subtitle={`Huecos: ${trabajadera.huecos}`}
                titleStyle={{ color: "white" }}
                subtitleStyle={{ color: "white" }}
              />
            </Card>
          ))}
          <Button
            mode="contained"
            style={styles.unassignedButton}
            onPress={() => {}}
          >
            Ver Costaleros No Asignados
          </Button>

          <Button
            mode="contained"
            style={styles.assignButton}
            onPress={asignarAutomaticamente}
            disabled={loadingAssign}
          >
            Asignar Automáticamente
          </Button>
        </ScrollView>
      )}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: "white" }]}
        >
          <Text style={styles.modalTitle}>
            Costaleros en Trabajadera {selectedTrabajadera?.orden}
          </Text>
          {selectedTrabajadera &&
            asignaciones[selectedTrabajadera.id]?.map((c, i) => {
              const suplemento =
                c && c.altura < selectedTrabajadera.altura
                  ? ` (+${selectedTrabajadera.altura - c.altura} cm)`
                  : "";
              return (
                <List.Item
                  key={i}
                  title={
                    c ? `${c.nombre} ${c.apellidos}${suplemento}` : "Vacío"
                  }
                  right={() => (
                    <View style={{ flexDirection: "row", gap: 5 }}>
                      {c && (
                        <Button
                          mode="text"
                          textColor="red"
                          onPress={() =>
                            borrarAsignacion(selectedTrabajadera.id, i)
                          }
                        >
                          Borrar
                        </Button>
                      )}
                      <Button
                        mode="text"
                        onPress={() => abrirModalSeleccionCostalero(i)}
                      >
                        Asignar
                      </Button>
                    </View>
                  )}
                />
              );
            })}
        </Modal>

        <Modal
          visible={modalSelectVisible}
          onDismiss={() => setModalSelectVisible(false)}
          contentContainerStyle={[
            styles.fullScreenModal,
            { backgroundColor: "white" },
          ]}
        >
          <Text style={styles.modalTitle}>Seleccionar Costalero</Text>
          <ScrollView contentContainerStyle={styles.scrollModal}>
            {costalerosDisponibles().map((costalero) => {
              const suplemento =
                costalero.altura < selectedTrabajadera.altura
                  ? ` (+${selectedTrabajadera.altura - costalero.altura} cm)`
                  : "";
              return (
                <List.Item
                  key={costalero.id}
                  title={`${costalero.nombre} ${costalero.apellidos}${suplemento}`}
                  onPress={() => asignarCostalero(costalero)}
                />
              );
            })}
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  trabajaderaCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#6200EE",
  },
  modal: {
    backgroundColor: "white",
    padding: 5,
    margin: 20,
    borderRadius: 10,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  scrollModal: {
    flexGrow: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  unassignedButton: { marginTop: 20, backgroundColor: "red" },

  unassignedButton: {
    marginTop: 20,
    backgroundColor: "red",
  },
  assignButton: {
    marginTop: 20,
    backgroundColor: "#03A9F4",
  },
});

export default AsignarCostalerosScreen;
