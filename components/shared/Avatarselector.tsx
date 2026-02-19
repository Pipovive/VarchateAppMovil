import { AVATARS } from '@/src/const/avatar';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface AvatarSelectorProps {
  visible: boolean;
  currentAvatarId: number;
  onSelect: (avatarId: number) => void;
  onClose: () => void;
}

export const AvatarSelector = ({ visible, currentAvatarId, onSelect, onClose }: AvatarSelectorProps) => {
  // Obtener todas las keys de AVATARS (1, 2, 3, 4, 5...)
  const avatarIds = Object.keys(AVATARS).map(Number);
  const handleSelectAvatar = async (id: number) => {
    onSelect(id); // ← Actualiza el estado local
    onClose();    // ← Cierra el modal
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          maxHeight: '80%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              fontFamily: 'Barlow-Bold',
              fontSize: 24,
              color: '#000'
            }}>
              Elige tu avatar
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Grid de avatares */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              gap: 16
            }}>
              {avatarIds.map((id) => (
                <TouchableOpacity
                  key={id}
                   onPress={() => handleSelectAvatar(id)}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: currentAvatarId === id ? 4 : 2,
                    borderColor: currentAvatarId === id ? '#0099FF' : '#E5E7EB',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F3F4F6'
                  }}
                >
                  <Image
                    source={AVATARS[id]}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  {currentAvatarId === id && (
                    <View style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#0099FF',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <AntDesign name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};