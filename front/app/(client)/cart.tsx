import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import {
  PRIMARY,
  BACKGROUND_LIGHT,
  SURFACE,
  BORDER,
  BORDER_SUBTLE,
  SLATE_400,
  SLATE_500,
  SLATE_600,
  TEXT_PRIMARY,
  FLOATING_TAB_BAR_BOTTOM_SAFE,
} from "@/constants/colors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  clearCart as clearCartAction,
  updateQuantity,
  type CartItem,
} from "@/store/features/cart/cartSlice";

export default function ClientCartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const delivery = items.length > 0 ? 85 : 0;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + delivery + tax;
    return { subtotal, delivery, tax, total };
  }, [items]);

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <View style={styles.headerIconGhost} />
          </View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={styles.headerSide}>
            {items.length > 0 ? (
              <Pressable
                style={styles.iconBtn}
                hitSlop={10}
                onPress={clearCart}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color={SLATE_600}
                />
              </Pressable>
            ) : (
              <View style={styles.headerIconGhost} />
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart items */}
          {items.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons
                name="shopping-cart"
                size={40}
                color={SLATE_400}
              />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>
                Add a masterpiece cake to begin your order.
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <View style={styles.imageWrap}>
                      {item.imageUri ? (
                        <Image
                          source={{ uri: item.imageUri }}
                          style={styles.image}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[styles.image, { backgroundColor: BORDER_SUBTLE }]} />
                      )}
                    </View>
                    <View style={styles.itemBody}>
                      <View style={styles.itemHeaderRow}>
                        <Text
                          style={styles.itemTitle}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.itemPrice}>
                          {item.price.toFixed(0)} MAD
                        </Text>
                      </View>
                      <View style={styles.itemMeta}>
                        <Text style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Colors: </Text>
                          <Text style={styles.metaValue}>
                            {item.colors ?? "—"}
                          </Text>
                        </Text>
                        <Text style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Garniture: </Text>
                          <Text style={styles.metaValue}>
                            {item.garnish ?? "—"}
                          </Text>
                        </Text>
                        <Text style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Message: </Text>
                          <Text style={styles.metaValue}>
                            {item.message ?? "—"}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemFooter}>
                    <Pressable style={styles.editBtn}>
                      <MaterialIcons
                        name="edit"
                        size={18}
                        color={PRIMARY}
                      />
                      <Text style={styles.editText}>Edit Customization</Text>
                    </Pressable>
                    <View style={styles.qtyWrap}>
                      <Pressable
                        onPress={() =>
                          dispatch(updateQuantity({ id: item.id, delta: -1 }))
                        }
                        style={styles.qtyBtn}
                        hitSlop={10}
                      >
                        <MaterialIcons
                          name="remove"
                          size={18}
                          color={SLATE_600}
                        />
                      </Pressable>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <Pressable
                        onPress={() =>
                          dispatch(updateQuantity({ id: item.id, delta: +1 }))
                        }
                        style={[styles.qtyBtn, styles.qtyBtnPrimary]}
                        hitSlop={10}
                      >
                        <MaterialIcons
                          name="add"
                          size={18}
                          color="#fff"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Order summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {totals.subtotal.toFixed(0)} MAD
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {totals.delivery.toFixed(0)} MAD
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>
                  {totals.tax.toFixed(0)} MAD
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                <Text style={styles.summaryTotalValue}>
                  {totals.total.toFixed(0)} MAD
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Checkout button */}
        <View style={styles.checkoutBar}>
          <Pressable style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SUBTLE,
    backgroundColor: BACKGROUND_LIGHT,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  headerSide: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconGhost: {
    width: 32,
    height: 32,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemRow: {
    flexDirection: "row",
    gap: 12,
  },
  imageWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: BORDER_SUBTLE,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  itemBody: {
    flex: 1,
    minWidth: 0,
  },
  itemHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
  },
  itemMeta: {
    marginTop: 2,
  },
  metaRow: {
    fontSize: 12,
    color: SLATE_500,
    marginTop: 2,
  },
  metaLabel: {
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  metaValue: {
    color: SLATE_600,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER_SUBTLE,
    marginTop: 10,
    paddingTop: 10,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY,
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BORDER_SUBTLE,
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SURFACE,
  },
  qtyBtnPrimary: {
    backgroundColor: PRIMARY,
  },
  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  summarySection: {
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: SLATE_600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: BORDER_SUBTLE,
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: PRIMARY,
  },
  checkoutBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: FLOATING_TAB_BAR_BOTTOM_SAFE - 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "transparent",
    borderTopWidth: 0,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  emptyWrap: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  emptyText: {
    fontSize: 14,
    color: SLATE_500,
    textAlign: "center",
    maxWidth: 260,
  },
});

