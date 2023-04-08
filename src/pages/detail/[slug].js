import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Timeline } from "react-twitter-widgets";

import RangeChart from "@/partials/charts/RangeChart";
import Card from "@/components/Card";
import MobileView from "@/components/MobileView";
import styles from "@/styles/Home.module.css";
import { SEARCH_KEY_MAP } from "@/lib/constants";
import useSWRMutation from "swr/mutation";
import AirDrop from '@/components/AirDrop';
import { News_Cycle } from "next/dist/compiled/@next/font/dist/google";
import t_bsc from "../../data/twitters_bsc.json";
import t_ethereum from "../../data/twitters_ethereum.json";
import t_sol from "../../data/twitters_sol.json";
import t_matic from "../../data/twitters_matic.json";
import { TwitterMetadata } from "next/dist/lib/metadata/generate/opengraph";

const fetcher = (url, { arg }) => {
  console.log(url + "?" + new URLSearchParams(arg).toString());
  console.log(new URLSearchParams(arg).toString());
  return fetch(url + "?" + new URLSearchParams(arg).toString()).then((res) =>
    res.json()
  );
};
const News = ({ data }) => {
  return (
    <div onClick={() => window.open(data.url)} className={styles.newBlock}>
      <div
        dangerouslySetInnerHTML={{ __html: data.title }}
        className={styles.newsTitle}
      />
      <div
        dangerouslySetInnerHTML={{ __html: data.desc }}
        className={styles.newsDesc}
      />
    </div>
  );
};
const Twitter = ({ data, users }) => {
  return (
    <div
      className={styles.newBlock}
      onClick={() =>
        window.open(
          `https://twitter.com/${users[data.user_id_str].name}/status/${data.id_str
          }`
        )
      }
    >
      <div className={styles.newsDesc}>{data.full_text}</div>
      <div className={styles.newsDesc}>
        <div className={styles.user}>
          <img
            src={users[data.user_id_str].profile_image_url_https}
            className={styles.twitterAvatar}
          />
          <span className={styles.twitterName}>
            {users[data.user_id_str].name}
          </span>
          <span>{data.created_at.replace("+0000", "")}</span>
        </div>
      </div>
    </div>
  );
};

const Detail = () => {
  const { isConnected } = useAccount();

  const router = useRouter();
  const { slug } = router.query;

  const jsonMap = {
    ethereum: t_ethereum,
    bsc: t_bsc,
    solana: t_sol,
    polygon: t_matic,
  };
  const dataObj = jsonMap[slug];
  const {
    data: news,
    trigger,
    isMutating,
  } = useSWRMutation(process.env.serverURL + "/news", fetcher);

  useEffect(() => {
    slug && trigger({ type: slug });
  }, [slug]);
  const twData =
    dataObj?.globalObjects.tweets &&
    Object.values(dataObj.globalObjects.tweets).sort((a, b) => {
      console.log(new Date(a.created_at) > new Date(b.created_at));
      return b.conversation_id - a.conversation_id;
    });
  console.log(twData);
  const backBtn = (
    <div className="mt-4">
      <button
        className="rounded px-4 h-10 bg-slate-400 hover:shadow-md"
        onClick={router.back}
      >
        Back
      </button>
    </div>
  );
  if (!isConnected || !slug) {
    return (
      <>
        {backBtn}
        <Card containerClass="mt-8">
          <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
            <div className="flex items-center justify-center mt-4">
              <svg
                className="w-10 h-10 mr-2 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
            <div className="text-slate-500 text-center">
              You need to log in first
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <div>
      {backBtn}
      <div className="mt-4 grid grid-cols-3 gap-8">
        <RangeChart chainid={slug} />
        <Card title="News" childrenClass={styles.cardWrapper} containerClass="yc-card">
          <div>
            {news?.result?.map((n) => (
              <News data={n} key={n.id} />
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-8 mt-8 mb-8">
        <AirDrop />
        <Card title="Twitter" childrenClass={styles.cardWrapper}>
          {twData?.map((i) => (
            <Twitter data={i} users={dataObj.globalObjects.users} />
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Detail;
