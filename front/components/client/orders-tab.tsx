import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_400 } from "@/constants/colors";

/* ─── types ─── */
interface StatusStyle {
  bg: string;
  text: string;
}

const STATUS_COLORS: Record<string, StatusStyle> = {
  Pending: { bg: "#dbeafe", text: "#2563eb" },
  "In Progress": { bg: "#fef3c7", text: "#d97706" },
  Delivered: { bg: "#d1fae5", text: "#059669" },
  Cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

/* ─── placeholder data ─── */
const ONGOING_ORDERS = [
  {
    id: "1",
    title: "Boutique Chocolate Fondant",
    chef: "Chef Clara Bloom",
    price: "€45.00",
    status: "Pending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjtTpezgo9AHpVewPJ2N4xOGaNGOPCfIbx-M5dWmMQu0hlXhh13k8KAY8i5SWnFW6ShDdgn9dC3vpPk9QOwp1IH7GEhpcGOw7zVW9wIEJdbhr3W4rP4u7nTZGxTrO6X1VDEaJhYOM2JCZ32INxLNmhGzFkT9CWF0X5OIXqivOdBOwpxhcZgbBEM9Ebhvyt4cdBGtis73hLR_Ktm4VTrao2LiyKVIBAOlIxtDhCPoqr9I2VhnyjA9ZJns-Q5JIWLqhQSFOpXiQXD-As",
  },
];

const HISTORY_ORDERS = [
  {
    id: "2",
    title: "Velvet Berry Cheesecake",
    chef: "Chef Marc Pastry",
    price: "€32.50",
    date: "22 Jan 2024",
    status: "Delivered",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmOERBB2WF44xz3jtCP-muIIXUA20R2d96YQKnOfkSyBwyeJAqK7aemlzE4CIbhWY4dJTf0reIV_u9B9p8emj_epSPoFqHpC-r9gYJnQvFlengIaMJR3xUKwSF-hDmmj2NYhRPL3MVfy2j9oi9w6sYuKYatH2Rlf3inqzrv9myVrGvRzwNCS1HN2U9Fr0T6bjMjcgr1-N7TZnRhQ_7UV3MN-uS-iwb7TbIVBYsvukwoP0o2pRlR_A__xGRy_rKY_uEMuB7ywdXeOyn",
  },
  {
    id: "3",
    title: "Glazed Luxury Tower",
    chef: "Sweets by Sofia",
    price: "€58.00",
    date: "15 Dec 2023",
    status: "Delivered",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL7xX6-MDdJIyNXoyPaBiGRWusMFyo9JvDWKgkBakVVfBTxjD6JrfBMtO_iOjA_YR63KbwOKQmWiQe4C3xmDVmUsH3_M3c8xin02ZcxExPrWPjsdDQp-U8kEBqVyV7zl2O2VtfFve1Vcl40J8wytS1f0Fw3WR6JSbSWabMt2EOX_T020JMSnrz7C_g2UUS3fINK-uuAT8fnP--0beq94C5wKuc7sUNi0L0UxHLqvDJ_079BLP3t3G6NsxpYMQIhowfQirkBpbFmwk_",
  },
];

/* ─── shared sub-component: status badge ─── */
function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.Pending;
  return (
    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg }}>
      <Text className="text-[10px] font-bold uppercase" style={{ color: colors.text, letterSpacing: -0.3 }}>
        {status}
      </Text>
    </View>
  );
}

/* ─── order card (used for both ongoing & history) ─── */
function OrderCard({
  image,
  title,
  status,
  subtitle,
  priceLine,
  actions,
  dimmed,
}: {
  image: string;
  title: string;
  status: string;
  subtitle: string;
  priceLine: React.ReactNode;
  actions: React.ReactNode;
  dimmed?: boolean;
}) {
  return (
    <View
      className="bg-white rounded-xl p-3 gap-3 border"
      style={[{ borderColor: `${PRIMARY}0D`, opacity: dimmed ? 0.92 : 1 }, s.card]}
    >
      <View className="flex-row gap-4">
        <Image source={{ uri: image }} className="w-20 h-20 rounded-lg" contentFit="cover" />
        <View className="flex-1 py-0.5">
          <View className="flex-row justify-between items-start gap-2">
            <Text className="text-[15px] font-bold text-slate-900 flex-1" numberOfLines={1}>
              {title}
            </Text>
            <StatusBadge status={status} />
          </View>
          <Text className="text-sm text-slate-500 mt-0.5">{subtitle}</Text>
          {priceLine}
        </View>
      </View>
      {actions}
    </View>
  );
}

/* ─── main ─── */
export function OrdersTab() {
  return (
    <View className="p-4 gap-6">
      {/* Ongoing */}
      {ONGOING_ORDERS.length > 0 && (
        <View className="gap-3">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">
            Ongoing Orders
          </Text>
          {ONGOING_ORDERS.map((o) => (
            <OrderCard
              key={o.id}
              image={o.image}
              title={o.title}
              status={o.status}
              subtitle={o.chef}
              priceLine={
                <Text className="text-sm font-bold mt-2" style={{ color: PRIMARY }}>
                  {o.price}
                </Text>
              }
              actions={
                <View className="flex-row gap-2 border-t border-slate-50 pt-3">
                  <Pressable className="flex-1 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: PRIMARY }}>
                    <Text className="text-sm font-bold text-white" style={{ letterSpacing: -0.2 }}>View Details</Text>
                  </Pressable>
                  <Pressable className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: `${PRIMARY}1A` }}>
                    <MaterialIcons name="chat" size={18} color={PRIMARY} />
                  </Pressable>
                </View>
              }
            />
          ))}
        </View>
      )}

      {/* History */}
      <View className="gap-3">
        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">
          Order History
        </Text>
        {HISTORY_ORDERS.map((o) => (
          <OrderCard
            key={o.id}
            image={o.image}
            title={o.title}
            status={o.status}
            subtitle={o.chef}
            dimmed
            priceLine={
              <View className="flex-row items-center gap-1 mt-2">
                <Text className="text-sm font-bold text-slate-400">{o.price}</Text>
                <Text className="text-sm text-slate-400 mx-0.5">•</Text>
                <Text className="text-xs font-medium text-slate-500">{o.date}</Text>
              </View>
            }
            actions={
              <View className="flex-row gap-2">
                <Pressable className="flex-1 h-10 rounded-lg bg-slate-100 items-center justify-center">
                  <Text className="text-sm font-bold text-slate-600" style={{ letterSpacing: -0.2 }}>Order Again</Text>
                </Pressable>
                <Pressable className="flex-1 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: `${PRIMARY}0D` }}>
                  <Text className="text-sm font-bold" style={{ color: PRIMARY, letterSpacing: -0.2 }}>Write Review</Text>
                </Pressable>
              </View>
            }
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
