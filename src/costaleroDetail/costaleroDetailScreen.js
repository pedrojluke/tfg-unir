import {
  ActivityIndicator,
  Button,
  Card,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import React from "react";
import { TEXTS } from "./costaleroDetailHelper";
import styles from "./costaleroDetailStyles";
import useCostaleroDetail from "./useCostaleroDetail";

const CostaleroDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId } = route.params;
  const theme = useTheme();
  const { loading, searchQuery, setSearchQuery, filteredCostaleros } =
    useCostaleroDetail(pasoId);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{TEXTS.costaleros}</Text>

        <TextInput
          label={TEXTS.searchCostalero}
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode={TEXTS.outlined}
          style={styles.searchBar}
        />

        <Card style={styles.listCard}>
          <Card.Content>
            {loading ? (
              <ActivityIndicator
                animating
                size={TEXTS.large}
                color={theme.colors.primary}
              />
            ) : filteredCostaleros.length > 0 ? (
              filteredCostaleros.map((costalero) => (
                <List.Item
                  key={costalero.id}
                  title={`${costalero.nombre} ${costalero.apellidos}`}
                  description={`${TEXTS.telfono}: ${costalero.telefono} - ${TEXTS.altura}: ${costalero.altura} cm`}
                  left={(props) => (
                    <List.Icon {...props} icon={TEXTS.accountIcon} />
                  )}
                  onPress={() =>
                    navigation.navigate(TEXTS.addCostalero, {
                      costaleroId: costalero.id,
                      pasoId,
                    })
                  }
                />
              ))
            ) : (
              <Text style={styles.noDataText}>{TEXTS.noCostaleros}</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode={TEXTS.contained}
          onPress={() => navigation.navigate(TEXTS.addCostalero, { pasoId })}
          style={styles.addButton}
          labelStyle={styles.buttonText}
        >
          {TEXTS.addCostalero}
        </Button>
      </View>
    </View>
  );
};

export default CostaleroDetailScreen;
