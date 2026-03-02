import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_200, SLATE_400, SLATE_600 } from "@/constants/colors";
import type { RegisterRole } from "@/types/register";

interface RoleCardProps {
  role: RegisterRole;
  title: string;
  description: string;
  imageUri: string;
  selected: boolean;
  onSelect: () => void;
}

export function RoleCard({ title, description, imageUri, selected, onSelect }: RoleCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardDefault,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.footer}>
            <MaterialIcons
              name={selected ? "check-circle" : "radio-button-unchecked"}
              size={18}
              color={selected ? PRIMARY : SLATE_400}
            />
            <Text style={[styles.footerText, selected && styles.footerTextSelected]}>
              {selected ? "Selected" : "Select this role"}
            </Text>
          </View>
        </View>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
          {!selected && <View style={styles.imageOverlay} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardDefault: {
    backgroundColor: "#fff",
    borderColor: SLATE_200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardSelected: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderColor: PRIMARY,
    borderWidth: 2,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 16,
  },
  textBlock: {
    flex: 2,
    minWidth: 0,
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.015,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: SLATE_600,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: SLATE_400,
  },
  footerTextSelected: {
    fontWeight: "600",
    color: PRIMARY,
  },
  imageWrap: {
    width: 128,
    height: 128,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(128,128,128,0.4)",
  },
});
