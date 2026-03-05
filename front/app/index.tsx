import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";

/**
 * Root index — always redirect to the client tab group.
 * (No dashboard / role-based tabs.)
 */
export default function RootIndex() {
  // Keep selector so this screen reacts to login/logout.
  useAppSelector((state) => state.auth.isAuthenticated);
  return <Redirect href={"/(main)" as any} />;
}
