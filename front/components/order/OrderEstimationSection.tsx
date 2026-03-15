import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  PRIMARY,
  SURFACE,
  TEXT_PRIMARY,
  SLATE_500,
  SLATE_600,
  SLATE_700,
  BORDER_SUBTLE,
  BORDER,
  BACKGROUND_LIGHT,
} from "@/constants/colors";
import {
  getEstimationsByOrderIdApi,
  type EstimationItem,
} from "@/store/features/estimation";
import { getOrderSocket } from "@/lib/order-socket";

export interface OrderEstimationSectionProps {
  orderId: string;
  /** When this value changes, estimations list is refetched (e.g. after modal submit) */
  refetchTrigger?: number;
  /** Show "Your estimation" block for client; if false, only display delivery list */
  isClient?: boolean;
}

function formatEstimationTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderEstimationSection({
  orderId,
  refetchTrigger = 0,
  isClient = true,
}: OrderEstimationSectionProps) {
  const [list, setList] = useState<EstimationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstimations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEstimationsByOrderIdApi(orderId);
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchEstimations();
  }, [fetchEstimations, refetchTrigger]);

  // Real-time: refetch when an estimation is created for this order (client or delivery)
  useEffect(() => {
    const socket = getOrderSocket();
    const handler = (payload: { orderId?: string }) => {
      if (payload?.orderId === orderId) fetchEstimations();
    };
    socket.on("estimation.created", handler);
    return () => {
      socket.off("estimation.created", handler);
    };
  }, [orderId, fetchEstimations]);

  const clientEstimations = list.filter((e) => e.userRole === "client");
  const deliveryEstimations = list.filter((e) => e.userRole === "delivery");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estimations</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading estimations...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Part 1: Your estimation (client) */}
          <View style={styles.part}>
            <Text style={styles.partTitle}>Your estimation</Text>
            {clientEstimations.length > 0 ? (
              <View style={styles.estimationList}>
                {clientEstimations.map((e) => (
                  <EstimationCard key={e.id} item={e} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No client estimation yet.</Text>
            )}
          </View>

          {/* Part 2: Delivery estimations */}
          <View style={styles.part}>
            <Text style={styles.partTitle}>Delivery estimations</Text>
            {deliveryEstimations.length > 0 ? (
              <View style={styles.estimationList}>
                {deliveryEstimations.map((e) => (
                  <EstimationCard key={e.id} item={e} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No delivery estimations yet.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function EstimationCard({ item }: { item: EstimationItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.badge, item.userRole === "client" ? styles.badgeClient : styles.badgeDelivery]}>
          <Text style={styles.badgeText}>{item.userRole}</Text>
        </View>
        <Text style={styles.cardPrice}>{item.price.toFixed(2)} EUR</Text>
      </View>
      <Text style={styles.cardDetails} numberOfLines={4}>{item.details}</Text>
      <Text style={styles.cardTime}>{formatEstimationTime(item.createdAt)} • {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    overflow: "hidden",
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SUBTLE,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  loadingText: {
    fontSize: 13,
    color: SLATE_500,
    fontWeight: "600",
  },
  scroll: { maxHeight: 340 },
  scrollContent: { padding: 14, paddingBottom: 20 },
  part: {
    marginBottom: 18,
  },
  partTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: SLATE_600,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  estimationList: { gap: 10 },
  card: {
    backgroundColor: BACKGROUND_LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    padding: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeClient: { backgroundColor: "#dbeafe" },
  badgeDelivery: { backgroundColor: "#e0e7ff" },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: SLATE_700,
    textTransform: "uppercase",
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: PRIMARY,
  },
  cardDetails: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontWeight: "500",
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 11,
    color: SLATE_500,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 13,
    color: SLATE_500,
    fontStyle: "italic",
  },
});
