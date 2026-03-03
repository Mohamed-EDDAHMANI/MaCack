import { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PRIMARY, SLATE_400 } from "@/constants/colors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/features/auth";
import { API_BASE_URL } from "@/lib/axios";
import { buildPhotoUrl } from "@/lib/utils";

const SLATE_600 = "#475569";
const SLATE_800 = "#1e293b";

interface ProfilePopupProps {
  visible: boolean;
  onClose: () => void;
  profileRoute: string;
}

export function ProfilePopup({ visible, onClose, profileRoute }: ProfilePopupProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userPhoto = buildPhotoUrl(user?.photo);

  const onShow = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 150, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close} onShow={onShow}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Animated.View
          style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          <Pressable style={styles.closeBtn} onPress={close}>
            <MaterialIcons name="close" size={18} color={SLATE_400} />
          </Pressable>

          <View style={styles.avatarRing}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={36} color={PRIMARY} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>

          <View style={styles.divider} />

          <Pressable
            style={styles.actionRow}
            onPress={() => { close(); router.push(profileRoute as any); }}
          >
            <MaterialIcons name="person-outline" size={20} color={PRIMARY} />
            <Text style={styles.actionText}>View Profile</Text>
          </Pressable>
          <Pressable
            style={[styles.actionRow, styles.logoutRow]}
            onPress={() => { close(); dispatch(logout()); }}
          >
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={[styles.actionText, { color: "#ef4444" }]}>Log Out</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 100 : 80,
    paddingRight: 16,
  },
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 28,
    paddingBottom: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: PRIMARY,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: SLATE_800,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: SLATE_600,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: PRIMARY + "14",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 14,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY,
    textTransform: "capitalize",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: SLATE_800,
  },
  logoutRow: {
    borderTopWidth: 1,
    borderTopColor: "#fef2f2",
  },
});
