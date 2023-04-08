import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { addresses } = req.body;
  if (!addresses.length) {
    return res.status(200).json([]);
  }
  try {
    const diw = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/data/daily_in_wallet.json"))
    );
    const ciw = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "src/data/cumulative_in_wallet.json")
      )
    );
    const ret = addresses
      .map((address) => {
        const daily = diw.find((item) => item.address === address);
        const cumulative = ciw.find((item) => item.address === address);
        if (daily && cumulative) {
          return { daily, cumulative };
        }
        return undefined;
      })
      .filter((item) => !!item);

    return res.status(200).json(ret);
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
}
