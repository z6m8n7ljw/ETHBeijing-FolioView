import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { addresses } = req.body;
  if (!addresses.length) {
    return res.status(200).json([]);
  }
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/data/asset_in_wallet.json"))
    );
    const ret = addresses.map(
      (address) =>
        data.find((item) => item.address === address)
    ).filter(item => !!item);

    return res.status(200).json(ret);
  } catch (error) {
    res.statue(400).json({});
  }
}
