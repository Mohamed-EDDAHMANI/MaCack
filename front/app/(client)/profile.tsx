import { ProfileContent } from "@/components/common/profile-content";

export default function ClientProfileScreen() {
  return (
    <ProfileContent
      menuItems={[
        { icon: "shopping-bag", label: "My Orders" },
        { icon: "favorite-border", label: "Favorites" },
        { icon: "chat-bubble-outline", label: "Messages" },
      ]}
    />
  );
}
