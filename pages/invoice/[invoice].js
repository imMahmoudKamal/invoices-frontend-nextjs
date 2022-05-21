import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context';
import { calcPrice, formatDate } from '../../utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Status from '../../components/status/Status';
import Modal from '../../components/modal/Modal';
import invoicesAPI from '../../api';
import styles from './invoice.module.scss';

export default function Invoice({ invoice }) {
  const [invoiceDetails, setInvoiceDetails] = useState(invoice);
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    setInvoiceDetails(invoice);
  }, [invoice]);

  useEffect(() => {
    if (invoice.notFound) {
      const draftInvoice = JSON.parse(localStorage.draftInvoices).find((item) => item._id === invoice.id);

      draftInvoice ? setInvoiceDetails(() => draftInvoice) : Router.push('/');
    }
  }, [Router, invoice.id, invoice.notFound]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    setIsOpen(false);
  }, [isOpen]);

  const slideIn = {
    initial: {
      opacity: 0,
    },

    animate: {
      opacity: 1,
      transition: { duration: 0.1 },
    },

    exit: {
      opacity: 0,
      x: '-100%',
      transition: { duration: 0.6 },
    },
  };

  return (
    invoiceDetails._id && (
      <>
        <Head>
          <title>{`Invoices App | #${invoiceDetails._id}`}</title>
        </Head>

        <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} invoiceDetails={invoiceDetails} />

        <motion.div
          className={`${styles.invoice} container`}
          variants={slideIn}
          exit="exit"
          initial="initial"
          animate="animate">
          <Link href="/">
            <a className={styles.invoice__back}>Go back</a>
          </Link>

          <div className={styles.invoice__status}>
            <div className={styles.invoice__status__content}>
              <div className={styles.invoice__status__content__text}>Status</div>
              <Status status={invoiceDetails.invoiceDetails.status} />
            </div>

            <InvoiceButtons
              className={styles.invoice__status__cta}
              setIsOpenModal={setIsOpenModal}
              invoiceDetails={invoiceDetails}
              setInvoiceDetails={setInvoiceDetails}
            />
          </div>

          <div className={styles.invoice__details}>
            <div className={styles.invoice__details__meta}>
              <h1>{invoiceDetails._id}</h1>
              <span>{invoiceDetails.invoiceDetails.description}</span>
            </div>

            <address className={styles.invoice__details__address}>
              <span>{invoiceDetails.billFrom.street}</span>
              <span>{invoiceDetails.billFrom.city}</span>
              <span>{invoiceDetails.billFrom.post}</span>
              <span>{invoiceDetails.billFrom.country}</span>
            </address>

            <div className={styles.invoice__details__payment}>
              <div>
                <span>Invoice Date</span>
                <div>{formatDate(invoiceDetails.invoiceDetails.invoiceDate)}</div>
              </div>
              <div>
                <span>Payment Due</span>
                <div>{formatDate(invoiceDetails.invoiceDetails.paymentDate)}</div>
              </div>
            </div>

            <address className={styles.invoice__details__address}>
              <span>Bill to</span>
              <div>{invoiceDetails.clientDetails.name}</div>
              <span>{invoiceDetails.clientDetails.address.street}</span>
              <span>{invoiceDetails.clientDetails.address.city}</span>
              <span>{invoiceDetails.clientDetails.address.post}</span>
              <span>{invoiceDetails.clientDetails.address.country}</span>
            </address>

            <div className={styles.invoice__details__mail}>
              <span>Sent to</span>
              <div>{invoiceDetails.clientDetails.email}</div>
            </div>

            <table className={styles.invoice__table}>
              <thead className={styles.invoice__table__head}>
                <tr>
                  <th>Item Name</th>
                  <th>QTY.</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody className={styles.invoice__table__body}>
                {invoiceDetails.invoiceDetails.itemList.map(({ name, price, qty }, index) => {
                  return (
                    <tr key={name + price + qty || index}>
                      <td>{name}</td>
                      <td className={styles.invoice__table__body__hide}>{qty}</td>
                      <td className={`${styles.price} ${styles.invoice__table__body__hide}`}>
                        {price.toLocaleString()}
                      </td>
                      <td className={styles.price}>{(price * qty).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot className={styles.invoice__table__foot}>
                <tr>
                  <th colSpan="2">Amount Due</th>
                  <td colSpan="2" className={styles.price}>
                    {calcPrice(invoiceDetails.invoiceDetails.itemList)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <InvoiceButtons
            className={styles.invoice__bottom__cta}
            setIsOpenModal={setIsOpenModal}
            invoiceStatus={invoiceDetails.invoiceDetails.status}
            invoiceDetails={invoiceDetails}
            setInvoiceDetails={setInvoiceDetails}
          />
        </motion.div>
      </>
    )
  );
}

function InvoiceButtons({ className, setIsOpenModal, invoiceDetails, setInvoiceDetails }) {
  const { form } = useAppContext();
  const invoiceStatus = invoiceDetails.invoiceDetails.status;

  const deleteHandler = useCallback(() => {
    setIsOpenModal((prevState) => !prevState);
  }, [setIsOpenModal]);

  const markAsPaidHandler = useCallback(async () => {
    setInvoiceDetails((prevData) => ({ ...prevData, invoiceDetails: { ...prevData.invoiceDetails, status: 'Paid' } }));

    try {
      await invoicesAPI.patch(`invoice/${invoiceDetails._id}`, { invoiceDetails: { status: 'Paid' } });
    } catch (error) {
      console.log(error);
    }
  }, [invoiceDetails._id, setInvoiceDetails]);

  const editInvoiceHandler = useCallback(() => {
    // open form
    form.setIsOpenForm(true);

    // pass invoice date onto form
    form.setEditFormData(invoiceDetails);
  }, [form, invoiceDetails]);

  return (
    <div className={`${styles.invoice__cta} ${className}`}>
      {invoiceStatus !== 'Paid' && (
        <button className={styles.invoice__cta__edit} onClick={editInvoiceHandler}>
          Edit
        </button>
      )}

      <button className={styles.invoice__cta__delete} onClick={deleteHandler}>
        Delete
      </button>

      {invoiceStatus !== 'Draft' && invoiceStatus !== 'Paid' && (
        <button className={styles.invoice__cta__mark} onClick={markAsPaidHandler}>
          Mark As Paid
        </button>
      )}
    </div>
  );
}

export async function getServerSideProps({ query: { invoice } }) {
  try {
    const response = await invoicesAPI.get(`http://localhost:5000/api/invoice/${invoice}`);

    if (response) return { props: { invoice: response.data.invoice } };
  } catch (error) {
    if (error.response.data.error === 'Not Found') return { props: { invoice: { id: invoice, notFound: true } } };
  }
}
