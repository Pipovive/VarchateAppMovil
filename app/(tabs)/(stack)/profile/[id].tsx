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
  const { user, loading, error, changePassword, updateProfile, logout, deleteAccount, fetchUser } = useUserViewModel();
  const { isDark, toggleTheme } = useTheme();

  const colors = {
    background: isDark ? '#343734' : '#AFCBFF',
    card: isDark ? '#343734' : '#F9FAFB',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
    icon: isDark ? '#FFFFFF' : '#000000',
    inputsColor: isDark ? '#616461' : '#FFFFFF'
  };

  const [nombre, setNombre] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');

  useEffect(() => { fetchUser(); }, []);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setAvatarId(user.avatar_id);
    }
  }, [user]);

  const handleAvatarSelect = async (id: number) => {
    setAvatarId(id);
    try {
      await updateProfile(nombre, id);
      await fetchUser();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el avatar');
    }
  };

  const handleSaveChanges = async () => {
    try {
      let profileUpdated = false;
      let passwordUpdated = false;

      if (nombre !== user?.nombre || avatarId !== user?.avatar_id) {
        if (!nombre || nombre.trim() === '') {
          Alert.alert('Error', 'El nombre no puede estar vacío');
          return;
        }
        await updateProfile(nombre, avatarId);
        profileUpdated = true;
      }

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) { Alert.alert('Error', 'Debes ingresar tu contraseña actual'); return; }
        if (!newPassword) { Alert.alert('Error', 'Debes ingresar una nueva contraseña'); return; }
        if (newPassword !== confirmPassword) { Alert.alert('Error', 'Las contraseñas no coinciden'); return; }

        await changePassword(currentPassword, newPassword, confirmPassword);
        passwordUpdated = true;
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      if (profileUpdated && passwordUpdated) {
        Alert.alert('Éxito', 'Perfil y contraseña actualizados correctamente');
      } else if (profileUpdated) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else if (passwordUpdated) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      } else {
        Alert.alert('Información', 'No hay cambios que guardar');
        return;
      }

      router.push('/(tabs)/(stack)/profile');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message || 'Error al guardar cambios');
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
      { text: 'Eliminar', style: 'destructive', onPress: () => setShowDeleteModal(true) }
    ]);
  };

  const confirmDeleteAccount = async () => {
    try {
      if (!deletePasswordInput?.trim()) {
        Alert.alert('Error', 'Debes ingresar tu contraseña');
        return;
      }
      await deleteAccount(deletePasswordInput);
      setShowDeleteModal(false);
      setDeletePasswordInput('');
      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada', [
        { text: 'Entendido', onPress: () => router.replace('/(stack)/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message || 'No se pudo eliminar la cuenta');
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
        <Image source={AVATARS[avatarId]} style={{ width: 160, height: 160, resizeMode: 'contain', borderRadius: 80, marginTop: 6 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '33%', marginTop: 12 }}>
          <TouchableOpacity
            onPress={async () => {
              setAvatarId(1);
              try { await updateProfile(nombre, 1); await fetchUser(); }
              catch { Alert.alert('Error', 'No se pudo resetear el avatar'); }
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

          <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 24, fontSize: 16, color: colors.text }}>
            Cambiar contraseña (opcional)
          </Text>

          <Input isDark={isDark} label='Contraseña Actual' placeholder='Ingresa tu contraseña actual'
            value={currentPassword} secureTextEntry onChangeText={setCurrentPassword} />
          <Input isDark={isDark} label='Nueva contraseña' placeholder='Mínimo 8 caracteres con carácter especial'
            value={newPassword}
            error={newPassword.length > 0 && newPassword.length < 8 ? 'Mínimo 8 caracteres'
              : newPassword.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'Debe incluir un carácter especial' : ''}
            secureTextEntry onChangeText={setNewPassword} />
          <Input isDark={isDark}  label='Confirmar nueva contraseña' placeholder='Repite la nueva contraseña'
            value={confirmPassword}
            error={confirmPassword && newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
            secureTextEntry onChangeText={setConfirmPassword} />
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
        <View style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginTop: 8, paddingHorizontal: 8 }}>
          <Ionicons name='document-text-outline' size={23} color={colors.icon} />
          <Button variant='text-only' textColor='normal'>Términos y Condiciones</Button>
        </View>
        <View style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginTop: 4, paddingHorizontal: 8 }}>
          <Feather name='lock' size={21} color={colors.icon} />
          <Button variant='text-only' textColor='normal'>Política de Privacidad</Button>
        </View>

        {/* Gestionar cuenta */}
        <Text style={{ fontFamily: 'Barlow-Medium', marginTop: 32, fontSize: 16, color: colors.text }}>
          Gestionar cuenta
        </Text>
        <View style={{ backgroundColor: colors.card, alignItems: 'center', borderRadius: 8, flexDirection: 'row', marginTop: 4, paddingHorizontal: 8 }}>
          <FontAwesome5 name='trash-alt' size={19} color='#D64545' />
          <Button variant='text-only' textColor='normal' onPress={handleDeleteAccount} disabled={loading}>
            Eliminar cuenta
          </Button>
        </View>

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