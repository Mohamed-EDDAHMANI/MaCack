import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY } from "@/constants/colors";
import SuccessLottie from "@/components/common/success-lottie";

type OrderSuccessPopupProps = {
  visible: boolean;
  message: string;
};

export default function OrderSuccessPopup({ visible, message }: OrderSuccessPopupProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-[100] items-center justify-center" pointerEvents="none">
      <SuccessLottie />
      <View className="mt-2 flex-row items-center gap-2 rounded-2xl border border-slate-200/95 bg-white/95 px-4 py-2">
        <View
          className="h-[22px] w-[22px] items-center justify-center rounded-full"
          style={{ backgroundColor: PRIMARY }}
        >
          <MaterialIcons name="check" size={14} color="#fff" />
        </View>
        <Text className="text-[14px] font-bold tracking-[0.2px] text-slate-900">{message}</Text>
      </View>
    </View>
  );
}
