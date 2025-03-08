import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  useTheme,
} from "react-native-paper";
import { FORMAT, TEXTS } from "./ensayoMenuHelper";
import { ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import React from "react";
import dayjs from "dayjs";
import styles from "./ensayoMenuStyles";
import useEnsayoMenu from "./useEnsayoMenu";

const EnsayoMenuScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, nombrePaso } = route.params;
  const theme = useTheme();
  const { ensayos, loading } = useEnsayoMenu(pasoId);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{`${TEXTS.title} ${nombrePaso}`}</Text>

        <Button
          mode={FORMAT.contained}
          onPress={() => navigation.navigate(TEXTS.addEnsayo, { pasoId })}
          style={styles.createButton}
          labelStyle={styles.buttonText}
        >
          {TEXTS.add}
        </Button>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator
              animating
              size={FORMAT.large}
              color={theme.colors.primary}
            />
          ) : ensayos.length > 0 ? (
            ensayos.map((ensayo) => {
              const esPasado = dayjs(ensayo.fecha).isBefore(dayjs(), "day");
              return (
                <Card
                  key={ensayo.id}
                  style={[styles.ensayoCard, esPasado && styles.ensayoPasado]}
                  onPress={() =>
                    navigation.navigate(TEXTS.addEnsayo, {
                      pasoId,
                      ensayoId: ensayo.id,
                    })
                  }
                >
                  <Card.Content>
                    <Text style={styles.ensayoFecha}>
                      {dayjs(ensayo.fecha).format(FORMAT.dateMask)}
                    </Text>
                    <Text
                      style={styles.ensayoSubtext}
                    >{`${ensayo.costaleros.length} ${TEXTS.costalerosAsistentes}`}</Text>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Text style={styles.noDataText}>{TEXTS.noDataText}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EnsayoMenuScreen;
