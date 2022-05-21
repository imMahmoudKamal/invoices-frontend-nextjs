import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context';
import { motion } from 'framer-motion';
import styles from './invoices.module.scss';
import CardContainer from '../cardContainer/CardContainer';

function Invoices({ data }) {
  const [allInvoices, setAllInvoices] = useState(data);
  const [filterList, setFilterList] = useState([
    { label: 'Paid', checked: false },
    { label: 'Pending', checked: false },
    { label: 'Draft', checked: false },
  ]);

  const { form, ui } = useAppContext();

  const [filteredData, setFilteredData] = useState(allInvoices);
  const [cardAnimation, setCardAnimation] = useState(false);

  const menuBtnEl = useRef(null);
  const menuListEl = useRef(null);

  const selectFilterHandler = useCallback((event) => {
    const { name, checked } = event.target;

    setFilterList((prevFilter) => [
      ...prevFilter.map((item) => {
        return item.label === name ? { ...item, checked } : { ...item, checked: false };
      }),
    ]);

    setCardAnimation(true);
  }, []);

  const toggleMenuHandler = useCallback((event) => {
    event.stopPropagation();
    menuBtnEl.current.classList.toggle(styles['head__filter__cta--active']);
  }, []);

  const clickOutSideHandler = useCallback((event) => {
    if (!menuListEl.current.contains(event.target)) {
      menuBtnEl.current.classList.remove(styles['head__filter__cta--active']);
    }
  }, []);

  // click outside
  useEffect(() => {
    window.addEventListener('click', clickOutSideHandler);

    return () => {
      window.removeEventListener('click', clickOutSideHandler);
    };
  }, [clickOutSideHandler]);

  // filter data
  useEffect(() => {
    const filteredData = filterList.every((item) => item.checked === false)
      ? allInvoices
      : allInvoices.filter(
          (card) => card.invoiceDetails.status === filterList.find((item) => item.checked === true)?.label
        );

    let sortedData = [...filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))];

    setFilteredData(sortedData);
  }, [allInvoices, filterList]);

  // get draft invoices
  useEffect(() => {
    if (localStorage.draftInvoices) {
      setAllInvoices(() => [...data, ...JSON.parse(localStorage.draftInvoices)]);

      ui.setUpdateUI(false);
    }
  }, [data, ui, ui.updateUI]);

  useEffect(() => {
    setFilteredData(() => allInvoices);
  }, [allInvoices]);

  const slideOut = {
    exit: {
      opacity: 0,
      x: '100%',
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div className="container" variants={slideOut} exit="exit">
      <div className={styles.head}>
        <div className={styles.head__info}>
          <h1 className={styles.head__info__heading}>Invoices</h1>
          <p className={styles.head__info__text}>
            {`There are ${filteredData.length} ${
              filterList.find((item) => item.checked === true)?.label.toLowerCase() || 'total'
            } invoices.`}
          </p>
        </div>

        <div className={styles.head__filter}>
          <button className={styles.head__filter__cta} onClick={toggleMenuHandler} ref={menuBtnEl}>
            Filter<span> by status</span>
          </button>

          <ul className={styles.head__filter__list} ref={menuListEl}>
            {filterList.map(({ label, checked }) => (
              <li key={label}>
                <label htmlFor={label}>
                  <input type="checkbox" name={label} id={label} checked={checked} onChange={selectFilterHandler} />
                  <span>{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button className={styles.head__addNew} onClick={() => form.setIsOpenForm(true)}>
          New<span> Invoice</span>
        </button>
      </div>

      <CardContainer data={filteredData} cardAnimation={cardAnimation} />
    </motion.div>
  );
}

export default Invoices;
