import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompetitionDetail() {
  const { slug } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">
        Competencia: {slug}
      </Text>

      <View>
        <Text className="text-base text-gray-600">
          Aquí cargarás los datos de la competencia usando el slug.
        </Text>
      </View>
    </SafeAreaView>
  );
}
