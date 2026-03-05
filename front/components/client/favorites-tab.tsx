import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, BACKGROUND_LIGHT, SLATE_400, SLATE_500 } from "@/constants/colors";

/* ─── placeholder data ─── */
interface FavCake {
  id: string;
  image: string;
  title: string;
  chef: string;
  price: string;
  rating: string;
}

interface FavChef {
  id: string;
  avatar: string;
  name: string;
  rating: string;
  reviews: number;
}

const CAKES: FavCake[] = [
  {
    id: "1",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjtTpezgo9AHpVewPJ2N4xOGaNGOPCfIbx-M5dWmMQu0hlXhh13k8KAY8i5SWnFW6ShDdgn9dC3vpPk9QOwp1IH7GEhpcGOw7zVW9wIEJdbhr3W4rP4u7nTZGxTrO6X1VDEaJhYOM2JCZ32INxLNmhGzFkT9CWF0X5OIXqivOdBOwpxhcZgbBEM9Ebhvyt4cdBGtis73hLR_Ktm4VTrao2LiyKVIBAOlIxtDhCPoqr9I2VhnyjA9ZJns-Q5JIWLqhQSFOpXiQXD-As",
    title: "Chocolate Fondant",
    chef: "Clara Bloom",
    price: "€45.00",
    rating: "4.9",
  },
  {
    id: "2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmOERBB2WF44xz3jtCP-muIIXUA20R2d96YQKnOfkSyBwyeJAqK7aemlzE4CIbhWY4dJTf0reIV_u9B9p8emj_epSPoFqHpC-r9gYJnQvFlengIaMJR3xUKwSF-hDmmj2NYhRPL3MVfy2j9oi9w6sYuKYatH2Rlf3inqzrv9myVrGvRzwNCS1HN2U9Fr0T6bjMjcgr1-N7TZnRhQ_7UV3MN-uS-iwb7TbIVBYsvukwoP0o2pRlR_A__xGRy_rKY_uEMuB7ywdXeOyn",
    title: "Berry Cheesecake",
    chef: "Marc Pastry",
    price: "€32.50",
    rating: "4.7",
  },
  {
    id: "3",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL7xX6-MDdJIyNXoyPaBiGRWusMFyo9JvDWKgkBakVVfBTxjD6JrfBMtO_iOjA_YR63KbwOKQmWiQe4C3xmDVmUsH3_M3c8xin02ZcxExPrWPjsdDQp-U8kEBqVyV7zl2O2VtfFve1Vcl40J8wytS1f0Fw3WR6JSbSWabMt2EOX_T020JMSnrz7C_g2UUS3fINK-uuAT8fnP--0beq94C5wKuc7sUNi0L0UxHLqvDJ_079BLP3t3G6NsxpYMQIhowfQirkBpbFmwk_",
    title: "Luxury Tower",
    chef: "Sweets by Sofia",
    price: "€58.00",
    rating: "5.0",
  },
];

const CHEFS: FavChef[] = [
  {
    id: "1",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMObGrSx8nIHFcQAFH6Jx9YbA9A3qhPO9xfhAs_pcBDknJZrMN1FoCR5R4UuNZcGHSrPagFGjjeUis_8wxyodENu1vLWn7cFnIYQ2hS9k7y9BJbYNjkOP_czJtIzn7P45lgQS1V3DNICECny-l_M3O80FnKRZwMEfgXEc3mEPSpGQrmaHvkbDfn2hKWBA32t4anwHXEfIxBDUqwaROuUtKKYv1nK8oPN34XzCxi1ydGzhOAr-Qa_02zdCjw-XcYTy9ZHbkDM5ZyFQf",
    name: "Pâtissière Clara",
    rating: "4.9",
    reviews: 124,
  },
];

/* ─── sub-components ─── */

function CakeCard({ cake }: { cake: FavCake }) {
  return (
    <View className="bg-white rounded-2xl overflow-hidden flex-1" style={{ borderWidth: 1, borderColor: `${PRIMARY}0D` }}>
      <View className="aspect-square relative">
        <Image source={{ uri: cake.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        <Pressable
          className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <MaterialIcons name="favorite" size={18} color={PRIMARY} />
        </Pressable>
      </View>
      <View className="p-3">
        <Text className="font-bold text-sm text-slate-900" numberOfLines={1}>
          {cake.title}
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">{cake.chef}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-bold text-sm" style={{ color: PRIMARY }}>
            {cake.price}
          </Text>
          <View className="flex-row items-center gap-0.5">
            <MaterialIcons name="star" size={12} color="#eab308" />
            <Text className="text-[10px] font-bold text-slate-500">{cake.rating}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ChefCard({ chef }: { chef: FavChef }) {
  return (
    <View className="bg-white p-4 rounded-2xl flex-row items-center gap-4">
      <Image source={{ uri: chef.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} contentFit="cover" />
      <View className="flex-1">
        <Text className="font-bold text-slate-900">{chef.name}</Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <MaterialIcons name="star" size={14} color="#eab308" />
          <Text className="text-xs font-bold text-slate-500">
            {chef.rating} ({chef.reviews} reviews)
          </Text>
        </View>
      </View>
      <Pressable className="px-4 py-2 rounded-lg" style={{ backgroundColor: PRIMARY }}>
        <Text className="text-xs font-bold text-white">View</Text>
      </Pressable>
    </View>
  );
}

/* ─── main ─── */

type SubTab = "Cakes" | "Chefs";

export function FavoritesTab() {
  const [subTab, setSubTab] = useState<SubTab>("Cakes");

  return (
    <View>
      {/* Toggle Cakes / Chefs */}
      <View className="p-4 bg-white">
        <View className="flex-row rounded-xl p-1" style={{ backgroundColor: BACKGROUND_LIGHT }}>
          {(["Cakes", "Chefs"] as SubTab[]).map((tab) => {
            const active = subTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setSubTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg items-center ${active ? "bg-white" : ""}`}
                style={active ? { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 } : undefined}
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: active ? PRIMARY : SLATE_500 }}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Content */}
      <View className="p-4" style={{ backgroundColor: BACKGROUND_LIGHT }}>
        {subTab === "Cakes" ? (
          <View className="flex-row flex-wrap" style={{ gap: 16 }}>
            {CAKES.map((cake) => (
              <View key={cake.id} style={{ width: "47%" }}>
                <CakeCard cake={cake} />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {CHEFS.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
