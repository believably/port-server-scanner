const net = require('net');
const fs = require('fs')
const { promisify } = require('util');
const dns = require('dns');

const dnsLookup = promisify(dns.lookup);
const timeout = 1000; // 1 second timeout for connection attempts
const startIP = 'XXX.XXX.XXX.XXX'; // Put your IP ranges here
const endIP = 'XXX.XXX.XXX.XXX';
const outputFilePath = 'found_servers.txt'; //Text destination
const port = 25565 // Change port


async function scanIP(ip) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;

    socket.setTimeout(timeout);
    socket.on('connect', () => {
      isOpen = true;
      socket.destroy();
    });

    socket.on('timeout', () => {
      socket.destroy();
    });

    socket.on('error', () => {
      socket.destroy();
    });

    socket.on('close', () => {
      resolve({ ip, isOpen });
    });

    socket.connect(port, ip);
  });
}

async function scanRange(startIP, endIP, outputFilePath) {
    const start = startIP.split('.').map(Number);
    const end = endIP.split('.').map(Number);
    const promises = [];
  
    for (let i = start[0]; i <= end[0]; i++) {
      for (let j = start[1]; j <= end[1]; j++) {
        for (let k = start[2]; k <= end[2]; k++) {
          for (let l = start[3]; l <= end[3]; l++) {
            const ip = `${i}.${j}.${k}.${l}`;
            promises.push(scanIP(ip));
            console.log(ip)
          }
        }
      }
    }
  
    const results = await Promise.all(promises);
    const foundServers = results.filter(result => result.isOpen).map(result => result.ip);
    fs.writeFileSync(outputFilePath, foundServers.join('\n'), 'utf-8');
    console.log(`Found servers have been written to ${outputFilePath}`);
  }

  scanRange(startIP, endIP, outputFilePath);
