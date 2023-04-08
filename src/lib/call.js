import FolioViewNft from "@/abis/FolioViewNFT.json";
import * as ethers from 'ethers';

export const askContractToMintNft = async (tokenId) => {
  const CONTRACT_ADDRESS = "0x983A8166D0C70E90ef0600Bddd097C885a2C994d";
  // const CONTRACT_ADDRESS = process.env.FOLIO_VIEW_NFT_ADDRESS;
  try {
    const { goerli } = window;

    if (goerli) {
      const provider = new ethers.providers.Web3Provider(goerli);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        FolioViewNft.abi,
        signer
      );
      console.log(connectedContract)

      console.log("Going to pop wallet now to pay gas...");
      let nftTxn = await connectedContract.mintNFT(tokenId); // 这里传入 0~4 中的参数

      console.log("Mining...please wait.");
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
      );
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    
    console.log(error.message);
    throw new Error('mint failed!')
  }
};
