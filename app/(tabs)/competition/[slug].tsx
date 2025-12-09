import { TopProgressHeader } from "@/components/shared/headerProgress";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompetitionDetail() {
  const { slug } = useLocalSearchParams();

  return (
    <>
      <SafeAreaView>
        <TopProgressHeader 
        title="Mi Competencia"
        progress={40}
        activeSlug={slug as string} // 👈 obligatorio
      />

      {/* resto de tu pantalla */}
      </SafeAreaView>
      
    </>
  );
}
