import { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import Card from "@/components/Card";
import styles from './AirDrop.module.css';

const fetcher = (url, { arg }) => fetch(url + "?" + new URLSearchParams(arg).toString()).then(res => res.json());

const AirDrop = () => {
  const {
    data,
    trigger,
    isMutating,
  } = useSWRMutation("https://api.airdropking.io/airdrops/", fetcher);

  useEffect(() => {
    trigger({ order: 'ending' });
  }, [])

  console.log('data---');

  let filterData = [];

  try {
    filterData = data ? data.slice(0, 4) : [];
  } catch (err) {
    console.log(err);
  }

  return (
    <Card title="Airdrops you may like" containerClass="col-span-2 grid-cols-2 gap-8">
      <ul className={styles.ul}>
        {filterData && filterData.map((x, y) => (
          <li key={y} className={styles.item}>
            <div className={styles.img} >
              <img src={x.thumbnail} alt="" />
            </div>
            <div className={styles.txt}>
              <h3 className={styles.h3}>{x.name}</h3>
              <p className={styles.p}>{x.about}</p>
            </div>
            <a href={x.url_airdrop} className={styles.join} target="_blank" >Join now</a>
          </li>
        ))}
      </ul>
    </Card>
  )

};

export default AirDrop;