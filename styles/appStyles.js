import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // BOX pro TimerDisplay (aby nepoužíval container!)
  // Box kolem timeru (čas, start, elapsed)
  timerBox: {
    marginBottom: 20,         // prostor pod boxem
    padding: 10,              // vnitřní odsazení
    borderRadius: 10,         // zakulacení rohů
    backgroundColor: "#f0f0f0", // jemně šedé pozadí
    width: "90%",             // zabírá 90% šířky kontejneru
    alignItems: "center",     // obsah zarovnán na střed
  },

  timer: {
    fontSize: 48,
    marginBottom: 10,
  },

  controls: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },

  button: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  resetButton: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "#c14e4e",
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  // Wrapper pro list
  historyContainer: {
    width: "90%",
    marginTop: 20,
  },

  row: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  picker: {
    borderColor: "#f0e4e4ff"
  }
});
