import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./styles";

const index = ({ incident }) => {
  const navigation = useNavigation();

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }

  return (
    <View style={styles.incident}>
      <Text style={styles.incidentProperty}>ONG:</Text>
      <Text style={styles.incidentValue}>{incident.name}</Text>

      <Text style={styles.incidentProperty}>CASO:</Text>
      <Text style={styles.incidentValue}>{incident.title}</Text>

      <Text style={styles.incidentProperty}>VALOR:</Text>
      <Text style={styles.incidentValue}>
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(incident.value)}
      </Text>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigateToDetail(incident)}
      >
        <Text style={styles.detailsButtonText}>Ver detalhes</Text>
        <Feather name="arrow-right" size={16} color="#E02041" />
      </TouchableOpacity>
    </View>
  );
};

export default index;
