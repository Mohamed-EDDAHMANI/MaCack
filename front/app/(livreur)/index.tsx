import { Redirect } from "expo-router";

export default function LivreurIndex() {
  // No dashboard view — always use the client tabs (Explore/products UI)
  return <Redirect href="/(main)" />;
}
