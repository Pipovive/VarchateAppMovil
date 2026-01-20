import { Stack } from 'expo-router';
import { JSX, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type TabKey = 'html' | 'css' | 'js' | 'run';

export default function CodeEditor(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('html');

  const [html, setHtml] = useState<string>(
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi primera página</title>\n</head>\n<body>\n  <h1>Hola Mundo</h1>\n</body>\n</html>'
  );

  return (
    <>
      {/* Header */}
      <Stack.Screen
        options={{
          title: 'HTML',
        }}
      />

      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Tab  label="HTML" active={activeTab === 'html'} onPress={() => setActiveTab('html')} />
          <Tab label="CSS" active={activeTab === 'css'} onPress={() => setActiveTab('css')} />
          <Tab label="JS" active={activeTab === 'js'} onPress={() => setActiveTab('js')} />
          <Tab label="Ejecución" active={activeTab === 'run'} onPress={() => setActiveTab('run')} />
        </View>

        {/* Contenido */}
        {activeTab === 'html' && (
          <TextInput
            value={html}
            onChangeText={setHtml}
            style={styles.editor}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        )}

        {activeTab !== 'html' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Sección {activeTab.toUpperCase()} próximamente
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

/* ---------- Tab Component ---------- */

interface TabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Tab({ label, active, onPress }: TabProps): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  tabs: {
    backgroundColor: '#AFCBFF',
    flexDirection: 'row',
    justifyContent: 'space-around', // separación uniforme
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',

  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#0A84FF',
  },

  tabText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },

  tabTextActive: {
    color: '#0A84FF',
    fontWeight: '600',
  },

  editor: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#9CA3AF',
  },
});
