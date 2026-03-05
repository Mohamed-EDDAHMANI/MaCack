import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { PRIMARY, SLATE_400, SURFACE, BORDER } from "@/constants/colors";

export default function MainLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user?.role);

  const isPatissiere = isAuthenticated && role === "PATISSIERE";
  const showDashboard = isAuthenticated && role === "LIVREUR";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: SURFACE,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          paddingTop: 12,
          paddingBottom: 8,
          height: 72,
        },
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: SLATE_400,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          href: isPatissiere ? null : undefined,
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={28} color={color} />,
        }}
      />
        <Tabs.Screen
          name="create"
          options={{
            title: "",
            href: isPatissiere ? undefined : null,
            tabBarIcon: () => (
              <View style={s.createBtn}>
                <MaterialIcons name="add" size={28} color="#fff" />
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-bag" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          href: showDashboard ? undefined : null,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-shipping" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? "Profile" : "Login",
          href: isAuthenticated ? undefined : "/(auth)/login",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={isAuthenticated ? "person" : "login"} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  createBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

