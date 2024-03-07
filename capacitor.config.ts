import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.danielbarde.deal',
  appName: 'deel-assignment',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  }
};

export default config;
