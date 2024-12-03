import {
  Appbar,
  FAB,
  List,
  Provider as PaperProvider,
} from "react-native-paper";
import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";

import firestore from "@react-native-firebase/firestore";
import { style } from "./homeStyle";

export default function HomeScreen({ navigation }) {
  const [tronos, setTronos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("tronos")
      .onSnapshot((snapshot) => {
        const tronoList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTronos(tronoList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Tronos de Semana Santa" />
      </Appbar.Header>
      <View style={style.container}>
        {!loading && (
          <FlatList
            data={tronos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.nombre}
                description={`Trabajaderas: ${item.trabajaderas}`}
                left={(props) => <List.Icon {...props} icon="cross" />}
              />
            )}
          />
        )}
        <FAB
          style={style.fab}
          icon="plus"
          label="Nuevo Trono"
          onPress={() => navigation.navigate("NewTrono")}
        />
      </View>
    </PaperProvider>
  );
}
