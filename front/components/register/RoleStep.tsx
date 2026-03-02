import { View, Text } from "react-native";
import { RoleCard } from "./RoleCard";
import type { RegisterRole } from "@/types/register";

// Same image URLs as HTML reference; Livreur = delivery person (Unsplash)
const CLIENT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5Pn0s8hdDSX4x1tO-gr8EuLFFg0r3OTwHMyYoB35WOdDTs35JXoAMXP1huPoO-emFKOkwSaKQawvOIAaomyx2cZynyWDqJ_ZK-_aScJDUtKDWXw2fXfXwcXIinF3-8G36VpAZWlmOZFB_3Qjmqf-yqz5pedJO9lYnivwproAf7f5UenMJ0zVXYBEkt-BK2GTX_lpJbs1OtRyNjzLT0cCMPnW0FjZsnO_BAQvCVegNIlWl4Ub1D7m5oVsecvvLgpYThsnZ7FSGUAQ";
const PATISSIERE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCDnIu4KA7nkz0J5xvgChnnCCsyIBZcAIynHGwz_gY2ClZC854C4CsnxHvt75rjSPFk1WEZOeYP7fTSi5Iz45LM9NfzLhNx6SQS489kmR-zTWLNJFmlPwBfdqhFnqbxt4CzLii0xd6kL9azsrLl-cdqaAlds6e5b25TQ-Gen-G6TW7SuLhj9m_awznEJSud9hWFG-25LYZGZZm1jdqsqjINsCH3xzD53Aa7XNtNo6CkXOJq3vAe3ap8Efi9JwIV2abYrNF5-x3bHU";
const LIVREUR_IMAGE =
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80";

const ROLES: {
  role: RegisterRole;
  title: string;
  description: string;
  imageUri: string;
}[] = [
  {
    role: "CLIENT",
    title: "Client",
    description: "I want to discover and order premium home-made pastries.",
    imageUri: CLIENT_IMAGE,
  },
  {
    role: "PATISSIERE",
    title: "Pâtissière",
    description: "I want to share my passion and sell my creations to the world.",
    imageUri: PATISSIERE_IMAGE,
  },
  {
    role: "LIVREUR",
    title: "Livreur",
    description: "I want to deliver orders and earn with each delivery.",
    imageUri: LIVREUR_IMAGE,
  },
];

interface RoleStepProps {
  selectedRole: RegisterRole | null;
  onSelectRole: (role: RegisterRole) => void;
}

export function RoleStep({ selectedRole, onSelectRole }: RoleStepProps) {
  return (
    <View className="px-4">
      <Text className="text-slate-900 text-lg font-bold tracking-tight pb-4">
        I am a...
      </Text>
      <View style={{ gap: 16 }}>
        {ROLES.map((r) => (
          <RoleCard
            key={r.role}
            role={r.role}
            title={r.title}
            description={r.description}
            imageUri={r.imageUri}
            selected={selectedRole === r.role}
            onSelect={() => onSelectRole(r.role)}
          />
        ))}
      </View>
    </View>
  );
}
