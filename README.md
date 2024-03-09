# Payment Slip App
This is a cross-platform React app that has been integrated with Capacitor, this allows you to run the app on Android, iOS, and the Web.

## Setup
1. Clone the repository to your preferred location.
2. From your terminal cd into the directory that contains your newly booted code.
3. Run `npm i` or `yarn` to install dependencies.
4. Run `npm run build` or `yarn build`
5. Run `npx cap sync` to sync your project with the Android and iOS platforms.

## Running on iOS
To run on iOS, ensure you have XCode installed. You may follow the guide on [this page](https://capacitorjs.com/docs/getting-started/environment-setup) to set up your machine for iOS development.
Once you're done:
1. Run `npm run serve` in a fresh terminal to start the CRA server, you can skip this if you already have one running.
2. Open a new terminal and run `npm run ios` or `yarn ios` from your terminal.
3. When you receive the prompt, select your preferred Simulator and hit enter.
The app should build and start successfully.

## Running on Android
To run on Android, ensure your environment is set up for Android development. You may follow the guide on [this page](https://capacitorjs.com/docs/getting-started/environment-setup) to set up your machine for Android development.
Once you're done:
1. Run `npm run serve` in a fresh terminal to start the CRA server, you can skip this if you already have one running.
2. Open a new terminal and run `npm run android` or `yarn android` from your terminal.
3. When you receive the prompt, select your preferred Emulator and hit enter.
The app should build and start successfully.


## Running on the Web
If you successfully followed all the steps above you should have not installed it on your machine. You may follow the guide on [this section]([https://capacitorjs.com/docs/getting-started/environment-setup](https://capacitorjs.com/docs/getting-started/environment-setup#core-requirements)) of the Getting Started page for Capacitor to set up Node on your machine.
Once you're done:
Run `npm run web` or `yarn web` from your terminal.
The app should build and start successfully.


## Live Reload on Mobile
If you're connected to a local network Live reload will automatically work, this is because of the script in ip-script.js file.
It get's you're local IP address and adds it to a local file that is imported by capacitor.config and used to configure your live reload server. To learn more about configuring Live reload for capacitor you can look at[this guide](https://capacitorjs.com/docs/vscode/build-and-run#live-reload),
