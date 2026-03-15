import { AvatarSelector } from '@/components/shared/Avatarselector';
import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { AVATARS } from '@/src/const/avatar';
import { useTheme } from '@/src/context/ThemeContext';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const UserEditScreen = () => {
  const { user, loading, error, changePassword, updateProfile, logout, deleteAccount, fetchUser, } = useUserViewModel();
  const { isDark, toggleTheme } = useTheme();

  const colors = {
    background: isDark ? '#343734' : '#AFCBFF',
    card: isDark ? '#343734' : '#F9FAFB',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
    icon: isDark ? '#FFFFFF' : '#000000',
    inputsColor: isDark ? '#616461' : '#FFFFFF',
    ruleBg: isDark ? '#1F2937' : '#F9FAFB',
    ruleBorder: isDark ? '#374151' : '#E5E7EB',
  };

  const [nombre, setNombre] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');

  // FIX 1: detectar si es usuario de Google
  const esGoogleUser = (user as any)?.proveedor_auth === 'google';

  const passwordRules = [
    { label: 'Mínimo 8 caracteres', valid: newPassword.length >= 8 },
    { label: 'Una letra mayúscula', valid: /[A-Z]/.test(newPassword) },
    { label: 'Una letra minúscula', valid: /[a-z]/.test(newPassword) },
    { label: 'Un número', valid: /[0-9]/.test(newPassword) },
  ];
  const passwordValid = passwordRules.every(r => r.valid);

  const mostrarAlerta = (titulo: string, mensaje: string, onPress?: () => void) => {
    Alert.alert(titulo, mensaje, [{ text: 'Aceptar', onPress }]);
  };

  useEffect(() => {
    if (user) {
      console.log('👤 User data:', JSON.stringify(user));
      setNombre(user.nombre);
      setAvatarId(user.avatar_id ?? 1);
    }
  }, [user]);

  useEffect(() => { fetchUser(); }, []);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      // FIX 3: fallback a 1 si avatar_id es null
      setAvatarId(user.avatar_id ?? 1);
    }
  }, [user]);

  const handleAvatarSelect = async (id: number) => {
    setAvatarId(id);
    try {
      await updateProfile(nombre, id);
      await fetchUser();
    } catch {
      mostrarAlerta('Error', 'No se pudo guardar el avatar');
    }
  };

  const handleSaveChanges = async () => {
    try {
      let profileUpdated = false;
      let passwordUpdated = false;

      if (nombre !== user?.nombre || avatarId !== user?.avatar_id) {
        if (!nombre || nombre.trim() === '') {
          mostrarAlerta('Error', 'El nombre no puede estar vacío');
          return;
        }
        await updateProfile(nombre, avatarId);
        profileUpdated = true;
      }

      if (!esGoogleUser && (currentPassword || newPassword || confirmPassword)) {
        if (!currentPassword) { mostrarAlerta('Error', 'Debes ingresar tu contraseña actual'); return; }
        if (!newPassword) { mostrarAlerta('Error', 'Debes ingresar una nueva contraseña'); return; }
        if (!passwordValid) { mostrarAlerta('Error', 'La contraseña no cumple los requisitos'); return; }
        if (newPassword !== confirmPassword) { mostrarAlerta('Error', 'Las contraseñas no coinciden'); return; }

        await changePassword(currentPassword, newPassword, confirmPassword);
        passwordUpdated = true;
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      if (profileUpdated && passwordUpdated) {
        mostrarAlerta('Éxito', 'Perfil y contraseña actualizados correctamente');
      } else if (profileUpdated) {
        mostrarAlerta('Éxito', 'Perfil actualizado correctamente');
      } else if (passwordUpdated) {
        mostrarAlerta('Éxito', 'Contraseña actualizada correctamente');
      } else {
        mostrarAlerta('Información', 'No hay cambios que guardar');
        return;
      }

      router.push('/(tabs)/(stack)/profile');
    } catch (err: any) {
      // FIX 2: limpiar campos de contraseña para no bloquear la pantalla
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      mostrarAlerta('Error', err?.response?.data?.message || err.message || 'Error al guardar cambios');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión', style: 'destructive',
        onPress: async () => {
          try { await logout(); } catch { }
          finally { router.replace('/(stack)/login'); }
        }
      }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('⚠️ Eliminar cuenta', 'Esta acción es permanente. ¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          if (esGoogleUser) {
            // ← directo sin pedir contraseña
            try {
              await deleteAccount('');
              Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada', [
                { text: 'Entendido', onPress: () => router.replace('/(stack)/login') }
              ]);
            } catch (err: any) {
              mostrarAlerta('Error', err?.response?.data?.message || 'No se pudo eliminar la cuenta');
            }
          } else {
            setShowDeleteModal(true); // ← pide contraseña normal
          }
        }
      }
    ]);
  };
  const confirmDeleteAccount = async () => {
    try {
      if (!deletePasswordInput?.trim()) {
        mostrarAlerta('Error', 'Debes ingresar tu contraseña');
        return;
      }
      await deleteAccount(deletePasswordInput);
      setShowDeleteModal(false);
      setDeletePasswordInput('');
      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada', [
        { text: 'Entendido', onPress: () => router.replace('/(stack)/login') }
      ]);
    } catch (err: any) {
      mostrarAlerta('Error', err?.response?.data?.message || err.message || 'No se pudo eliminar la cuenta');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontFamily: 'Barlow-Medium', fontSize: 18 }}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: '#EF4444', fontFamily: 'Barlow-Medium', fontSize: 18 }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 24, padding: 16, marginVertical: 40, marginHorizontal: 12, borderWidth: 1, borderColor: colors.border }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/(stack)/profile')}>
          <AntDesign name="close" size={27} color="#D64545" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {/* FIX 3: fallback a AVATARS[1] si avatarId es null/undefined */}
        <Image
          source={avatarId && AVATARS[avatarId] ? AVATARS[avatarId] : AVATARS[1]}
          style={{ width: 160, height: 160, resizeMode: 'contain', borderRadius: 80, marginTop: 6 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '33%', marginTop: 12 }}>
          <TouchableOpacity
            onPress={async () => {
              setAvatarId(1);
              try { await updateProfile(nombre, 1); await fetchUser(); }
              catch { mostrarAlerta('Error', 'No se pudo resetear el avatar'); }
            }}
            disabled={avatarId === 1}
            style={{ opacity: avatarId === 1 ? 0.5 : 1 }}
          >
            <FontAwesome5 name="trash-alt" size={27} color="#D64545" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAvatarSelector(true)}>
            <FontAwesome5 name="edit" size={27} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulario */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 16 }}>
          <Input isDark={isDark} label='Nombre' placeholder='Ingresa tu nombre' value={nombre}
            error={!nombre?.trim() ? 'El nombre es obligatorio' : ''} onChangeText={setNombre} />
          <Input isDark={isDark} label='Correo' placeholder={user?.email || 'correo@ejemplo.com'}
            value={user?.email || ''} editable={false} keyboardType='email-address' autoCapitalize='none' />

          {/* FIX 1: solo mostrar cambio de contraseña si NO es Google */}
          {!esGoogleUser && (
            <>
              <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 24, fontSize: 16, color: colors.text }}>
                Cambiar contraseña (opcional)
              </Text>

              {/* Contraseña actual con ojito */}
              <View style={{ position: 'relative' }}>
                <Input isDark={isDark} label='Contraseña Actual' placeholder='Ingresa tu contraseña actual'
                  value={currentPassword} secureTextEntry={!showCurrentPassword} onChangeText={setCurrentPassword} />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: 16, top: 38 }}>
                  <Ionicons name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>

              {/* Nueva contraseña con ojito */}
              <View style={{ position: 'relative' }}>
                <Input isDark={isDark} label='Nueva contraseña' placeholder='Mínimo 8 caracteres'
                  value={newPassword} secureTextEntry={!showNewPassword} onChangeText={setNewPassword} />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: 16, top: 38 }}>
                  <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>

              {/* Indicador de requisitos */}
              {newPassword.length > 0 && (
                <View style={{
                  backgroundColor: colors.ruleBg,
                  borderRadius: 8, padding: 12, marginBottom: 12,
                  borderWidth: 1, borderColor: colors.ruleBorder
                }}>
                  {passwordRules.map((rule, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i < passwordRules.length - 1 ? 6 : 0 }}>
                      <Text style={{ fontSize: 13, marginRight: 8 }}>{rule.valid ? '✅' : '⭕'}</Text>
                      <Text style={{ fontSize: 13, fontFamily: 'Barlow-Medium', color: rule.valid ? '#10B981' : colors.subtext }}>
                        {rule.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Confirmar contraseña con ojito */}
              <View style={{ position: 'relative' }}>
                <Input isDark={isDark} label='Confirmar nueva contraseña' placeholder='Repite la nueva contraseña'
                  value={confirmPassword}
                  error={confirmPassword && newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
                  secureTextEntry={!showConfirmPassword} onChangeText={setConfirmPassword} />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: 16, top: 38 }}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Mensaje informativo para usuarios de Google */}
          {esGoogleUser && (
            <View style={{
              backgroundColor: isDark ? '#1F2937' : '#EFF6FF',
              borderRadius: 8, padding: 12, marginTop: 16,
              borderWidth: 1, borderColor: isDark ? '#374151' : '#BFDBFE',
              flexDirection: 'row', alignItems: 'center', gap: 8
            }}>
              <Ionicons name='logo-google' size={18} color='#4285F4' />
              <Text style={{ fontFamily: 'Barlow-Medium', fontSize: 13, color: isDark ? '#93C5FD' : '#1D4ED8', flex: 1 }}>
                Tu cuenta usa Google. La contraseña se gestiona desde tu cuenta de Google.
              </Text>
            </View>
          )}
        </View>

        <Button color='primary' className='mt-8' onPress={handleSaveChanges}>
          Guardar cambios
        </Button>

        {/* Toggle tema */}
        <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 32, fontSize: 16, color: colors.text }}>
          Personalizar tema
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <MaterialIcons name='wb-sunny' size={25} color={colors.icon} />
          <Pressable
            onPress={toggleTheme}
            style={{ height: 40, width: 80, borderRadius: 20, padding: 4, backgroundColor: isDark ? '#0099FF' : '#9CA3AF' }}
          >
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', marginLeft: isDark ? 36 : 0 }} />
          </Pressable>
          <MaterialIcons name='dark-mode' size={25} color={colors.icon} />
        </View>

        {/* Sobre nosotros */}
        <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 40, fontSize: 16, color: colors.text }}>
          Conoce más sobre nosotros
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/(stack)/termos')}
          style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginTop: 8, paddingHorizontal: 12, paddingVertical: 14 }}
        >
          <Ionicons name='document-text-outline' size={23} color={colors.icon} />
          <Text style={{ fontFamily: 'Barlow-Medium', fontSize: 15, color: colors.text, marginLeft: 10 }}>
            Términos y Condiciones
          </Text>
          <Ionicons name='chevron-forward' size={18} color={colors.subtext} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/(stack)/privacy')}
          style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginTop: 4, paddingHorizontal: 12, paddingVertical: 14 }}
        >
          <Feather name='lock' size={21} color={colors.icon} />
          <Text style={{ fontFamily: 'Barlow-Medium', fontSize: 15, color: colors.text, marginLeft: 10 }}>
            Política de Privacidad
          </Text>
          <Ionicons name='chevron-forward' size={18} color={colors.subtext} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Gestionar cuenta */}
        <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 32, fontSize: 16, color: colors.text }}>
          Gestionar cuenta
        </Text>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={loading}
          style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginTop: 4, paddingHorizontal: 12, paddingVertical: 14 }}
        >
          <FontAwesome5 name='trash-alt' size={19} color='#D64545' />
          <Text style={{ fontFamily: 'Barlow-Medium', fontSize: 15, color: '#D64545', marginLeft: 10 }}>
            Eliminar cuenta
          </Text>
        </TouchableOpacity>

        <Button color='tertiary' className='mt-10 mb-6' onPress={handleLogout} disabled={loading}>
          {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Button>
      </ScrollView>

      <AvatarSelector visible={showAvatarSelector} currentAvatarId={avatarId}
        onSelect={handleAvatarSelect} onClose={() => setShowAvatarSelector(false)} />

      {/* Modal eliminar cuenta */}
      <Modal visible={showDeleteModal} transparent animationType="fade"
        onRequestClose={() => { setShowDeleteModal(false); setDeletePasswordInput(''); }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <Text style={{ fontFamily: 'Barlow-Bold', fontSize: 24, marginBottom: 8, textAlign: 'center', color: colors.text }}>
              Confirmar contraseña
            </Text>
            <Text style={{ fontFamily: 'Barlow-Regular', fontSize: 16, color: colors.subtext, marginBottom: 24, textAlign: 'center' }}>
              Ingresa tu contraseña para confirmar la eliminación
            </Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 24, fontFamily: 'Barlow-Medium', fontSize: 16, color: colors.text, backgroundColor: colors.background }}
              placeholder='Contraseña' placeholderTextColor={colors.subtext}
              secureTextEntry value={deletePasswordInput} onChangeText={setDeletePasswordInput} autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 16 }}
                onPress={() => { setShowDeleteModal(false); setDeletePasswordInput(''); }}>
                <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', color: '#374151', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#EF4444', borderRadius: 8, padding: 16, opacity: loading ? 0.5 : 1 }}
                onPress={confirmDeleteAccount} disabled={loading}>
                <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', color: '#FFFFFF', fontSize: 16 }}>
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserEditScreen;