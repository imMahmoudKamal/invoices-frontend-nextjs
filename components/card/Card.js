import { calcPrice, formatDate } from '../../utils';
import styles from './card.module.scss';
import Link from 'next/link';
import Status from '../status/Status';

export default function Card({ card }) {
  return (
    <Link href={`/invoice/${card._id}`} scroll={false}>
      <a className={styles.card}>
        <h2 className={styles.card__id}>{card._id}</h2>
        <span className={styles.card__date}>{formatDate(card.invoiceDetails.paymentDate)}</span>
        <h3 className={styles.card__price}>{calcPrice(card.invoiceDetails.itemList)}</h3>

        <span className={styles.card__name}>{card.clientDetails.name}</span>
        <Status status={card.invoiceDetails.status} />
      </a>
    </Link>
  );
}
