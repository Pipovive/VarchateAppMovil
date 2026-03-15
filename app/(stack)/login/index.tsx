import Button from '@/components/shared/button';
import Divider from '@/components/shared/divider';
import Input from '@/components/shared/input';
import { useTheme } from '@/src/context/ThemeContext';
import { signInWithGoogle } from '@/src/services/googleAuth';
import { useLoginViewModel } from '@/src/viewmodels/LoginViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface LaravelValidationError {
  message: string
  errors: Record<string, string[]>
}

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const { loginUser, loading } = useLoginViewModel()
  const { loginWithGoogleToken } = useUserViewModel();
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#343734' : '#FFFFFF',
    card: isDark ? '#1B1D23' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
  };

  const mostrarAlerta = (mensaje: string, titulo: string = 'Atención') => {
    Alert.alert(titulo, mensaje, [{ text: 'Aceptar' }]);
  };

  const traducirError = (mensaje: string): string => {
    const traducciones: Record<string, string> = {
      'The email field must be a valid email address.': 'El correo electrónico no es válido.',
      'The email has already been taken.': 'Este correo ya está registrado.',
      'The email field is required.': 'El correo es obligatorio.',
      'The password field is required.': 'La contraseña es obligatoria.',
      'The password field must be at least 8 characters.': 'La contraseña debe tener mínimo 8 caracteres.',
      'The password field confirmation does not match.': 'Las contraseñas no coinciden.',
      'These credentials do not match our records.': 'Correo o contraseña incorrectos.',
      'Too Many Attempts.': 'Demasiados intentos. Espera un momento.',
      'Unauthenticated.': 'Sesión expirada. Inicia sesión nuevamente.',
    };
    return traducciones[mensaje] ?? mensaje;
  };

  const handleLogin = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!email || !password) {
      mostrarAlerta('Completa todos los campos.');
      return;
    }
    try {
      const data = await loginUser(email, password)
      if (!data?.access_token) throw new Error('Token no recibido')
      router.replace('/(tabs)/home')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const data = error.response.data as LaravelValidationError
          const primerError = data.errors ? Object.values(data.errors)[0][0] : data.message;
          mostrarAlerta(traducirError(primerError));
          return;
        }
        if (error.response?.status === 401) {
          // ← Detectar cuenta Google
          if (error.response.data?.message?.includes('Google')) {
            Alert.alert(
              '🔐 Cuenta de Google',
              'Esta cuenta fue registrada con Google. Por favor inicia sesión con el botón de Gmail.',
              [{ text: 'Entendido' }]
            );
            return;
          }
          mostrarAlerta('Correo o contraseña incorrectos.');
          return;
        }
        if (!error.response) {
          mostrarAlerta('No se pudo conectar con el servidor. Verifica tu conexión.');
          return;
        }
        mostrarAlerta(traducirError(error.response?.data?.message || error.message));
        return;
      }
      mostrarAlerta('Ocurrió un error inesperado.');
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const userInfo = await signInWithGoogle();
      if (userInfo.type === 'success') {
        const idToken = userInfo.data.idToken;
        if (!idToken) {
          mostrarAlerta('No se pudo obtener el token de Google.', 'Error');
          return;
        }
        await loginWithGoogleToken(idToken);
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      mostrarAlerta(error.message, 'Error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <View className='mx-3 justify-center items-center' pointerEvents="none">
        <Image style={{ width: 200, resizeMode: 'contain', marginTop: 20 }} source={require('../../../assets/images/logo2.png')} />
        <Image style={{ width: 200, resizeMode: 'contain', marginTop: -100 }} source={require('../../../assets/images/gato_computador.png')} />
      </View>

      <View style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 16,
        marginTop: -100,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: 8
      }}>
        <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', marginBottom: 12, fontSize: 24, color: colors.text }}>
          Iniciar Sesión
        </Text>

        <Input
          isDark={isDark}
          placeholder='Correo'
          value={email}
          error={emailTouched && !email ? 'El correo es obligatorio' : ''}
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={setEmail}
          onBlur={() => setEmailTouched(true)}
          editable={!loading}
        />

        {/* Contraseña con ojito */}
        <View style={{ position: 'relative' }}>
          <Input
            isDark={isDark}
            placeholder='Contraseña'
            value={password}
            error={passwordTouched && password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres' : ''}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            onBlur={() => setPasswordTouched(true)}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 16, top: 14 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>

        <Button variant='text-only' textPos='left' className='mx-[-11] mt-[-18]'
          onPress={() => router.push('/(stack)/forgotPassword')}>
          ¿Olvidaste la contraseña?
        </Button>

        <Button variant='contained' className='mt-3' onPress={handleLogin} disabled={loading}>
          {loading ? 'Cargando...' : 'Entrar'}
        </Button>

        <Divider />

        <View className='w-full'>
          <Button variant='google' className='px-10' disabled={isLoading} onPress={handleGoogleLogin}>
            Gmail
          </Button>
          {isLoading && <ActivityIndicator color="#0099FF" size="small" />}
        </View>
      </View>

      <View className='flex-row items-center mt-3 justify-center'>
        <Text style={{ color: colors.subtext, fontFamily: 'Barlow-Medium' }}>¿No tienes cuenta?</Text>
        <Button variant='text-only' textPos='center' onPress={() => router.push('/(stack)/register')}>
          Regístrate
        </Button>
      </View>
    </>
  )
}

export default LoginScreen