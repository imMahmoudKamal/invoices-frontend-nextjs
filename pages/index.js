import { useState, useEffect } from 'react';
import { useAppContext } from '../context';
import Head from 'next/head';
import invoicesAPI from '../api';
import Invoices from '../components/invoices/Invoices';

export default function Home({ invoices }) {
  const [invoicesList, setInvoicesList] = useState(invoices);
  const { ui } = useAppContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await invoicesAPI.get('invoice');
        setInvoicesList(response.data.invoices);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [ui.updateUI]);

  return (
    <>
      <Head>
        <title>{`Invoices App | Invoices (${invoicesList.length})`}</title>
      </Head>
      <Invoices data={invoicesList} />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await invoicesAPI.get('invoice');
    if (response) return { props: { invoices: response.data.invoices } };
  } catch (error) {
    return error;
  }
}
