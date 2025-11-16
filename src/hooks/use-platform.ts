import { Capacitor } from '@capacitor/core';

/**
 * Hook para detectar se o app está rodando em plataforma nativa (iOS/Android)
 * ou na web (navegador)
 */
export const useIsNativeApp = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Retorna a plataforma atual: 'ios', 'android' ou 'web'
 */
export const usePlatform = () => {
  return Capacitor.getPlatform();
};

/**
 * Verifica se está rodando no iOS
 */
export const useIsIOS = () => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Verifica se está rodando no Android
 */
export const useIsAndroid = () => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Verifica se está rodando na web (navegador)
 */
export const useIsWeb = () => {
  return Capacitor.getPlatform() === 'web';
};
