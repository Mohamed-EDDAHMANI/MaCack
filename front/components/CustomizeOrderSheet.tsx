import { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  PRIMARY,
  SLATE_400,
  SLATE_500,
  SLATE_600,
  BORDER_SUBTLE,
  TEXT_PRIMARY,
} from "@/constants/colors";

const COLOR_OPTIONS = [
  "#D81B60",
  "#FFD700",
  "#F4C2C2",
  "#FFFFFF",
  "#4A2C2A",
  "#FF6B6B",
  "#FF8C00",
  "#8A2BE2",
  "#00B894",
  "#0984E3",
  "#FF69B4",
  "#A3CB38",
];

const GARNISH_OPTIONS = [
  { id: "rose", icon: "local-florist" as const, label: "Rose Petals" },
  { id: "gold", icon: "star" as const, label: "Gold Flakes" },
  { id: "pearls", icon: "cake" as const, label: "Sugar Pearls" },
  { id: "mint", icon: "spa" as const, label: "Mint Sprig" },
  { id: "berries", icon: "emoji-food-beverage" as const, label: "Fresh Berries" },
  { id: "choco", icon: "icecream" as const, label: "Chocolate Shards" },
];

const MAX_GARNISHES = 3;

type Props = {
  open: boolean;
  basePrice: number;
  onClose: () => void;
};

export function CustomizeOrderSheet({ open, basePrice, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0]);
  const [selectedGarnishes, setSelectedGarnishes] = useState<string[]>([]);
  const [specialMessage, setSpecialMessage] = useState("");

  useEffect(() => {
    if (open) {
      Animated.spring(sheetAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 24,
        bounciness: 6,
      }).start();
    } else {
      Animated.spring(sheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }).start();
    }
  }, [open, sheetAnim]);

  const totalPrice = useMemo(() => {
    const extras = selectedGarnishes.length * 5;
    return basePrice + extras;
  }, [basePrice, selectedGarnishes.length]);

  const handleToggleGarnish = (id: string) => {
    setSelectedGarnishes((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((g) => g !== id);
      if (prev.length >= MAX_GARNISHES) return prev;
      return [...prev, id];
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[
          styles.overlay,
          {
            opacity: sheetAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
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
            paddingBottom: Math.max(20, insets.bottom + 8),
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Customize Your Order</Text>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <MaterialIcons name="close" size={18} color={SLATE_600} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CHOOSE COLORS</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((color) => {
                const active = color === selectedColor;
                return (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOuter,
                      active && { borderColor: PRIMARY, borderWidth: 2 },
                    ]}
                  >
                    <View style={[styles.colorInner, { backgroundColor: color }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>GARNITURE</Text>
              <Text style={styles.sectionHint}>Select up to 3</Text>
            </View>
            <View style={styles.garnishRow}>
              {GARNISH_OPTIONS.map((g) => {
                const active = selectedGarnishes.includes(g.id);
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => handleToggleGarnish(g.id)}
                    style={[
                      styles.garnishPill,
                      active && styles.garnishPillActive,
                    ]}
                  >
                    <MaterialIcons
                      name={g.icon}
                      size={18}
                      color={PRIMARY}
                      style={{ opacity: active ? 1 : 0.9 }}
                    />
                    <Text
                      style={[
                        styles.garnishText,
                        active && styles.garnishTextActive,
                      ]}
                    >
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ADD A SPECIAL MESSAGE</Text>
            <View style={styles.messageWrap}>
              <TextInput
                style={styles.messageInput}
                placeholder="Example: Happy Anniversary Sarah! ❤️"
                placeholderTextColor={SLATE_400}
                value={specialMessage}
                onChangeText={setSpecialMessage}
                multiline
                maxLength={120}
              />
              <Text style={styles.messageCounter}>
                {specialMessage.length}/120
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Total Price</Text>
            <Text style={styles.footerPrice}>{totalPrice.toFixed(2)} MAD</Text>
          </View>
          <Pressable style={styles.footerBtn}>
            <MaterialIcons name="shopping-bag" size={20} color="#fff" />
            <Text style={styles.footerBtnText}>Add to Cart</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    zIndex: 30,
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 40,
    borderRadius: 24,
    backgroundColor: "#FFF8F6",
    paddingTop: 8,
    paddingHorizontal: 20,
    zIndex: 40,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(148, 163, 184, 0.5)",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: PRIMARY,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 11,
    color: SLATE_500,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  colorInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  garnishRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  garnishPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  garnishPillActive: {
    backgroundColor: `${PRIMARY}1A`,
    borderColor: PRIMARY,
  },
  garnishText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
    color: SLATE_600,
  },
  garnishTextActive: {
    color: PRIMARY,
  },
  messageWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    backgroundColor: "#fff",
    padding: 12,
    paddingBottom: 20,
  },
  messageInput: {
    minHeight: 90,
    maxHeight: 140,
    fontSize: 13,
    color: TEXT_PRIMARY,
    textAlignVertical: "top",
  },
  messageCounter: {
    position: "absolute",
    right: 12,
    bottom: 6,
    fontSize: 10,
    fontWeight: "500",
    color: SLATE_400,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  footerLeft: {},
  footerLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: SLATE_500,
  },
  footerPrice: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    gap: 8,
  },
  footerBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});

