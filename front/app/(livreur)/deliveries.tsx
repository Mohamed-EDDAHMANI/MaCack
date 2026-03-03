import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKGROUND_LIGHT } from "@/constants/colors";

export default function LivreurDeliveriesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }} edges={["top"]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "#64748b" }}>My Deliveries</Text>
        <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
          Track your active and past deliveries
        </Text>
      </View>
    </SafeAreaView>
  );
}
