import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// porf 及 token_id 对应的请求体
import CustomRequestBody from "@/data/_request_body.json";
import {TOKEN_KEY, TOKEN_TEXT, WALLET_KEY} from "@/lib/constants";
import AssetInWallets from "@/data/asset_in_wallet.json";
import ethereum from "@/data/ethereum.json";
import binancecoin from "@/data/binancecoin.json";
import solana from "@/data/solana.json";
import polygon from "@/data/matic-network.json";
import total_in_chain from "@/data/total_in_chain.json";


let tokenId = "";
let tokenText = "";
let wallets = [];
if (typeof window !== "undefined") {
  // Perform localStorage action
  tokenId = localStorage.getItem(TOKEN_KEY) || "";
  tokenText = localStorage.getItem(TOKEN_TEXT) || "";
  try {
    wallets = JSON.parse(localStorage.getItem(WALLET_KEY) || "[]");
  } catch (error) {
  }
}

export const fetchAsset = createAsyncThunk(
  "asset/fetchAsset",
  async ({startDate, endDate} = {}, {getState}) => {
    const {
      asset: {wallets},
    } = getState();

    try {
      const res = await fetch("/api/fetch-asset", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({addresses: wallets}),
      });
      console.log('data======');
      let data = await res.json();

      if (startDate && endDate) {
        data = data.map(x => {
          const startIndex = x.data.findIndex(x => x.timestamp === startDate),
            endIndex = x.data.findIndex(x => x.timestamp === endDate),
            list = x.data.slice(startIndex, endIndex === -1 ? x.data.length : (endIndex + 1));

          return {
            address: x.address,
            data: list
          }
        })
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPL = createAsyncThunk(
  "asset/fetchPL",
  async (addresses = [], {getState}) => {
    const {
      asset: {wallets},
    } = getState();
    try {
      const res = await fetch("/api/fetch-pl", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({addresses: wallets}),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPortf = createAsyncThunk("asset/fetchPortf", async (address) => {
  console.log({address})
  const url = process.env.serverURL + "/portf";
  if(localStorage.getItem('portf')) {
    return JSON.parse(localStorage.getItem('portf'))
  }
  const getBody = () => {
    if (address.length > 2) {
      if (address.find(a => a.startsWith('2f'))) {
        return {ethereum, binancecoin, 'matic-network': polygon, solana}
      }
      return {ethereum, binancecoin, 'matic-network': polygon}
    }
    return false;
  }
  if (getBody()) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(getBody()),
    });
    const data = await res.json();
    localStorage.setItem('portf', JSON.stringify(data))
    return data;
  }
});

export const fetchTokenId = createAsyncThunk("asset/fetchTokenId", async () => {
  const url = process.env.serverURL + "/token_id";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ethereum, binancecoin, user: total_in_chain, 'matic-network': polygon, solana
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
});

const initialState = {
  wallets,
  assetInWallet: {},
  dailyPL: {},
  cumulativePL: {},
  realtimeAsset: {},
  selectedChains: [],

  portf: {},
  tokenId,
  tokenText,
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    addWallet: (state, action) => {
      if (state.wallets.includes(action.payload)) return;

      // const mockAddress = AssetInWallets.map(x => x.address);
      // if (state.wallets.includes(mockAddress)) return;

      const wallets = Array.from(new Set([...state.wallets, action.payload]));
      // const wallets = Array.from(new Set([...state.wallets, action.payload, ...mockAddress]));
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));
      state.wallets = wallets;
    },
    updateAssetInWallet: (state, action) => {
      const {address, asset} = action.payload;
      state.assetInWallet[address] = asset;
    },
    selectChain: (state, action) => {
      if (!action.payload || !action.payload.length) {
        state.selectedChains = [];
      } else {
        const chains = [...action.payload];
        const sorted = chains.sort((a, b) => {
          if (!a.id && !b.id) return 0;
          if (!a.id) return 1;
          if (!b.id) return -1;
          return a.id.localeCompare(b.id);
        });
        state.selectedChains = sorted;
      }
    },
    setTokenId: (state, action) => {
      localStorage.setItem(TOKEN_KEY, action.payload.tId);
      localStorage.setItem(TOKEN_TEXT, action.payload.tId2);
      state.tokenId = action.payload.tId;
      state.tokenText = action.payload.tId2;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAsset.fulfilled, (state, action) => {
      const {payload} = action;
      if (Array.isArray(payload)) {
        const assetInWallet = {};
        const realtimeAsset = {};
        payload
          .filter((item) => item.data && item.data.length)
          .forEach(({address, data}) => {
            assetInWallet[address] = data;
            const {timestamp, ...rest} = data[data.length - 1] || {};
            realtimeAsset[address] = rest;
          });
        state.assetInWallet = assetInWallet;
        state.realtimeAsset = realtimeAsset;
      }
    });
    builder.addCase(fetchPL.fulfilled, (state, action) => {
      const {payload} = action;
      if (Array.isArray(payload)) {
        const dailyPl = {};
        const cumulativePL = {};
        payload.forEach(({daily, cumulative}) => {
          dailyPl[daily.address] = daily.data;
          cumulativePL[cumulative.address] = cumulative.data;
        });
        state.dailyPL = dailyPl;
        state.cumulativePL = cumulativePL;
      }
    });
    builder.addCase(fetchPortf.fulfilled, (state, action) => {
      const {payload} = action;
      state.portf = payload || {};
    });
  },
});

export const {addWallet, updateAssetInWallet, selectChain, setTokenId, filterData} =
  assetSlice.actions;

export default assetSlice.reducer;
