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


const listProject = `https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/roomy-proximal-clam|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/exciting-evanescent-marquess|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/polarized-numerous-goldfish|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/zinc-bouncy-yamamomo|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/jeweled-turquoise-planet|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/dynamic-fearless-burglar|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/glossy-shrouded-spoon|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/skillful-grove-dime|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/glacier-scandalous-stream|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/instinctive-youthful-porpoise|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/lemon-six-liver|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/glowing-shy-cauliflower|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/brainy-buttoned-drop|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/cotton-meteor-bite`.trim().split('|');

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