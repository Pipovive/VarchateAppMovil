import Button from '@/components/shared/button';
import Divider from '@/components/shared/divider';
import Input from '@/components/shared/input';
import { useTheme } from '@/src/context/ThemeContext';
import { signInWithGoogle } from '@/src/services/googleAuth';
import { useRegisterViewModel } from '@/src/viewmodels/RegisterViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showValidPassword, setShowValidPassword] = useState(false);
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
    if (!passwordValid) {
      alert('La contraseña no cumple los requisitos')
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
          if (data.errors) {
            const primerError = Object.values(data.errors)[0][0];
            alert(traducirError(primerError));
            return;
          }
          alert(traducirError(data.message || 'Datos inválidos'));
          return;
        }
        if (error.response?.status === 401) {
          alert('Correo o contraseña incorrectos');
          return;
        }
        if (!error.response) {
          alert('No se pudo conectar con el servidor. Verifica tu conexión.');
          return;
        }
        alert(traducirError(error.response?.data?.message || error.message));
        if (error.response?.status === 401) { alert('Credenciales incorrectas'); return; }
        if (!error.response) { alert('No se pudo conectar con el servidor'); return; }
        alert(error.response?.data?.message || error.message)
        return
      }
      if (error instanceof Error) { alert(error.message); return; }
      alert('Ocurrió un error inesperado')
    }
  }

  const passwordRules = [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Una letra mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Una letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Un número', valid: /[0-9]/.test(password) },
  ];
  const passwordValid = passwordRules.every(r => r.valid);

  const traducirError = (mensaje: string): string => {
    const traducciones: Record<string, string> = {
      // Email
      'The email field must be a valid email address.': 'El correo electrónico no es válido.',
      'The email has already been taken.': 'Este correo ya está registrado.',
      'The email field is required.': 'El correo es obligatorio.',
      // Nombre
      'The nombre field is required.': 'El nombre es obligatorio.',
      'The nombre field must be at least 3 characters.': 'El nombre debe tener al menos 3 caracteres.',
      // Contraseña
      'The password field is required.': 'La contraseña es obligatoria.',
      'The password field must be at least 8 characters.': 'La contraseña debe tener mínimo 8 caracteres.',
      'The password field confirmation does not match.': 'Las contraseñas no coinciden.',
      'The password field must contain at least one uppercase and one lowercase letter.': 'La contraseña debe tener mayúsculas y minúsculas.',
      'The password field must contain at least one number.': 'La contraseña debe contener al menos un número.',
      // Términos
      'The terms accepted field must be accepted.': 'Debes aceptar los términos y condiciones.',
      // Generales
      'The given data was invalid.': 'Los datos ingresados no son válidos.',
      'Too Many Attempts.': 'Demasiados intentos. Espera un momento.',
      'Unauthenticated.': 'Sesión expirada. Inicia sesión nuevamente.',
      'Server Error': 'Error del servidor. Intenta más tarde.',
    };

    return traducciones[mensaje] ?? mensaje;
  };

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


        <View style={{ position: 'relative', marginBottom: 0 }}>
          <Input isDark={isDark} placeholder='Contraseña' value={password}
            secureTextEntry={!showPassword} onChangeText={setPassword} editable={!isLoading} />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 16, top: 14 }}
          >
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Indicador de requisitos */}
        {password.length > 0 && (
          <View style={{
            backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB'
          }}>
            {passwordRules.map((rule, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i < passwordRules.length - 1 ? 6 : 0 }}>
                <Text style={{ fontSize: 13, marginRight: 8 }}>
                  {rule.valid ? '✅' : '⭕'}
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: rule.valid ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280'),
                  fontFamily: 'Barlow-Medium'
                }}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ position: 'relative', marginBottom: 0 }}>
          <Input isDark={isDark} placeholder='Confirmar contraseña' value={validPassword}
            error={validPassword.length > 0 && validPassword !== password ? 'Las contraseñas no coinciden' : ''}
            secureTextEntry={!showValidPassword} onChangeText={setValidPassword} editable={!isLoading} />
          <TouchableOpacity
            onPress={() => setShowValidPassword(!showValidPassword)}
            style={{ position: 'absolute', right: 16, top: 14 }}
          >
            <Ionicons name={showValidPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
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

        <Button variant='contained' className='mt-4' onPress={handleRegister}
          disabled={!checked || !passwordValid || isLoading}>
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