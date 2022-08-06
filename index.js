// opening a port
const express = require('express')
const app = express()
const port = 1234

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
// sleep is only in async processes, type await sleep(ms)

const hooker = 'insert webhook url here'
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(hooker);

const fs = require("fs")
const readline = require('readline');

const fetch = require('node-fetch');

const removeLines = (data, lines = []) => {
  return data
    .split('\n')
    .filter((val, idx) => lines.indexOf(idx) === -1)
    .join('\n');
}

URL = 'https://api.whatexploitsare.online/status/Synapse'
previousdata = 'ok'

let done = 0;

async function getdata() {
  fetch(URL)
    .then((result) => result.text())
    .then((data) => {
      fs.writeFile('synapse.txt', data, function(err) {
        if (err) throw err;
        console.log('\nSaved!');
        if (previousdata == data) { console.log('\nnot updated\n') } else {
          previousdata = data
          const removeLines = (data, lines = []) => {
            return data
              .split('\n')
              .filter((val, idx) => lines.indexOf(idx) === -1)
              .join('\n');
          }
          fs.readFile("synapse.txt", 'utf8', (err, data) => {
            if (err) throw err;

            fs.writeFile("synapse.txt", removeLines(data, [0, 2, 8, 10]), 'utf8', function(err) {
              if (err) throw err;
              const jsondata = JSON.parse(fs.readFileSync("synapse.txt").toString())
              console.log("json fully formatted\n");


              for (const [key, value] of Object.entries(jsondata)) {
                console.log(`${key}: ${value}`);
              }

              hook.send('```diff\n' + '+ Synapse Status Changed!\n+ Is Synapse Updated?: ' + jsondata.updated + '\n+ Current Version: ' + jsondata.exploit_version + '\n- Roblox Version: ' + jsondata.roblox_version + '\n- Last Updated: ' + jsondata.last_update + '\n```')
            });
          })
        }
      });
    })
  return 'done'
}

const run = () => {
  getdata().then(result => {
    done++
    console.log(`Done ${done} times.`)
    setTimeout(() => {
      run()
    }, 10000)
  })
}
run()