import { View, TextInput, Text, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";

const api = "https://api.frankfurter.app/latest?from=USD";

export default function FxRate() {
  const amountInput = useRef(null);
  const [amount, setAmount] = useState("1");
  
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["fxrate"],
    queryFn: async () => {
      const res = await fetch(api);
      if (!res.ok) {
        throw new Error("Failed to fetch FX rates");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const convert = (code) => {
    const usd = parseFloat(amount);
    if (!usd || usd <= 0) return "0.00";
    if (!data?.rates?.[code]) return "0.00";
    return (usd * data.rates[code]).toFixed(2);
  };

  return (
    <View style={{ padding: 20 }}>
      {/* USD input */}
      <View style={styles.item}>
        <MaterialIcons name="attach-money" color="#0e9ce2" size={32} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          ref={amountInput}
          placeholder="1"
        />
        <Text>USD</Text>
      </View>

      <Rate icon="euro" value={convert("EUR")} code="EUR" />
      <Rate icon="currency-pound" value={convert("GBP")} code="GBP" />
      <Rate icon="currency-yen" value={convert("JPY")} code="JPY" />
      <Rate icon="currency-yuan" value={convert("CNY")} code="CNY" />
      <Rate icon="currency-rupee" value={convert("INR")} code="INR" />
      <Rate icon="currency-exchange" value={convert("CAD")} code="CAD" />
      <Rate icon="currency-exchange" value={convert("AUD")} code="AUD" />
      <Rate icon="currency-exchange" value={convert("SGD")} code="SGD" />
      <Rate icon="currency-exchange" value={convert("THB")} code="THB" />
    </View>
  );
}

function Rate({ icon, value, code }) {
  return (
    <View style={styles.item}>
      <MaterialIcons name={icon} color="#0e9ce2" size={24} />
      <Text style={styles.result}>
        {value} {code}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flexGrow: 1,
    fontSize: 20,
    paddingVertical: 10,
  },
  item: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  result: {
    fontSize: 18,
  },
});
