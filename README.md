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
1. Run `npm run ios` or `yarn ios` from your terminal.
2. When you receive the prompt, select your preferred Simulator and hit enter.
The app should build and start successfully.

## Running on Android
To run on Android, ensure your environment is set up for Android development. You may follow the guide on [this page](https://capacitorjs.com/docs/getting-started/environment-setup) to set up your machine for Android development.
Once you're done:
1. Run `npm run android` or `yarn android` from your terminal.
2. When you receive the prompt, select your preferred Emulator and hit enter.
The app should build and start successfully.


## Running on the Web
If you successfully followed all the steps above you should have not installed it on your machine. You may follow the guide on [this section]([https://capacitorjs.com/docs/getting-started/environment-setup](https://capacitorjs.com/docs/getting-started/environment-setup#core-requirements)) of the Getting Started page for Capacitor to set up Node on your machine.
Once you're done:
Run `npm run web` or `yarn web` from your terminal.
The app should build and start successfully.


## Live Reload on Mobile
Currently hot reload requires manual intervention to be set up with your workflow. To set up a hot reload simply follow [this guide](https://capacitorjs.com/docs/vscode/build-and-run#live-reload) on the Capacitor documentation.
Once done you should no longer need to always run your android or ios scripts to see the updates made to your UI.
