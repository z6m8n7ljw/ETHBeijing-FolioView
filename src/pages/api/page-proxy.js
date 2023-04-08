import nodeFetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

export default async function handler(req, res) {
  const { target, proxy=false } = req.query;
  try {
    const response = await nodeFetch(target, {
      // headers: {
      //   "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/111.0.0.0"
      // }
    });
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.log(error)
    res.status(200).send("failed!");
  }
}
