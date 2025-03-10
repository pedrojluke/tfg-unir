import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TEXTS } from "./pasoHelper";
import { styles } from "./pasoStyles";

const PasoForm = ({
  nombre,
  descripcion,
  setNombre,
  setDescripcion,
  altura,
  setAltura,
  orden,
  setOrden,
  huecos,
  setHuecos,
  addTrabajadera,
  trabajaderas,
  removeTrabajadera,
  addingTrabajadera,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TextInput
        label={TEXTS.pasoName}
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        mode={TEXTS.outlined}
      />
      <TextInput
        label={TEXTS.pasoDescription}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={styles.input}
        mode={TEXTS.outlined}
      />
      <Text style={styles.subtitle}>{TEXTS.trabajaderas}</Text>
      <View style={styles.row}>
        <TextInput
          label={TEXTS.altura}
          value={altura}
          onChangeText={setAltura}
          keyboardType={TEXTS.numeric}
          mode={TEXTS.outlined}
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          label={TEXTS.orden}
          value={orden}
          onChangeText={setOrden}
          keyboardType={TEXTS.numeric}
          mode={TEXTS.outlined}
          style={[styles.input, styles.halfInput]}
        />
      </View>
      <TextInput
        label={TEXTS.huecos}
        value={huecos}
        onChangeText={setHuecos}
        keyboardType={TEXTS.numeric}
        mode={TEXTS.outlined}
        style={styles.input}
      />
      <Button
        mode={TEXTS.contained}
        onPress={addTrabajadera}
        style={styles.createButton}
        labelStyle={styles.buttonText}
        disabled={addingTrabajadera}
      >
        {addingTrabajadera ? (
          <ActivityIndicator animating={true} />
        ) : (
          TEXTS.addTrabajadera
        )}
      </Button>
      {trabajaderas.length > 0 &&
        trabajaderas.map((trabajadera) => (
          <Card key={trabajadera.id} style={styles.trabajaderaCard}>
            <Card.Content style={styles.trabajaderaRow}>
              <Text style={styles.trabajaderaText}>
                {TEXTS.orden}: {trabajadera.orden} | {TEXTS.altura}:{" "}
                {trabajadera.altura} cm | {TEXTS.huecos}: {trabajadera.huecos}
              </Text>
              <TouchableOpacity
                onPress={() => removeTrabajadera(trabajadera.id)}
              >
                <Ionicons name={TEXTS.trashIcon} size={24} color={TEXTS.red} />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
    </ScrollView>
  );
};

export default PasoForm;
