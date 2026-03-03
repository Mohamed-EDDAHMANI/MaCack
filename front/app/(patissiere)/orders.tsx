import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKGROUND_LIGHT } from "@/constants/colors";

export default function PatissiereOrdersScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }} edges={["top"]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "#64748b" }}>Orders</Text>
        <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
          Accept or refuse incoming orders
        </Text>
      </View>
    </SafeAreaView>
  );
}
