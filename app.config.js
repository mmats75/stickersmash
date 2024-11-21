const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.mmats75.stickersmash.dev'
  }

  if (IS_PREVIEW) {
    return 'com.mmats75.stickersmash.preview'
  }

  return 'com.mmats75.stickersmash'
}

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)'
  }

  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)'
  }

  return 'StickerSmash: yet another'
}

export default {
  name: getAppName(),
  slug: 'StickerSmash',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: getUniqueIdentifier(),
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['WRITE_EXTERNAL_STORAGE', 'READ_EXTERNAL_STORAGE'],
    package: getUniqueIdentifier(),
    versionCode: '1',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#25292e',
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '74f52cb0-c9c0-4caa-9096-2c2e7ff958b5',
    },
  },
  owner: 'mmats75',
}
