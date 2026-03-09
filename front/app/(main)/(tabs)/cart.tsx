import ClientCartScreen from "../../(client)/cart";
import { TabScreenWithAnimation } from "@/components/TabScreenWithAnimation";

export default function MainCartScreen() {
  return (
    <TabScreenWithAnimation>
      <ClientCartScreen />
    </TabScreenWithAnimation>
  );
}

