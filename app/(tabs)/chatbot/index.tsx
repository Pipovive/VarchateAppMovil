import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: '¡Hola! 👋 Soy tu asistente de programación. ¿En qué puedo ayudarte hoy?',
    isBot: true,
    timestamp: new Date(),
  },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Simular respuesta del bot
  const sendBotResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        '¡Excelente pregunta! En programación, siempre hay múltiples formas de resolver un problema. 💡',
        'Eso es correcto. ¿Te gustaría que profundice más en el tema? 🤔',
        'Interesante punto. Déjame explicarte con un ejemplo práctico... 📝',
        'Para eso, te recomiendo practicar con ejercicios del módulo de JavaScript. 🚀',
        'Si tienes más dudas, no dudes en preguntar. Estoy aquí para ayudarte. 😊',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simular respuesta del bot
    sendBotResponse(inputText);
  };

  useEffect(() => {
    // Auto scroll al último mensaje
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-primary-600">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View className="bg-primary-100 px-4 py-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary-200 rounded-full items-center justify-center mr-3">
              <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-barlow-bold text-lg text-quaternary">
                Asistente Virtual
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <Text className="font-barlow-regular text-sm text-quaternary/80">
                  En línea
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* MENSAJES */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Indicador de escritura */}
          {isTyping && (
            <View className="flex-row items-end mb-4">
              <View className="w-10 h-10 bg-primary-200 rounded-full items-center justify-center mr-2">
                <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
              </View>
              <View className="bg-quaternary rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <View className="flex-row items-center space-x-1">
                  <View className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" />
                  <View className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce delay-100" />
                  <View className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce delay-200" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* SUGERENCIAS RÁPIDAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2 h-14 bg-primary-500"
          contentContainerStyle={{ gap: 8 }}
        >
          {['¿Qué es JavaScript?', '¿Cómo usar funciones?', 'Explica los arrays', '¿Qué es CSS?'].map(
            (suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setInputText(suggestion)}
                className="bg-quaternary rounded-full px-4 py-2 border h-12 border-primary-400"
              >
                <Text className="font-barlow-medium text-sm text-primary-200">
                  {suggestion}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* INPUT */}
        <View className="bg-quaternary px-4 py-3 border-t border-primary-500">
          <View className="flex-row items-center bg-primary-600 rounded-full px-4 py-2">
            <TouchableOpacity className="mr-2">
              <Ionicons name="add-circle-outline" size={24} color="#3478E6" />
            </TouchableOpacity>

            <TextInput
              className="flex-1 font-barlow-regular text-base text-secondary py-2"
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#8C8C8C"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={inputText.trim() === ''}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim() === '' ? 'bg-secondary-800' : 'bg-primary-100'
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() === '' ? '#B3B3B3' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// COMPONENTE DE BURBUJA DE MENSAJE
function MessageBubble({ message }: { message: Message }) {
  const isBot = message.isBot;

  return (
    <View className={`flex-row items-end mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <View className="w-10 h-10 bg-primary-200 rounded-full items-center justify-center mr-2">
          <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
        </View>
      )}

      <View
        className={`max-w-[80%] ${
          isBot
            ? 'bg-quaternary rounded-2xl rounded-bl-none'
            : 'bg-primary-100 rounded-2xl rounded-br-none'
        } px-3 py-2 shadow-sm flex-shrink-0`}
      >
        <Text
          className={`font-barlow-regular text-base ${
            isBot ? 'text-secondary' : 'text-quaternary'
          }`}
        >
          {message.text}
        </Text>
        <Text
          className={`font-barlow-regular text-xs mt-1 ${
            isBot ? 'text-secondary-700' : 'text-quaternary/70'
          }`}
        >
          {message.timestamp.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {!isBot && (
        <View className="w-10 h-10 bg-primary-200 rounded-full items-center justify-center ml-2">
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}