const axios = require('axios');
const fs = require('fs');
const util = require('minecraft-server-util');
const { Readline } = require('readline/promises');
const prompt = require("prompt-sync")();

let serverAddress = null;
let port = null 

async function getServerStatus(serverAddress) {
    const url = `https://api.mcsrvstat.us/3/${serverAddress}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to retrieve server status', error);
    }
}

async function getserverip(serverAddress) {
    const status = await getServerStatus(serverAddress);
    
    if (status) {
        console.log('Server IP:', status.ip);
        
    } else {
        console.log('Failed to retrieve server status');
    }
}


const options = {
    timeout: 5000, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};


async function main() {
    let serverAddress = ""; // Initialize serverAddress variable
    console.log('Default Port is 25565')
    const port = parseInt(prompt("Enter 5 digit port: ")); // Get port input

    // Continue prompting until user enters "exit"
    while (serverAddress !== "exit") {
        console.log('Type "exit" to quit program')
        serverAddress = prompt("Enter server address here: ");

        if (serverAddress === "exit") {
            console.log("Exiting...");
            break; // Exit the loop if "exit" is entered
        }

        // Wait for server information before proceeding to the next prompt
        try {
            const result = await util.status(serverAddress, port, options); // Await server check
            console.log('Server Info:', result, '\n'); // Log the entire result object
            
            if (result.players) {
                console.log('Players Online:', result.players, '\n'); // Log the players information

                if (result.players.online > 1 && result.players.sample == null) {
                    console.log('Server does not allow Player Lists \n');
                }
            } else {
                console.log('No players online.');
            }
        } catch (error) {
            console.error('Error checking server status:', error);
        }
    }
}

main(); // Run the main function
