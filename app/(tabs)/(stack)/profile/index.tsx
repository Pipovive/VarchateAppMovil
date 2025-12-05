import ProgressCard from '@/components/shared/ProgressCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();
  const id ='1';

  return (
    <View className='flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3'>

      <View className="flex-row justify-end">
        <TouchableOpacity onPress={() => {router.push('/profile/${id}')}}>
          <FontAwesome5 name="edit" size={28} color="#000" />
        </TouchableOpacity>
      </View>


      <View className='items-center justify-center'>
        <Image
        style={{width: 160, resizeMode: 'contain', marginTop: 6, borderRadius: 50, height: 160}}
        source={require('../../../../assets/images/gato-perfil.png')}></Image>

        <Text className='font-barlow-medium text-center mb-3 text-2xl text-secondary'>Juan Pérez</Text>

      </View>

      <Text className='font-barlow-bold text-2xl text-secondary mt-2'>Progreso</Text>

      <ScrollView className='flex-1 mt-2'>
        <ProgressCard title='INTRODUCCIÓN A LA PROGRAMACIÓN' progress={50}></ProgressCard>
        <ProgressCard title='HTML' progress={30}></ProgressCard>
        <ProgressCard title='CSS' progress={20}></ProgressCard>
        <ProgressCard title='JS' progress={10}></ProgressCard>
        <ProgressCard title='SQL' progress={0}></ProgressCard>
        <ProgressCard title='PHP' progress={0}></ProgressCard>
      </ScrollView>

    </View>
  )
}

export default ProfileScreen