import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import Incident from "../../components/Incident";

import "intl";
import "intl/locale-data/jsonp/pt-BR";

import api from "../../services/api";

export default function Search() {
  const navigation = useNavigation();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  function navigateBack() {
    navigation.goBack();
  }

  async function searchIncidents(query) {
    if (!query || query.length < 3) {
      return;
    }

    setLoading(true);

    const response = await api.get("search/incidents", { params: { query } });

    setIncidents(response.data);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchField}
          onChangeText={searchIncidents}
          placeholder="Pesquisar incidentes"
        />
        <TouchableOpacity onPress={navigateBack}>
          <Feather name="arrow-left" size={28} color="#E82041" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        loading={loading}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: incident }) => <Incident incident={incident} />}
      />
    </View>
  );
}
