import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { ProfileContent } from "@/components/common/profile-content";
import { ClientProfile } from "@/components/client/client-profile";
import { TabScreenWithAnimation } from "@/components/TabScreenWithAnimation";
import { BACKGROUND_LIGHT, SLATE_500 } from "@/constants/colors";

export default function MainProfileScreen() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user?.role);
  const { showAuthModal } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated) showAuthModal();
  }, [isAuthenticated, showAuthModal]);

  if (!isAuthenticated) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Login or register to continue</Text>
      </View>
    );
  }

  if (role === "CLIENT") {
    return (
      <TabScreenWithAnimation>
        <ClientProfile />
      </TabScreenWithAnimation>
    );
  }

  return (
    <TabScreenWithAnimation>
      <ProfileContent />
    </TabScreenWithAnimation>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderText: {
    fontSize: 15,
    color: SLATE_500,
  },
});
