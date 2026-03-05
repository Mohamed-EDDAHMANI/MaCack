import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKGROUND_LIGHT, SLATE_600, TEXT_PRIMARY } from "@/constants/colors";

export default function ClientOrdersScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }} edges={["top"]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: TEXT_PRIMARY }}>My Orders</Text>
        <Text style={{ fontSize: 14, color: SLATE_600, marginTop: 8 }}>Track your orders</Text>
      </View>
    </SafeAreaView>
  );
}
