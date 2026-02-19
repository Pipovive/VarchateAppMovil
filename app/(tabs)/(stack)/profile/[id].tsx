import { AvatarSelector } from '@/components/shared/Avatarselector';
import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { AVATARS } from '@/src/const/avatar';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const UserEditScreen = () => {
  const { user, loading, error, changePassword, updateProfile, logout, deleteAccount, fetchUser } = useUserViewModel();

  const [nombre, setNombre] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [on, setOn] = useState(true);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setAvatarId(user.avatar_id);
    }
  }, [user]);

   const handleAvatarSelect = async (id: number) => {
    setAvatarId(id);
    
    try {
      console.log('💾 Guardando avatar:', { nombre, id });
      await updateProfile(nombre, id); // ← Usa el estado 'nombre', no 'user?.nombre'
      console.log('✅ Avatar guardado');
      await fetchUser();
    } catch (err) {
      console.log('❌ Error:', err);
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
        if (!currentPassword) {
          Alert.alert('Error', 'Debes ingresar tu contraseña actual');
          return;
        }
        if (!newPassword) {
          Alert.alert('Error', 'Debes ingresar una nueva contraseña');
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert('Error', 'Las contraseñas no coinciden');
          return;
        }

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
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (err) {
            // Continuar aunque falle
          } finally {
            router.replace('/(stack)/login');
          }
        }
      }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('⚠️ Eliminar cuenta', 'Esta acción es permanente y no se puede deshacer. ¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setShowDeleteModal(true)
      }
    ]);
  };

  const confirmDeleteAccount = async () => {
    try {
      if (!deletePasswordInput || deletePasswordInput.trim() === '') {
        Alert.alert('Error', 'Debes ingresar tu contraseña');
        return;
      }

      await deleteAccount(deletePasswordInput);
      setShowDeleteModal(false);
      setDeletePasswordInput('');

      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente', [
        { text: 'Entendido', onPress: () => router.replace('/(stack)/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message || 'No se pudo eliminar la cuenta. Verifica tu contraseña.');
    }
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-primary-500'>
        <Text className='font-barlow-medium text-lg'>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-primary-500'>
        <Text className='font-barlow-medium text-lg text-red-500'>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3'>
      {/* Header */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity onPress={() => router.push('/(tabs)/(stack)/profile')}>
          <AntDesign name="close" size={27} color="#D64545" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View className='items-center justify-center mb-4'>
        <Image source={AVATARS[avatarId]} style={{ width: 160, resizeMode: 'contain', marginTop: 6, borderRadius: 50, height: 160 }} />

        <View className='flex-row justify-between w-1/3 mt-3'>
          <TouchableOpacity
            onPress={async () => {
              setAvatarId(1);
              try {
                await updateProfile(nombre, 1);
                await fetchUser();
              } catch (err) {
                Alert.alert('Error', 'No se pudo resetear el avatar');
              }
            }}
            disabled={avatarId === 1}
            style={{ opacity: avatarId === 1 ? 0.5 : 1 }}
          >
            <FontAwesome5 name="trash-alt" size={27} color="#D64545" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowAvatarSelector(true)}>
            <FontAwesome5 name="edit" size={27} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulario */}
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='mt-4'>
          <Input
            className='font-barlow-medium'
            label='Nombre'
            placeholder='Ingresa tu nombre'
            value={nombre}
            error={!nombre || nombre.trim() === '' ? 'El nombre es obligatorio' : ''}
            onChangeText={setNombre}
          />

          <Input
            className='font-barlow-medium'
            label='Correo'
            placeholder={user?.email || 'correo@ejemplo.com'}
            value={user?.email || ''}
            editable={false}
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <Text className='font-barlow-medium mt-6 text-base'>Cambiar contraseña (opcional)</Text>

          <Input
            className='font-barlow-medium'
            label='Contraseña actual'
            placeholder='Ingresa tu contraseña actual'
            value={currentPassword}
            secureTextEntry
            onChangeText={setCurrentPassword}
          />

          <Input
            className='font-barlow-medium'
            label='Nueva contraseña'
            placeholder='Mínimo 8 caracteres con carácter especial'
            value={newPassword}
            error={
              newPassword.length > 0 && newPassword.length < 8
                ? 'La contraseña debe tener mínimo 8 caracteres'
                : newPassword.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                  ? 'Debe incluir al menos un carácter especial (!@#$%&*...)'
                  : ''
            }
            secureTextEntry
            onChangeText={setNewPassword}
          />

          <Input
            className='font-barlow-medium'
            label='Confirmar nueva contraseña'
            placeholder='Repite la nueva contraseña'
            value={confirmPassword}
            error={confirmPassword && newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
            secureTextEntry
            onChangeText={setConfirmPassword}
          />
        </View>

        <Button color='primary' className='mt-8' onPress={handleSaveChanges}>
          Guardar cambios
        </Button>

        <Text className='font-barlow-medium mt-8 text-base'>Personalizar tema</Text>
        <View className='justify-between w-full flex-row mt-6'>
          <MaterialIcons name='dark-mode' size={25} />
          <Button variant='toggle' value={on} onPress={() => setOn(!on)} />
          <MaterialIcons name='wb-sunny' size={25} />
        </View>

        <Text className='font-barlow-medium mt-12 text-base'>Conoce más sobre nosotros</Text>
        <View className='bg-quaternary items-center rounded-md border border-secondary-100/10 flex-row mt-2 px-2'>
          <Ionicons name='document-text-outline' size={23} />
          <Button variant='text-only' textColor='normal'>Términos y Condiciones</Button>
        </View>

        <View className='bg-quaternary items-center rounded-md border border-secondary-100/10 flex-row mt-1 px-2'>
          <Feather name='lock' size={21} />
          <Button variant='text-only' textColor='normal'>Política de Privacidad</Button>
        </View>

        <Text className='font-barlow-medium mt-8 text-base'>Gestionar cuenta</Text>
        <View className='bg-quaternary items-center rounded-md flex-row mt-1 px-2'>
          <FontAwesome5 name='trash-alt' size={19} color='#D64545' />
          <Button variant='text-only' textColor='normal' onPress={handleDeleteAccount} disabled={loading}>
            Eliminar cuenta
          </Button>
        </View>

        <Button color='tertiary' className='mt-10 mb-6' onPress={handleLogout} disabled={loading}>
          {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Button>
      </ScrollView>

      {/* Modal: Selector de Avatar */}
       <AvatarSelector
        visible={showAvatarSelector}
        currentAvatarId={avatarId}
        onSelect={handleAvatarSelect} // ← Usa la nueva función que guarda automáticamente
        onClose={() => setShowAvatarSelector(false)}
      />

      {/* Modal: Confirmar eliminación */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false);
          setDeletePasswordInput('');
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <Text style={{ fontFamily: 'Barlow-Bold', fontSize: 24, marginBottom: 8, textAlign: 'center', color: '#000' }}>
              Confirmar contraseña
            </Text>

            <Text style={{ fontFamily: 'Barlow-Regular', fontSize: 16, color: '#6B7280', marginBottom: 24, textAlign: 'center' }}>
              Ingresa tu contraseña para confirmar la eliminación
            </Text>

            <TextInput
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 24, fontFamily: 'Barlow-Medium', fontSize: 16 }}
              placeholder='Contraseña'
              placeholderTextColor='#9CA3AF'
              secureTextEntry
              value={deletePasswordInput}
              onChangeText={setDeletePasswordInput}
              autoFocus
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 16 }}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeletePasswordInput('');
                }}
              >
                <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', color: '#374151', fontSize: 16 }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#EF4444', borderRadius: 8, padding: 16, opacity: loading ? 0.5 : 1 }}
                onPress={confirmDeleteAccount}
                disabled={loading}
              >
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