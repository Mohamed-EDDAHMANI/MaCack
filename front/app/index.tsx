import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";

/**
 * Root index — redirects to the correct role-based tab group
 * or to the client explore (public) if not authenticated.
 */
export default function RootIndex() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!isAuthenticated) {
    // Unauthenticated users land on the client explore screen (public browsing)
    return <Redirect href="/(client)" />;
  }

  switch (role) {
    case "PATISSIERE":
      return <Redirect href="/(patissiere)" />;
    case "LIVREUR":
      return <Redirect href="/(livreur)" />;
    case "CLIENT":
    default:
      return <Redirect href="/(client)" />;
  }
}
