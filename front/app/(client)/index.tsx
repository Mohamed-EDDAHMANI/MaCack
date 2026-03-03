import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PRIMARY, BACKGROUND_LIGHT, SLATE_400, SLATE_500 } from "@/constants/colors";
import { useAppSelector } from "@/store/hooks";
import { ProfilePopup } from "@/components/common/profile-popup";
import { buildPhotoUrl } from "@/lib/utils";

const FEATURED_CARD_WIDTH = 288;
const FEATURED_CARD_HEIGHT = 176;
const CHIP_GAP = 12;
const CARD_IMAGE_HEIGHT = 256;

const FEATURED_IMAGES = [
  {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9pA_J8r4iOjA84wG9idDak8r_ZtM3u_nH3PNqRAfDzRjCW9dxN5gqtywcUl1ZXC7Jki-BgSA5RdkaG44Tlazt0KhalmnvpP2PycJyhY6NEji0oUQn351I5DoVl183Yuf53KgKMbWR0T04WswXZ4Sy9qEGvZWZwJm5y_AMYOYV7jkykuEBGyFxFlntogAK3FxFedNJaa8y-rgmsNnERgCm5Qmk2Pj3kJPzwrGRPHIdR-1rOvdTBAxIm9MIYn4iwwA9Tb6SixQuTtQ",
    title: "Midnight Truffle",
    chef: "Chef Isabella Rivera",
  },
  {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAME012O-EAxvj6rhADX80Uw4xEVNAcY4eMNXnxajcJeLUBxFKmKTWeiGxYHM_VaQfdsuFs4lpCfUKl3snh-nMDirTONyGC1Pw1CcmlW2pqgRwjFGs6SKUy3DL0YIhNBk1_Y262TNWx6P9go8ZL_3GwbG1tZjoa_OItQw44kWXuObGSS3EZuDmWLX1dCw3ciQiEUJ_EWECl1pRlZQ-GoqJLVMlVvSEM9-ZUVGg2pzglkPop2Y7LlxbmPE5PjaubsEOf8YhGR8s_OeM",
    title: "Blushing Peony Tier",
    chef: "Chef Marcus Chen",
  },
];

const TRENDING_CARDS = [
  {
    imageUri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHuAa0G2U1GczO9nZkijiKJCUUWvDVMotVt2X2oY3zt_Ayl6-89ugPoa2mYRp_RmMD8JzPdaZxNkUqsOhiji3Rk0DXReqsZTaSXxwTVG_LjsH8EqC-BOgXYqGPTUnVbyxMxjkX5JQmPRYSJAcqYQSUIiu8dGl7iQJFv1FpY279iYHWObTk6VOsrlGpOQqMt_jXv06_azg5gd50HjcgbR2rLK8PfAd7h1P9d9h8i9GSpgcDb7zOWrcNUqzHHrXKe8oocmuyGTVY0Q0",
    title: "Wild Strawberry Velour",
    location: "Paris, FR",
    price: "$85",
    chefName: "Chef Sophie Laurent",
    chefAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzpCaVpNOQqDljOvjQEkIrS92XiCRy4rphkIZdacSbRd8Cd5gCn3GOMJlVDukJCUdtaf7GKwEY3oIBjsUZ3UieCQ65Hfb_wnpGN5Pzs0At7_1mAG0CNqaI5-sxTE_isbU-MjRajx6ofiz0embCMG2uu2xunxiXGXHgojNN_8gtJxv0MIF_H9MOxbtZ_x-76rcXsm0fRVepY-2IflnX8aTqSkq-6vfUlKeYfouXEC-5aKizz7JYZRqyKKu6Cujw81eBebzGzLWXWNA",
    rating: "4.9",
    isFav: true,
  },
  {
    imageUri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMpEkswN9y_-zi7zD4-8xKt6JyPMDA6_p7iVa9AHtMKhAjsqXHEf_BbE7PeOdmohVqGtjVTI6GIHFdyJwOXFCFogfD-nXx9f_KL72m4cIGxkdqytqHqyJx73zd4flax28oZD-lJpG8zn7WulO2RFubYjkUHAuT5yIH2w3rJn7Ft3DJYN5osrSHmJSL1aFtqI5Vb6neuJ99Zz1Ynfh7I0kqQa6QvzX_QB2t409fHzxlfTKaVwO8STejJRZ9zvDtWkG2QXQuE3JWxQE",
    title: "24K Chocolate Nocturne",
    location: "London, UK",
    price: "$120",
    chefName: "Chef Julian Ross",
    chefAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9js_zmyYz8p4-etGf8qf8z8X2YQyzYnaEeN_Y9B8vzpm4frdnReayStU57ATXeZKioTRhifza57d64dGLjghrt-ktjufSnoU7qTZJhBFHH8o-TfPq_LR-INVVJEAHA5gKjtduhvYpRSYVaqkl3S8B5KzD9lHN5JyDM3du-caP-W0I_5Cs4wYn353rbzmpQee5iNmKDW6X6AaIu7N3X5abvS2A0iQGDHash8bs1oWD_yAQFV4HoOR8BvHLWdI0O1dkkSdKM3S31y4",
    rating: "4.8",
    isFav: false,
  },
];

