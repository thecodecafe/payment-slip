const {exec} = require("child_process");
const {writeFileSync, readFileSync} = require("fs");
const chalk = require('chalk');

const LIVE_RELOAD_CONFIG_FILE = '.lrrc.json';


function getLocalIPAddress() {
  return new Promise((res, rej) => {
    exec('ipconfig getifaddr en0', (err, stdout, stderr) => {
      if (err) {
        return rej(err);
      }
      if (stderr) {
        return rej(new Error(stderr))
      }
      const ip = String(stdout).replace(/\s/g, '');
      return res(ip);
    });
  });
}

function writeConfig(ip, port) {
  writeFileSync(LIVE_RELOAD_CONFIG_FILE, JSON.stringify({ip, port}))
}

function readGitIgnore() {
  try {
    const res = readFileSync('.gitignore');
    return res.toString();
  } catch (e) {
    if (/no such file/i.test(e.message)) {
      return '';
    }
    throw e;
  }
}

function ignoreConfigFile() {
  const content = readGitIgnore();
  if (content.indexOf(LIVE_RELOAD_CONFIG_FILE) !== -1) {
    return;
  }
  writeFileSync('.gitignore', content + `\n${LIVE_RELOAD_CONFIG_FILE}`);
}

async function run () {
  const localIp = await getLocalIPAddress();
  writeConfig(localIp, 3000);
  if (!localIp.trim().length) {
    console.log(chalk.bgYellow(chalk.white(' No Local IP Address ')))
    console.log(chalk.yellow('This means you are not connected to a\nlocal network and Live reload will\nnot be enabled.\n'))
  }
  ignoreConfigFile();
}

run();
