import React, { useState, useEffect } from "react";
import { View, Image, Text, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import Incident from "../../components/Incident";

import logoImg from "../../assets/logo.png";

import "intl";
import "intl/locale-data/jsonp/pt-BR";

import api from "../../services/api";

export default function Incidents() {
  const navigation = useNavigation();

  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  function navigateToSearch(incident) {
    navigation.navigate("Search");
  }

  async function loadIncidents() {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length == total) {
      return;
    }

    setLoading(true);

    const response = await api.get("incidents", { params: { page } });

    setIncidents([...incidents, ...response.data]);
    setTotal(response.headers["x-total-count"]);
    setPage(page + 1);
    setLoading(false);
  }

  async function refreshIncidents() {
    if (loading || refreshing) {
      return;
    }

    setRefreshing(true);

    setTotal(0);
    setIncidents([]);
    setPage(1);
    await loadIncidents();

    setRefreshing(false);
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo} />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.headerText}>
            Total de <Text style={styles.headerTextBold}>{total} casos</Text>
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={navigateToSearch}
          >
            <Feather name="search" size={16} color="#E02041" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>
      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        onEndReached={loadIncidents}
        onRefresh={refreshIncidents}
        refreshing={refreshing}
        loading={loading}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: incident }) => <Incident incident={incident} />}
      />
    </View>
  );
}
