const axios = require("axios");

const NUM_REQUESTS = 50;

async function sendLoginRequest(i) {
  try {
    const res = await axios.get("http://localhost:3000/login", {
      params: {
        username: `user${i}`,
        password: `pass${i}`,
      },
    });
    console.log(`✅ Request ${i} succeeded:`, res.data.sessionId);
  } catch (err) {
    console.error(`❌ Request ${i} failed:`, err.response?.data || err.message);
  }
}

(async () => {
  const requests = [];

  for (let i = 1; i <= NUM_REQUESTS; i++) {
    requests.push(sendLoginRequest(i));
  }

  await Promise.all(requests);

  console.log("🎉 All 50 requests sent.");
})();
