import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.danielbarde.deal',
  appName: 'deel-assignment',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: "http://192.168.0.179:3000",
    cleartext: true,
  }
};

export default config;
