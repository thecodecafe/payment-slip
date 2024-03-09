import { CapacitorConfig } from '@capacitor/cli';
const lrrc = require('./.lrrc.json');

const server: CapacitorConfig['server'] = {
  androidScheme: 'https',
};

if (lrrc.ip.trim().length) {
  server.url = `http://${lrrc.ip}:${lrrc.port}`;
  server.cleartext = true;

}

const config: CapacitorConfig = {
  appId: 'com.danielbarde.deal',
  appName: 'deel-assignment',
  webDir: 'build',
  server: server
};

export default config;
