import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/features/auth";
import { buildPhotoUrl } from "@/lib/utils";
import {
  PRIMARY,
  BACKGROUND_LIGHT,
  SLATE_400,
  SLATE_500,
  SLATE_600,
  SLATE_800,
  SURFACE,
  BORDER,
  BORDER_SUBTLE,
  PRIMARY_TINT,
  TEXT_PRIMARY,
} from "@/constants/colors";

const COVER_HEIGHT = 256;
const AVATAR_SIZE = 128;
const TAB_NAMES = ["Portfolio", "Reviews", "Services", "About"] as const;

// Placeholder cover and portfolio images (matching HTML style)
const DEFAULT_COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4LmExY8RmRYcaIsAzzhQV2yzeVmUKwyBc5_wHqq4aGJQeET1Y7JLuGUPeNSc75CcDyye3PZY2pLdT7Wc23f98W82O_gshMP0schcz-4UjJP-MNr020xayqg670kpPQZncMCVm4Kt9Xkw_awkKKDW6aX-xaOgbWS0sUSDMUkbavd0mIivb9kIp1wAMWHa4tm1DdUrmct6butv_jLdz2Xcq6S8yOt2hV6KJiYZ3M25IqLKI2RYKhlxwLbmE6Z3rRTcf6atdza9eZeEe";

