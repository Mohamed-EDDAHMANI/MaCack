import { View } from "react-native";
import { PRIMARY } from "@/constants/colors";

type ProgressDotsProps = {
  currentStep: number;
  totalSteps?: number;
};

export function ProgressDots({ currentStep, totalSteps = 3 }: ProgressDotsProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 20 }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i + 1 === currentStep;
        return (
          <View
            key={i}
            style={{
              width: isActive ? 10 : 8,
              height: isActive ? 10 : 8,
              borderRadius: 9999,
              backgroundColor: isActive ? PRIMARY : PRIMARY + "33",
              shadowColor: isActive ? PRIMARY : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isActive ? 0.4 : 0,
              shadowRadius: 8,
              elevation: isActive ? 4 : 0,
            }}
          />
        );
      })}
    </View>
  );
}
