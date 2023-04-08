import React, { useMemo, useState } from "react";
import Card from "@/components/Card";
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import { fetchTokenId, setTokenId } from "@/store/assetSlice";
import { BADGES_LEVEL_NAEM_INFO } from "@/lib/constants";
import { askContractToMintNft } from "@/lib/call";
import Loading from "@/components/Loading";
import Progress from '@/components/Progress';
import styles from './Insights.module.css';

const Insight = () => {
  const dispatch = useDispatch();
  const portf = useSelector((state) => state.asset.portf);
  const tokenId = useSelector((state) => state.asset.tokenId);
  const tokenText = useSelector((state) => state.asset.tokenText);
  const [minting, setMinting] = useState(false);
  console.log({tokenId});
  const portfInfo = useMemo(() => {
    const vals = Object.values(portf);
    if (!vals.length) return [];
    const {result1, result2} = portf;
    return result1.map((value, index) => ({
      name: ['ethereum', 'bsc', 'polygon', 'solana'][index],
      value: value,
    }));
  }, [portf]);
  console.log(portfInfo);

  const expected = useMemo(() => {
    if (!portf.result2) return null;
    return portf.result2;
  }, [portf]);

  const handleRequestNFT = async () => {
    try {
      const {meta, payload} = await dispatch(fetchTokenId());
      if (meta.requestStatus === "fulfilled") {
        const tId = payload.result1;
        const tId2 = payload.results2;
        setMinting(true);
        console.log(payload)
        dispatch(setTokenId({tId, tId2}));
        await askContractToMintNft(tId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMinting(false);
    }
  };
  const getText = () => {
    if(tokenText < 0) {
      return 'Your portfolio has an opposite trend to the market.'
    }
    if(tokenText < 1) {
      return 'Your portfolio is more stable than the market.'
    }
    if(tokenText >= 1) {
      return 'Your portfolio is more volatile than the market.'
    }
  }
  const openseaurl = 'https://testnets.opensea.io/assets/goerli/0x983a8166d0c70e90ef0600bddd097c885a2c994d/'
  return (
    <Card title={"Insights"} containerClass="relative" childrenClass={styles.insights}>
      <Loading loading={minting} />
      {tokenId !== '' ? (
        <div>
          <div className={styles.txt}>
            You are the <strong>{BADGES_LEVEL_NAEM_INFO[tokenId]}</strong> investor after synthesizing your portfolio.
          </div>
          <div className={styles.imgWrap} onClick={()=> window.open(openseaurl+ tokenId)}>
            <img
              className="h-48 w-48 mx-auto"
              src={`/badges/${BADGES_LEVEL_NAEM_INFO[tokenId]}.png`}
              alt=""
            />
          </div>
          <div className={styles.txt}>
            {getText()}
          </div>
        </div>
      ) : (
        <>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
          </div>
          <button
            className="mt-2 p-2 bg-indigo-100 rounded-md hover:shadow-sm text-blue-500"
            onClick={handleRequestNFT}
          >
            Evaluate asset
          </button>
        </>
      )}
      {
        tokenId !== '' ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between">
              Based on your portfolio, we recommend this option to you to optimize your profit and lower your risk.
            </div>
            <div>
              {portfInfo.map((item, index) => (
                <div className={clsx("grid grid-cols-2 mt-4", styles.item)} key={index}>
                  <div className={clsx("flex items-center", styles.left120)}>
                    <img
                      className="h-6 w-6 rounded-full mr-2"
                      src={`/logos/${item.name}.png`}
                      alt=""
                    />
                    <span className="text-lg"> {item.name}</span>
                  </div>
                  <Progress percent={(item.value * 100).toFixed(2)}/>
                  <div className={clsx("flex items-center")}>
                    <span>{(item.value * 100).toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
            {expected ? (
              <>
                <div className="grid grid-cols-2 mt-4">
                  <div className="pl-12">
                    <div className="text-lg">Profit</div>
                    <div className="text-green-600"> {expected[0] > 0 ? '↑' : '↓' }{(expected[0]*100).toFixed(2)}%</div>
                  </div>
                  <div className="pl-12">
                    <div className="text-lg">Risk</div>
                    <div className="text-green-600">{expected[0] > 0 ? '↑' : '↓' } {(expected[1]*100).toFixed(2)}%</div>
                  </div>
                </div>
                <div className={styles.disclaimer}>Disclaimer: be careful...</div>
              </>
            ) : null}
          </div>
        ) : null
      }
    </Card>
  );
};

export default Insight;