const PORTFOLIO_PLACEHOLDERS = [
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3e9RlBVNfJHohOGY1lHj5eOdu43AMkpTxHE3-KRhzoay9AOKK5MF_EtrUrE3CQBMGqG7PLSi6hzt0vjK8sPuMj0tEeTF56uqWCtdh-8ppVNDXnFX7-5r5SanTeil4Hx8dsa7zooTCmZVrXwpF6WYPSDPq9q6mou5Zh0uPecrxY0NCXrbzDn1GtGvJHXPZepI0d4OKL83iN5sfshaj_nx_q2aAOeK6ifqHM09jJK_2uN-6qrZby5z4If1GRNqBuiFgUBtyHp1CITyt", price: "€450+" },
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL8XEpKdrGQuu228k-Abl9C25F_4hXjhpmg66oh4t_p6e3mCFbfiRpmSCPHVpoIRaWn78angfMXElJGSHmHT2Fn49zhI8r6gT1VvZGTXIRARCzEEbOtbZgqwWnFibikvhgyiis_KRiwdqs5vwR3AgPdLUh1yBZDkSEjYSNvibP7sAFIuh_B7wnssVCubHB5W4XM2lYKFgf0zWrMZ-WzrK0u8Nlb7aWaOyYlOfn3sMEDVoL3In_ptZiB8iOKhAPrMXaaRR6gCuLhI0W", price: "€25+" },
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnHiNk3NBS_5fwEjxP4a0Lip-kcy7_FPoUZvetsSq0cnuZTnDqf0uRxIGSP3D0f2lAkx2L0Nbo32FVpo1CTcmzQ6SlrBXLiFhetTiqbkdsV4pqa3BMnH7ISVEMGx3i0yEosbIxEQGXJUDSazk6RlStBtUysD5unDywvAEMh1ek63V7gv3u-JW6LPBFgAtq5_chxF0Oe5uRSdLaA11xdtwUYI31VL2Sb2ANIfV7xmjb3nCBtWwrkKtv3ybzsStFdp05JhRr8W8Ey48k", price: "€180+" },
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfo7c36AsAB3wxpxxBnuCJ425Zfk8Bqz8MTDMTQlSpcaXBrYR8IwgIUeXpvbQjsQ62sVJpZpbeZqcdR_iuiPQThaEUcUTCcVUBJR3PTSdoB8pHD2GY78zbVZJAsX-t9VspiLqmtyk1kxG3g7V9LgR7L5b06Ml_q8TpA2mq3eOXn_eupXB73cY6JUs2gqWqD59RZe752Cywf_uAu6UjuQ-JECLrAiQun3Hqw4k5W-pwltfaHHh3n10LB-qa5FWCaGLsWLTJv3gnYN5Z", price: "€320+" },
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDdp6nFM_nFXon1bBm2DMSS3lR93eboqi5jcvt8iFUVwDBKHIIrb79GI2lR7R5yfNAih6CWbMCn6DSHJZ9Ne8kMoWImAokjWuVjk5Sp_tB3nuFva8rE3JYavYAdjyGGCfIRP0aRmBIQUYY74vLm1CbL4gBPY4XpOKALAFyiLQqY76ceVgucV4_YU4dJKJm9NvVllHcFLYI2ii7-3tAtCcOFkWXz4M-L_9UeWBLmSJn8EG771cuIFCzs8olMjDn_IkWLJNwb7-HWOwm", price: "€45+" },
  { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjIyYiHDQe2lrJ9hQOKZLaTXt8UrDHJyGnkIfbSzof23wd2jtIFXLhJRIeB-3CDOStRvyPBOLHRmV5w3-u8iYQ0V9hH6DayccQHuK_QuiA3s7QoMUrcANIG-KevOYPPyljy39Mc6drsusS7ei_i40HGZucA6JqV76kZUWGxLXh2rhHIH2hvWu8RDTXXBD7_8J7QSw7HiYLeT5vrwsjFDl9KQmtmlxBPhLGGgL75c34pLw5-_k4mNw1u0Va7yOu8UTdQi5nsxU0j41k", price: "€150+" },
];

interface ProfileContentProps {
  menuItems?: Array<{ icon: string; label: string; onPress?: () => void }>;
  /** When provided, the screen shows another user's profile. */
  viewedUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    photo?: string | null;
    coverPhoto?: string | null;
  } | null;
  /** Force showing/hiding the back button. Default: show only for other users. */
  showBack?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 2;
const GRID_PADDING = 8;
const CELL_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

export function ProfileContent({ menuItems = [], viewedUser, showBack }: ProfileContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const profileUser = viewedUser ?? authUser;

  const isOwnProfile = useMemo(() => {
    const a = authUser?.id;
    const p = profileUser?.id;
    if (!a || !p) return true;
    return a === p;
  }, [authUser?.id, profileUser?.id]);

  const effectiveShowBack = showBack ?? !isOwnProfile;

  const userPhoto = buildPhotoUrl(profileUser?.photo ?? null);
  const coverPhoto = buildPhotoUrl(profileUser?.coverPhoto ?? null);

  const [activeTab, setActiveTab] = useState<(typeof TAB_NAMES)[number]>("Portfolio");
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  const roleLabel = profileUser?.role ? String(profileUser.role).replace(/_/g, " ") : "";
  const subtitle = [roleLabel, "MaCack"].filter(Boolean).join(" • ");

  return (
    <View style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover + overlay */}
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: coverPhoto || DEFAULT_COVER }}
            style={styles.coverImg}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", BACKGROUND_LIGHT]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Top bar */}
          <View style={styles.topBar}>
            {effectiveShowBack ? (
              <Pressable onPress={() => router.back()} style={styles.glassBtn}>
                <BlurView
                  intensity={80}
                  tint="light"
                  style={styles.glassBtnInner}
                  {...(Platform.OS === "android"
                    ? { experimentalBlurMethod: "dimezisBlurView" as const }
                    : {})}
                >
                  <MaterialIcons name="arrow-back" size={22} color="#fff" />
                </BlurView>
              </Pressable>
            ) : (
              <View style={{ width: 40, height: 40 }} />
            )}
            <View style={styles.topBarRight}>
              <Pressable style={styles.glassBtn}>
                <BlurView intensity={80} tint="light" style={styles.glassBtnInner} {...(Platform.OS === "android" ? { experimentalBlurMethod: "dimezisBlurView" as const } : {})}>
                  <MaterialIcons name="share" size={22} color="#fff" />
                </BlurView>
              </Pressable>
              <Pressable style={styles.glassBtn} onPress={() => setOptionsVisible(true)}>
                <BlurView intensity={80} tint="light" style={styles.glassBtnInner} {...(Platform.OS === "android" ? { experimentalBlurMethod: "dimezisBlurView" as const } : {})}>
                  <MaterialIcons name="more-horiz" size={22} color="#fff" />
                </BlurView>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Profile block (overlap) */}
        <View style={styles.profileBlock}>
          <View style={styles.avatarRing}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={56} color={PRIMARY} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{profileUser?.name ?? "User"}</Text>
          <Text style={styles.subtitle}>{subtitle || profileUser?.email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={14} color="#eab308" />
              <Text style={styles.statBold}>4.9</Text>
              <Text style={styles.statMuted}>(215 reviews)</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statBold}>12.4k</Text>
              <Text style={styles.statMuted}>Followers</Text>
            </View>
          </View>

          {/* Action buttons (only when viewing other user) */}
          {!isOwnProfile ? (
            <View style={styles.actionRow}>
              <Pressable style={styles.followBtn}>
                <MaterialIcons name="person-add" size={20} color="#fff" />
                <Text style={styles.followBtnText}>Follow</Text>
              </Pressable>
              <Pressable style={styles.messageBtn}>
                <MaterialIcons name="mail-outline" size={20} color={TEXT_PRIMARY} />
                <Text style={styles.messageBtnText}>Message</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Bio */}
          <Text style={styles.bio}>
            Specializing in bespoke architectural wedding cakes and French-inspired macarons. Making your celebrations sweeter, one masterpiece at a time.
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          {TAB_NAMES.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {/* Portfolio grid */}
        <View style={styles.gridWrap}>
          {PORTFOLIO_PLACEHOLDERS.map((item, i) => (
            <View key={i} style={styles.gridItem}>
              <Image source={{ uri: item.uri }} style={styles.gridImg} contentFit="cover" />
              <View style={styles.gridPriceBadge}>
                <Text style={styles.gridPriceText}>{item.price}</Text>
              </View>
              <View style={styles.gridFav}>
                <MaterialIcons name="favorite" size={12} color="#fff" />
                <Text style={styles.gridFavCount}>1.2k</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Log out (optional quick action for own profile) */}
        {isOwnProfile ? (
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Options modal (three dots) */}
      <Modal
        visible={optionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsVisible(false)}
      >
        <Pressable style={styles.optionsBackdrop} onPress={() => setOptionsVisible(false)}>
          <Pressable style={styles.optionsCard} onPress={(e) => e.stopPropagation()}>
            {isOwnProfile ? (
              <>
                <Pressable
                  style={styles.optionRow}
                  onPress={() => {
                    setOptionsVisible(false);
                    router.push("/edit-profile" as any);
                  }}
                >
                  <MaterialIcons name="edit" size={20} color={TEXT_PRIMARY} />
                  <Text style={styles.optionText}>Edit profile</Text>
                </Pressable>
                <Pressable
                  style={styles.optionRow}
                  onPress={() => {
                    setOptionsVisible(false);
                    router.push("/settings" as any);
                  }}
                >
                  <MaterialIcons name="settings" size={20} color={TEXT_PRIMARY} />
                  <Text style={styles.optionText}>Settings</Text>
                </Pressable>
                <View style={styles.optionDivider} />
                <Pressable
                  style={styles.optionRow}
                  onPress={() => {
                    setOptionsVisible(false);
                    handleLogout();
                  }}
                >
                  <MaterialIcons name="logout" size={20} color="#ef4444" />
                  <Text style={[styles.optionText, { color: "#ef4444" }]}>Log out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={styles.optionRow} onPress={() => setOptionsVisible(false)}>
                  <MaterialIcons name="share" size={20} color={TEXT_PRIMARY} />
                  <Text style={styles.optionText}>Share profile</Text>
                </Pressable>
                <Pressable style={styles.optionRow} onPress={() => setOptionsVisible(false)}>
                  <MaterialIcons name="flag" size={20} color={TEXT_PRIMARY} />
                  <Text style={styles.optionText}>Report</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND_LIGHT },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  coverWrap: {
    height: COVER_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 12,
    zIndex: 10,
  },
  glassBtn: {
    borderRadius: 9999,
    overflow: "hidden",
  },
  glassBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  topBarRight: { flexDirection: "row", gap: 8 },
  profileBlock: {
    marginTop: -64,
    paddingHorizontal: 16,
    alignItems: "center",
    zIndex: 20,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: SURFACE,
    overflow: "hidden",
    backgroundColor: SURFACE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_TINT,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: PRIMARY,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statBold: { fontSize: 13, fontWeight: "700", color: TEXT_PRIMARY },
  statMuted: { fontSize: 12, color: SLATE_500 },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SLATE_400,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 24,
    paddingHorizontal: 0,
  },
  followBtn: {
    flex: 1,
    height: 48,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  followBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  messageBtn: {
    flex: 1,
    height: 48,
    backgroundColor: BORDER_SUBTLE,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  messageBtnText: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY },
  bio: {
    marginTop: 24,
    fontSize: 14,
    color: SLATE_600,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  tabsWrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SUBTLE,
  },
  tab: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: PRIMARY },
  tabText: { fontSize: 14, fontWeight: "500", color: SLATE_400 },
  tabTextActive: { fontWeight: "700", color: PRIMARY },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: GRID_GAP / 2,
    marginTop: 8,
    paddingHorizontal: GRID_PADDING,
  },
  gridItem: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: GRID_GAP / 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  gridImg: { width: "100%", height: "100%" },
  gridPriceBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridPriceText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  gridFav: {
    position: "absolute",
    top: 4,
    left: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  gridFavCount: { fontSize: 10, fontWeight: "700", color: "#fff" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fef2f2",
    borderRadius: 14,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#ef4444" },
  optionsBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 100 : 80,
    paddingRight: 16,
  },
  optionsCard: {
    width: 220,
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  optionDivider: {
    height: 1,
    backgroundColor: BORDER_SUBTLE,
  },
});
