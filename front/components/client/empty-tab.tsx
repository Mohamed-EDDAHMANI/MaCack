import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SLATE_400 } from "@/constants/colors";

interface Props {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function EmptyTab({ icon, title, description }: Props) {
  return (
    <View className="items-center justify-center py-16 px-8 gap-3">
      <MaterialIcons name={icon} size={48} color={SLATE_400} />
      <Text className="text-lg font-bold text-slate-900">{title}</Text>
      <Text className="text-sm text-slate-500 text-center leading-5">{description}</Text>
    </View>
  );
}
