import { Animated, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_400, SLATE_500, SLATE_600 } from "@/constants/colors";

type ColorOption = {
  id: string;
  label: string;
  hex: string;
};

type GarnishOption = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
};

type OrderCustomizerPopupProps = {
  isOpen: boolean;
  step: "choice" | "full";
  sheetAnim: Animated.Value;
  colorOptions: ColorOption[];
  garnishOptions: GarnishOption[];
  selectedColorId: string;
  selectedGarnishes: string[];
  specialMessage: string;
  totalPrice: number;
  bottomInset: number;
  onClose: () => void;
  onSkip: () => void;
  onChooseCustomize: () => void;
  onSelectColor: (id: string) => void;
  onToggleGarnish: (id: string) => void;
  onChangeMessage: (value: string) => void;
  onAddToCart: () => void;
};

export default function OrderCustomizerPopup({
  isOpen,
  step,
  sheetAnim,
  colorOptions,
  garnishOptions,
  selectedColorId,
  selectedGarnishes,
  specialMessage,
  totalPrice,
  bottomInset,
  onClose,
  onSkip,
  onChooseCustomize,
  onSelectColor,
  onToggleGarnish,
  onChangeMessage,
  onAddToCart,
}: OrderCustomizerPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 30,
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          opacity: sheetAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        className="absolute bottom-10 left-4 right-4 z-40 rounded-3xl bg-[#FFF8F6] px-5 pb-5 pt-2"
        style={{
          transform: [
            {
              translateY: sheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              }),
            },
          ],
          opacity: sheetAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        }}
      >
        <View className="mb-3 h-1 w-10 self-center rounded-full bg-slate-400/50" />
        {step === "choice" ? (
          <>
            <View className="flex-row items-center justify-between pb-2">
              <Text className="text-[20px] font-bold text-slate-900">Customize your order?</Text>
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full bg-slate-400/10"
                onPress={onClose}
              >
                <MaterialIcons name="close" size={18} color={SLATE_600} />
              </Pressable>
            </View>
            <View className="pt-1">
              <Text className="mb-4 text-[14px] text-slate-600">
                Do you want to customize this order or skip this step?
              </Text>
              <View className="flex-row items-center justify-between gap-2.5">
                <Pressable
                  className="flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-3"
                  onPress={onSkip}
                >
                  <Text className="text-[14px] font-semibold text-slate-600">Skip this step</Text>
                </Pressable>
                <Pressable
                  className="flex-1 items-center justify-center rounded-xl py-3"
                  style={{ backgroundColor: PRIMARY }}
                  onPress={onChooseCustomize}
                >
                  <Text className="text-[14px] font-bold text-white">Customize order</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="flex-row items-center justify-between pb-2">
              <Text className="text-[20px] font-bold text-slate-900">Customize Your Order</Text>
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full bg-slate-400/10"
                onPress={onClose}
              >
                <MaterialIcons name="close" size={18} color={SLATE_600} />
              </Pressable>
            </View>

            <ScrollView className="max-h-[380px]" contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
              <View className="mt-4">
                <Text className="mb-2.5 text-[11px] font-bold tracking-[1.5px]" style={{ color: PRIMARY }}>
                  CHOOSE COLORS
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {colorOptions.map((option) => {
                    const active = option.id === selectedColorId;
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => onSelectColor(option.id)}
                        className="h-10 w-10 items-center justify-center rounded-full border bg-white"
                        style={{
                          borderColor: active ? PRIMARY : "rgba(148,163,184,0.5)",
                          borderWidth: active ? 2 : 1,
                        }}
                      >
                        <View
                          className="h-[30px] w-[30px] rounded-full"
                          style={{ backgroundColor: option.hex }}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-4">
                <View className="mb-2.5 flex-row items-center justify-between">
                  <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: PRIMARY }}>
                    GARNITURE
                  </Text>
                  <Text className="text-[11px]" style={{ color: SLATE_500 }}>
                    Select up to 3
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {garnishOptions.map((g) => {
                    const active = selectedGarnishes.includes(g.id);
                    return (
                      <Pressable
                        key={g.id}
                        onPress={() => onToggleGarnish(g.id)}
                        className="flex-row items-center rounded-full border px-3.5 py-2"
                        style={{
                          borderColor: active ? PRIMARY : "rgba(226,232,240,1)",
                          backgroundColor: active ? `${PRIMARY}1A` : "#fff",
                        }}
                      >
                        <MaterialIcons
                          name={g.icon}
                          size={18}
                          color={PRIMARY}
                          style={{ opacity: active ? 1 : 0.9 }}
                        />
                        <Text
                          className="ml-1.5 text-[13px] font-medium"
                          style={{ color: active ? PRIMARY : SLATE_600 }}
                        >
                          {g.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-4">
                <Text className="mb-2.5 text-[11px] font-bold tracking-[1.5px]" style={{ color: PRIMARY }}>
                  ADD A SPECIAL MESSAGE
                </Text>
                <View className="rounded-2xl border border-slate-200 bg-white px-3 py-3 pb-5">
                  <TextInput
                    className="min-h-[90px] max-h-[140px] text-[13px] text-slate-900"
                    style={{ textAlignVertical: "top" }}
                    placeholder="Example: Happy Anniversary Sarah! ❤️"
                    placeholderTextColor={SLATE_400}
                    value={specialMessage}
                    onChangeText={onChangeMessage}
                    multiline
                    maxLength={120}
                  />
                  <Text
                    className="absolute bottom-1.5 right-3 text-[10px] font-medium"
                    style={{ color: SLATE_400 }}
                  >
                    {specialMessage.length}/120
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View className="flex-row items-center justify-between pb-4 pt-3" style={{ paddingBottom: Math.max(8, bottomInset) }}>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: SLATE_500 }}>
                  Total Price
                </Text>
                <Text className="mt-0.5 text-[18px] font-bold text-slate-900">
                  {totalPrice.toFixed(2)} MAD
                </Text>
              </View>
              <Pressable
                className="flex-row items-center justify-center gap-2 rounded-[14px] px-5 py-3"
                style={{ backgroundColor: PRIMARY }}
                onPress={onAddToCart}
              >
                <MaterialIcons name="shopping-bag" size={20} color="#fff" />
                <Text className="text-[15px] font-bold text-white">Add to Cart</Text>
              </Pressable>
            </View>
          </>
        )}
      </Animated.View>
    </>
  );
}
