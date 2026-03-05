import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_400, TEXT_PRIMARY } from "@/constants/colors";

/* ─── types ─── */
type TransactionType = "purchase" | "topup";

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: TransactionType;
}

/* ─── placeholder data ─── */
const WALLET_BALANCE = "€124.50";

const TRANSACTIONS: Transaction[] = [
  { id: "t1", title: "Boutique Chocolate Fondant", date: "24 Jan 2024 • 14:20", amount: "- €45.00", type: "purchase" },
  { id: "t2", title: "Wallet Top Up", date: "20 Jan 2024 • 09:15", amount: "+ €100.00", type: "topup" },
  { id: "t3", title: "Velvet Berry Cheesecake", date: "15 Jan 2024 • 18:45", amount: "- €32.50", type: "purchase" },
  { id: "t4", title: "Glazed Luxury Tower", date: "10 Jan 2024 • 11:30", amount: "- €58.00", type: "purchase" },
];

/* ─── sub-components ─── */
function TransactionRow({ tx }: { tx: Transaction }) {
  const isTopUp = tx.type === "topup";
  return (
    <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-100" style={s.txShadow}>
      <View className="flex-row items-center gap-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: isTopUp ? "#ecfdf5" : "#f8fafc" }}
        >
          <MaterialIcons
            name={isTopUp ? "add-card" : "shopping-bag"}
            size={20}
            color={isTopUp ? "#10b981" : SLATE_400}
          />
        </View>
        <View>
          <Text className="text-sm font-bold text-slate-900">{tx.title}</Text>
          <Text className="text-[10px] font-medium text-slate-400 mt-0.5">{tx.date}</Text>
        </View>
      </View>
      <Text className="text-sm font-bold" style={{ color: isTopUp ? "#10b981" : TEXT_PRIMARY }}>
        {tx.amount}
      </Text>
    </View>
  );
}

/* ─── main ─── */
export function WalletTab() {
  return (
    <View className="p-5 gap-6" style={{ backgroundColor: "#f8f5f6" }}>
      {/* ── Balance Card ── */}
      <LinearGradient
        colors={["#fb5187", "#ff7eaf"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 overflow-hidden"
        style={s.balanceShadow}
      >
        {/* Decorative watermark */}
        <View className="absolute top-0 right-0 opacity-10" style={{ transform: [{ translateX: 30 }, { translateY: -30 }] }}>
          <MaterialIcons name="payments" size={140} color="#fff" />
        </View>

        <View className="relative z-10">
          <Text className="text-white/80 text-xs font-bold uppercase" style={{ letterSpacing: 2 }}>
            Current Balance
          </Text>
          <Text className="text-white text-4xl font-extrabold mt-1" style={{ letterSpacing: -1 }}>
            {WALLET_BALANCE}
          </Text>

          <View className="flex-row gap-3 mt-8">
            <Pressable className="flex-1 bg-white h-11 rounded-xl flex-row items-center justify-center gap-2" style={s.topUpShadow}>
              <MaterialIcons name="add-circle" size={18} color={PRIMARY} />
              <Text className="text-sm font-bold" style={{ color: PRIMARY }}>Top Up</Text>
            </Pressable>
            <Pressable
              className="flex-1 h-11 rounded-xl flex-row items-center justify-center gap-2"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <MaterialIcons name="account-balance" size={18} color="#fff" />
              <Text className="text-sm font-bold text-white">Withdraw</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* ── Recent Transactions ── */}
      <View className="gap-4">
        <View className="flex-row justify-between items-end px-1">
          <Text className="text-[11px] font-bold text-slate-400 uppercase" style={{ letterSpacing: 2 }}>
            Recent Transactions
          </Text>
          <Pressable>
            <Text className="text-[10px] font-bold uppercase" style={{ color: PRIMARY, letterSpacing: 2 }}>
              View All
            </Text>
          </Pressable>
        </View>

        <View className="gap-3">
          {TRANSACTIONS.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  balanceShadow: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topUpShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  txShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
});
