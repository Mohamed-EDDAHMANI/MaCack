import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_400 } from "@/constants/colors";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: PRIMARY + "1A",
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
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