const CATEGORIES = ["All", "Birthday", "Wedding", "Chocolate", "Custom", "Kids"];

export default function ClientExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userPhoto = buildPhotoUrl(user?.photo);

  const openPopup = () => {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    setShowProfilePopup(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header */}
        <View style={styles.headerContainer}>
          <BlurView
            intensity={45}
            tint="light"
            {...(Platform.OS === "android" ? { experimentalBlurMethod: "dimezisBlurView" } : {})}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.headerColorOverlay} />

          <View style={styles.header}>
            <Pressable style={styles.iconBtn} hitSlop={12}>
              <MaterialIcons name="menu" size={28} color={PRIMARY} />
            </Pressable>
            <Text style={styles.logo}>MaCack</Text>
            <Pressable style={[styles.iconBtn, styles.avatarBtn]} hitSlop={12} onPress={openPopup}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.avatarImg} contentFit="cover" />
              ) : (
                <MaterialIcons name="person" size={24} color={PRIMARY} />
              )}
            </Pressable>
          </View>

          <ProfilePopup
            visible={showProfilePopup}
            onClose={() => setShowProfilePopup(false)}
            profileRoute="/(client)/profile"
          />

          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={22} color={PRIMARY + "99"} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cakes or pastry chefs"
              placeholderTextColor={SLATE_400}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
            style={styles.chipsScrollView}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.chip, selectedCategory === cat ? styles.chipActive : styles.chipInactive]}
              >
                <Text style={[styles.chipText, selectedCategory === cat ? styles.chipTextActive : styles.chipTextInactive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Masterpieces</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {FEATURED_IMAGES.map((item, i) => (
              <View key={i} style={styles.featuredCard}>
                <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredChef}>{item.chef}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Near You</Text>
          {TRENDING_CARDS.map((card, i) => (
            <View key={i} style={styles.trendingCard}>
              <View style={styles.trendingImageWrap}>
                <Image source={{ uri: card.imageUri }} style={styles.trendingImage} contentFit="cover" />
                <Pressable style={styles.heartBtn}>
                  <MaterialIcons name="favorite" size={22} color={card.isFav ? PRIMARY : PRIMARY + "66"} />
                </Pressable>
              </View>
              <View style={styles.trendingBody}>
                <View style={styles.trendingRow}>
                  <View>
                    <Text style={styles.trendingTitle}>{card.title}</Text>
                    <View style={styles.locationRow}>
                      <MaterialIcons name="location-on" size={14} color={SLATE_500} />
                      <Text style={styles.locationText}>{card.location}</Text>
                    </View>
                  </View>
                  <Text style={styles.price}>{card.price}</Text>
                </View>
                <View style={styles.trendingFooter}>
                  <View style={styles.chefRow}>
                    <Image source={{ uri: card.chefAvatar }} style={styles.chefAvatar} />
                    <Text style={styles.chefName}>{card.chefName}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <MaterialIcons name="star" size={16} color="#eab308" />
                    <Text style={styles.ratingText}>{card.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND_LIGHT },
  headerContainer: { overflow: "hidden", borderBottomWidth: 1, borderBottomColor: PRIMARY + "1A" },
  headerColorOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(248, 246, 247, 0.6)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  avatarBtn: {
    backgroundColor: PRIMARY + "1A",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    padding: 2,
    overflow: "hidden",
  },
  avatarImg: { width: 36, height: 36, borderRadius: 18 },
  logo: { fontSize: 20, fontWeight: "700", letterSpacing: -0.4, color: PRIMARY },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center" },
  searchIcon: { position: "absolute", left: 28, zIndex: 1 },
  searchInput: {
    height: 48,
    width: "100%",
    paddingLeft: 48,
    paddingRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  chipsScrollView: { flexGrow: 0 },
  chipsScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: CHIP_GAP, flexDirection: "row" },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 9999 },
  chipActive: { backgroundColor: PRIMARY },
  chipInactive: { backgroundColor: PRIMARY + "1A" },
  chipText: { fontSize: 14 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  chipTextInactive: { color: PRIMARY, fontWeight: "500" },
  main: { flex: 1 },
  mainContent: { paddingBottom: 24 },
  section: { paddingVertical: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  featuredScroll: { flexDirection: "row", gap: 16 },
  featuredCard: { width: FEATURED_CARD_WIDTH, height: FEATURED_CARD_HEIGHT, borderRadius: 12, overflow: "hidden" },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", padding: 16 },
  featuredTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  featuredChef: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  trendingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: PRIMARY + "0D",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendingImageWrap: { height: CARD_IMAGE_HEIGHT, position: "relative" },
  trendingImage: { width: "100%", height: "100%" },
  heartBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  trendingBody: { padding: 16 },
  trendingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  trendingTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  locationText: { fontSize: 14, color: SLATE_500 },
  price: { fontSize: 20, fontWeight: "700", color: PRIMARY },
  trendingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  chefRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  chefAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e2e8f0" },
  chefName: { fontSize: 14, fontWeight: "500", color: "#0f172a" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
});
