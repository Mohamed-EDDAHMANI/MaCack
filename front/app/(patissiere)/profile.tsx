import { ProfileContent } from "@/components/common/profile-content";

export default function PatissiereProfileScreen() {
  return (
    <ProfileContent
      menuItems={[
        { icon: "cake", label: "My Products" },
        { icon: "receipt-long", label: "Orders" },
        { icon: "account-balance-wallet", label: "Earnings" },
        { icon: "people", label: "Followers" },
      ]}
    />
  );
}
