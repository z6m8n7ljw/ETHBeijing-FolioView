import clsx from "clsx";
import styles from './Card.module.css';

export default function Card(props) {
  const { children, containerClass, childrenClass, title, extra } = props;
  const className = clsx("rounded-md bg-white", containerClass, styles.wrap);
  return (
    <div className={className}>
      {title || extra ? (
        <div className="flex justify-between py-6 px-4">
          <h1 className="text-xl title first-letter:uppercase">{title}</h1>
          <div>{extra}</div>
        </div>
      ) : null}
      <div className={clsx("p-4", childrenClass)}>{children}</div>
    </div>
  );
}
