const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/sixth-ten-xylophone|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/perpetual-discovered-monday|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/gregarious-water-town|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/pool-angry-honey|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/daffy-island-produce|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/oval-expensive-pendulum|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/iris-neat-pluto|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/large-fluttering-pixie|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/plump-broken-hardcover|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/everlasting-metal-address|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/glib-citrine-impala|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/youthful-impossible-slayer|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/lush-unequaled-homegrown|https://6a56868a-0f26-4cb4-a90b-3622c58bae05@api.glitch.com/git/fluffy-cherry-robin`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();