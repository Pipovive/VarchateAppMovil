import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

type TabKey = 'html' | 'css' | 'js' | 'run';

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<TabKey>('html');

  const [html, setHtml] = useState<string>(`<h1>Hola Mundo</h1>
<p>Edita el HTML, CSS y JS</p>`);

  const [css, setCss] = useState<string>(`body {
  font-family: Arial;
  background: #f9fafb;
}
h1 {
  color: #2563eb;
  font-size: 56px;
}`);

  const [js, setJs] = useState<string>(`console.log("Hola desde JS");`);

  const generateHTML = () => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
${css}
</style>
</head>
<body>
${html}

<script>
try {
${js}
} catch (e) {
  document.body.innerHTML += '<pre style="color:red">' + e + '</pre>';
}
</script>
</body>
</html>
`;

  return (
    <>
      <Stack.Screen options={{ title: 'Editor' }} />

      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Tab label="HTML" active={activeTab === 'html'} onPress={() => setActiveTab('html')} />
          <Tab label="CSS" active={activeTab === 'css'} onPress={() => setActiveTab('css')} />
          <Tab label="JS" active={activeTab === 'js'} onPress={() => setActiveTab('js')} />
          <Tab label="Ejecutar" active={activeTab === 'run'} onPress={() => setActiveTab('run')} />
        </View>

        {/* HTML */}
        {activeTab === 'html' && (
          <TextInput
            value={html}
            onChangeText={setHtml}
            style={styles.editor}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        )}

        {/* CSS */}
        {activeTab === 'css' && (
          <TextInput
            value={css}
            onChangeText={setCss}
            style={styles.editor}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        )}

        {/* JS */}
        {activeTab === 'js' && (
          <TextInput
            value={js}
            onChangeText={setJs}
            style={styles.editor}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        )}

        {/* RUN */}
        {activeTab === 'run' && (
          <WebView
            originWhitelist={['*']}
            source={{ html: generateHTML() }}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </>
  );
}

/* ---------------- TAB COMPONENT ---------------- */

interface TabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Tab({ label, active, onPress }: TabProps) {
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#AFCBFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#2563EB',
  },

  tabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  tabTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },

  editor: {
    flex: 1,
    padding: 14,
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#0f172a',
    color: '#e5e7eb',
    textAlignVertical: 'top',
  },
});
