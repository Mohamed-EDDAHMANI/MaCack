import { ProfileContent } from "@/components/common/profile-content";

export default function LivreurProfileScreen() {
  return (
    <ProfileContent
      menuItems={[
        { icon: "inventory", label: "My Deliveries" },
        { icon: "account-balance-wallet", label: "Earnings" },
        { icon: "star-border", label: "My Ratings" },
      ]}
    />
  );
}
