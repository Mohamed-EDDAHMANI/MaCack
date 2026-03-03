import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/features/auth";
import { buildPhotoUrl } from "@/lib/utils";

const PRIMARY = "#da1b61";
const BACKGROUND_LIGHT = "#f8f6f7";
const SLATE_400 = "#94a3b8";
const SLATE_600 = "#475569";
const SLATE_800 = "#1e293b";

interface MenuItem {
  icon: string;
  label: string;
  onPress?: () => void;
}

interface ProfileContentProps {
  /** Extra menu items specific to the role */
  menuItems?: MenuItem[];
}

export function ProfileContent({ menuItems = [] }: ProfileContentProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userPhoto = buildPhotoUrl(user?.photo);

  const defaultItems: MenuItem[] = [
    { icon: "edit", label: "Edit Profile" },
    { icon: "settings", label: "Settings" },
    { icon: "help-outline", label: "Help & Support" },
  ];

  const allItems = [...menuItems, ...defaultItems];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={48} color={PRIMARY} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{user?.name ?? "User"}</Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role ?? ""}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {allItems.map((item, i) => (
            <Pressable key={i} style={styles.menuItem} onPress={item.onPress}>
              <MaterialIcons name={item.icon as any} size={22} color={SLATE_600} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={22} color={SLATE_400} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <MaterialIcons name="logout" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND_LIGHT },
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: SLATE_800,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: PRIMARY,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PRIMARY + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 20, fontWeight: "700", color: SLATE_800, marginTop: 12 },
  email: { fontSize: 14, color: SLATE_600, marginTop: 4 },
  roleBadge: {
    marginTop: 8,
    backgroundColor: PRIMARY + "1A",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { fontSize: 12, fontWeight: "600", color: PRIMARY, textTransform: "capitalize" },
  menuSection: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: SLATE_800, marginLeft: 14 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fef2f2",
    borderRadius: 14,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#ef4444" },
});
