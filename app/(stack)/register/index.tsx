import Button from '@/components/shared/button';
import Divider from '@/components/shared/divider';
import Input from '@/components/shared/input';
import { useTheme } from '@/src/context/ThemeContext';
import { signInWithGoogle } from '@/src/services/googleAuth';
import { useRegisterViewModel } from '@/src/viewmodels/RegisterViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [validPassword, setValidPassword] = useState('')
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { registerUser } = useRegisterViewModel()
  const { loginWithGoogleToken } = useUserViewModel();
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#343734' : '#FFFFFF',
    card: isDark ? '#1B1D23' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const userInfo = await signInWithGoogle();
      if (userInfo.type === 'success') {
        const { accessToken } = await GoogleSignin.getTokens();
        if (!accessToken) {
          Alert.alert('Error', 'No se pudo obtener el token');
          return;
        }
        await loginWithGoogleToken(accessToken);
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !nombre || !password || !validPassword || !checked) {
      alert('Completa todos los campos')
      return
    }
    if (password !== validPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    setIsLoading(true)
    try {
      await registerUser(nombre, email, password, validPassword, checked)
      setIsLoading(false)
      setTimeout(() => { router.replace('/(stack)/confirmed') }, 200)
    } catch (error: unknown) {
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const data = error.response.data as { message?: string; errors?: Record<string, string[]> }
          if (data.errors) { alert(Object.values(data.errors)[0][0]); return; }
          alert(data.message || 'Datos inválidos')
          return
        }
        if (error.response?.status === 401) { alert('Credenciales incorrectas'); return; }
        if (!error.response) { alert('No se pudo conectar con el servidor'); return; }
        alert(error.response?.data?.message || error.message)
        return
      }
      if (error instanceof Error) { alert(error.message); return; }
      alert('Ocurrió un error inesperado')
    }
  }

  return (
    <>
      <View style={{ marginHorizontal: 12, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: 200, resizeMode: 'contain', marginTop: 20 }} source={require('../../../assets/images/logo2.png')} />
      </View>

      <View style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: 8
      }}>
        <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', marginBottom: 8, fontSize: 24, color: colors.text }}>
          Registrarse
        </Text>

        <Input isDark={isDark} placeholder='Nombre' value={nombre}
          error={!nombre ? 'El nombre es obligatorio' : ''}
          onChangeText={setNombre} editable={!isLoading} />

        <Input isDark={isDark} placeholder='Correo' value={email}
          error={!email ? 'El correo es obligatorio' : ''}
          keyboardType='email-address' autoCapitalize='none'
          onChangeText={setEmail} editable={!isLoading} />

        <Input isDark={isDark} placeholder='Contraseña' value={password}
          error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres' : ''}
          secureTextEntry onChangeText={setPassword} editable={!isLoading} />

        <Input isDark={isDark} placeholder='Confirmar contraseña' value={validPassword}
          error={validPassword !== password ? 'Las contraseñas deben de ser iguales' : ''}
          secureTextEntry onChangeText={setValidPassword} editable={!isLoading} />

        {/* Checkbox términos */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => !isLoading && setChecked(!checked)}
            disabled={isLoading}
            style={{
              width: 20, height: 20, marginRight: 8, borderRadius: 4,
              borderWidth: 1, borderColor: colors.border,
              backgroundColor: checked ? '#0099FF' : colors.card,
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            {checked && <Text style={{ color: '#FFFFFF', fontSize: 12 }}>✔</Text>}
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: colors.subtext, flex: 1, fontFamily: 'Barlow-Medium' }}>
            Acepto los{' '}
            <Text style={{ color: '#0099FF', textDecorationLine: 'underline', fontFamily: 'Barlow-Medium' }}>
              términos y condiciones
            </Text>
          </Text>
        </View>

        {isLoading && (
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <ActivityIndicator color="#0099FF" size="small" />
          </View>
        )}

        <Button variant='contained' className='mt-4' onPress={handleRegister} disabled={!checked || isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </Button>

        <Divider />

        <Button variant='google' className='px-10' disabled={isLoading} onPress={handleGoogleLogin}>
          Gmail
        </Button>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' }}>
        <Text style={{ color: colors.subtext, fontFamily: 'Barlow-Medium' }}>¿Ya tienes cuenta?</Text>
        <Button variant='text-only' textPos='center' onPress={() => router.push('/(stack)/login')} disabled={isLoading}>
          Iniciar sesión
        </Button>
      </View>
    </>
  )
}

export default RegisterScreen