import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { buildPhotoUrl } from "@/lib/utils";
import { PRIMARY, PRIMARY_TINT } from "@/constants/colors";

export function ProfileHero() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const photo = buildPhotoUrl(user?.photo ?? null);

  const memberSince = user?.createdAt
    ? `Sweet tooth since ${new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    : "MaCack member";

  return (
    <View>
      {/* Avatar + Info */}
      <View className="items-center py-6 px-6 bg-white">
        <View className="relative">
          <View className="w-32 h-32 rounded-full border-4 overflow-hidden bg-white" style={{ borderColor: `${PRIMARY}1A` }}>
            {photo ? (
              <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center" style={{ backgroundColor: PRIMARY_TINT }}>
                <MaterialIcons name="person" size={56} color={PRIMARY} />
              </View>
            )}
          </View>
          <View
            className="absolute bottom-1 right-1 w-7 h-7 rounded-full items-center justify-center border-2 border-white"
            style={{ backgroundColor: PRIMARY }}
          >
            <MaterialIcons name="verified" size={14} color="#fff" />
          </View>
        </View>

        <Text className="text-2xl font-extrabold text-slate-900 mt-4 text-center">
          {user?.name ?? "User"}
        </Text>
        <View className="flex-row items-center gap-1 mt-1.5">
          <MaterialIcons name="location-on" size={14} color={`${PRIMARY}B3`} />
          <Text className="text-sm font-medium" style={{ color: `${PRIMARY}B3` }}>Morocco</Text>
        </View>
        <Text className="text-sm font-medium text-slate-500 mt-1">{memberSince}</Text>
      </View>

      {/* Modify Profile Button */}
      <View className="px-6 pb-6 bg-white border-b border-background-light">
        <Pressable
          className="flex-row items-center justify-center h-12 rounded-xl gap-2"
          style={[{ backgroundColor: PRIMARY }, s.shadow]}
          onPress={() => router.push("/edit-profile" as any)}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text className="text-sm font-bold text-white" style={{ letterSpacing: 0.3 }}>Modify Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  shadow: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
