import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '29593004535-8thm4dk2jsve2j4qqre3a4dtkaktr6bp.apps.googleusercontent.com',
  offlineAccess: true,
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Login cancelado');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Login en progreso');
    } else {
      throw error;
    }
  }
};