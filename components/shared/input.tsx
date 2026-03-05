import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface props extends TextInputProps {
    label?: string;
    error?: string;
    isDark?: boolean;
}

const Input = ({ label, error, isDark, ...rest }: props) => {
  return (
    <View style={{ width: '100%', marginBottom: 16 }}>
      {label && (
        <Text style={{ 
          marginBottom: 4, 
          fontSize: 14, 
          fontFamily: 'Barlow-Medium',
          color: isDark ? '#FFFFFF' : '#374151'
        }}>
          {label}
        </Text>
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,        // ← más redondeado
        borderWidth: 1,
        paddingHorizontal: 16,
        height: 52,              // ← más alto
        backgroundColor: isDark ? '#616461' : '#FFFFFF',
        borderColor: error ? '#EF4444' : isDark ? '#757575' : '#D1D5DB',
      }}>
        <TextInput
          style={{ flex: 1, fontSize: 16, fontFamily: 'Barlow-Medium', color: isDark ? '#FFFFFF' : '#111827' }}
          placeholderTextColor={isDark ? '#AAAAAA' : '#757575'}
          {...rest}
        />
      </View>
      {error && (
        <Text style={{ marginTop: 4, fontFamily: 'Barlow-Medium', fontSize: 14, color: '#EF4444' }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;