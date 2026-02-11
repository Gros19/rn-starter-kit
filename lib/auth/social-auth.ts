import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import type { SocialAuthPayload } from '@/lib/types/auth';

/** Apple Sign In (네이티브 SDK) */
async function signInWithApple(): Promise<SocialAuthPayload> {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce,
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) {
    throw new Error('Apple Sign In: identityToken이 없습니다');
  }

  return {
    provider: 'apple',
    idToken: credential.identityToken,
    nonce,
  };
}

/** Google Sign In (네이티브 SDK) - 별도 패키지 설치 및 설정 필요 */
async function signInWithGoogle(): Promise<SocialAuthPayload> {
  // @react-native-google-signin/google-signin 패키지 설치 후 사용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await (Function('return import("@react-native-google-signin/google-signin")')() as Promise<any>);
  const { GoogleSignin } = mod;
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error('Google Sign In: idToken이 없습니다');
  }

  return { provider: 'google', idToken };
}

/** Kakao Sign In (네이티브 SDK) - 별도 패키지 설치 및 설정 필요 */
async function signInWithKakao(): Promise<SocialAuthPayload> {
  // @react-native-seoul/kakao-login 패키지 설치 후 사용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await (Function('return import("@react-native-seoul/kakao-login")')() as Promise<any>);
  const { login } = mod;
  const result = await login();

  if (!result.idToken) {
    throw new Error('Kakao Sign In: idToken이 없습니다');
  }

  return { provider: 'kakao', idToken: result.idToken };
}

export function isAppleSignInAvailable(): boolean {
  return Platform.OS === 'ios';
}

export const socialAuth = {
  signInWithApple,
  signInWithGoogle,
  signInWithKakao,
  isAppleSignInAvailable,
};
