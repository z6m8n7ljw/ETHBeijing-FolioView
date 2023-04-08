// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract FolioViewNFT is ERC721 {
  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("FolioViewNFT", "FOLIOVIEW") {
    console.log("This is my NFT contract. Woah!");
  }

  // A function our user will hit to get their NFT.
  function mintNFT(uint256 tokenId) public {
     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, tokenId);

    // Return the NFT's metadata
    tokenURI(tokenId);
  }

  // Set the NFT's metadata
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId));
    console.log("An NFT w/ ID %s has been minted to %s", tokenId, msg.sender);
    if (tokenId == 0) {
        return "https://api.npoint.io/ff7187e16f25b003b612";
    }
    else if (tokenId == 1) {
        return "https://api.npoint.io/64a83ad603ab77f4ecc4";
    }
    else if (tokenId == 2) {
        return "https://api.npoint.io/7ccc9f1ef7e98f9fed36";
    }
    else if (tokenId == 3) {
        return "https://api.npoint.io/e2735764e631dac6450c";
    }
    else if (tokenId == 4) {
        return "https://api.npoint.io/70367151e8ae73bc3c8a";
    }
    else
        return "";
  }
}