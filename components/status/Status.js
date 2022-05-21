import styles from './status.module.scss';

function Status({ status }) {
  function getStatusClass() {
    if (status === 'Paid') {
      return `${styles.status} ${styles['status--paid']}`;
    } else if (status === 'Pending') {
      return `${styles.status} ${styles['status--pending']}`;
    }
    return styles.status;
  }

  return <div className={getStatusClass()}>{status}</div>;
}

export default Status;
