import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Constants.statusBarHeight + 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headerText: {
    fontSize: 15,
    color: "#737380"
  },

  searchField: {
    height: 40,
    borderColor: "#A3A3B0",
    backgroundColor: "#FFF",
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    width: '90%'
  },

  title: {
    fontSize: 30,
    marginBottom: 16,
    marginTop: 48,
    color: "#13131a",
    fontWeight: "bold"
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#737380"
  },

  incidentList: {
    marginTop: 32
  },

  searchButton: {
    marginLeft: 16
  }
});
