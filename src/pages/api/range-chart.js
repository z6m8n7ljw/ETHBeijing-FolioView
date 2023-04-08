import nodeFetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const { chainid, from, to } = req.query;

  if (!chainid || !from || !to) {
    res.status(200).json({ prices: [], })
    return
  }
  /**mock data fetch*/
  await (new Promise((res) => {
    setTimeout(res, 1000)
  }))

  const rangeData = fs.readFileSync(path.join(process.cwd(), `src/data/range_${chainid}.json`));
  return res.status(200).json(JSON.parse(rangeData))

  /**real data fetch */
  const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

  const proxyAgent = new HttpsProxyAgent(proxyUrl);
  const url = `https://api.coingecko.com/api/v3/coins/${chainid}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const headers = { 'accept': 'application/json' };

  try {
    const response = await nodeFetch(url, { headers, agent: proxyAgent });
    const body = await response.json();
    res.status(200).json(body)

  } catch (error) {
    res.status(400).json({ error })
  }
}
