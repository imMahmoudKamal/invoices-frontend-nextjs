import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './itemList.module.scss';
import FormControl from '../formControl/FormControl';
import DeleteIcon from '/public/images/delete.svg';

function ItemList({ className, itemList, push, remove, handleRemove }) {
  const addNewItem = useCallback(() => {
    push({ name: '', qty: '', price: '' });
  }, [push]);

  const removeItem = useCallback(
    (index, length) => {
      length > 1 && remove(index);
    },
    [remove]
  );

  // animation
  const slideIn = {
    initial: {
      opacity: 0,
      y: -10,
      height: 0,
    },

    animate: {
      opacity: 1,
      y: 0,
      height: '100%',
      transition: { duration: 0.3 },
    },

    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <ul className={`${className} ${styles.list}`}>
        <AnimatePresence>
          {itemList.map(({ qty, price }, index) => {
            return (
              <motion.li
                className={styles.list__item}
                key={index}
                variants={slideIn}
                exit="exit"
                initial="initial"
                animate="animate">
                <FormControl
                  className={styles.list__item__name}
                  control="input"
                  type="text"
                  label="Item Name"
                  name={`invoiceDetails.itemList[${index}].name`}
                />
                <FormControl
                  className={styles.list__item__qty}
                  control="input"
                  type="number"
                  label="Qty."
                  name={`invoiceDetails.itemList[${index}].qty`}
                />
                <FormControl
                  className={styles.list__item__price}
                  control="input"
                  type="number"
                  label="Price"
                  name={`invoiceDetails.itemList[${index}].price`}
                />
                <FormControl
                  className={styles.list__item__total}
                  control="input"
                  type="text"
                  label="Total"
                  name="total"
                  value={(qty * price).toLocaleString()}
                  disabled
                />

                <button
                  className={styles.list__item__delete}
                  type="button"
                  onClick={removeItem.bind(this, index, itemList.length)}>
                  <DeleteIcon />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <button className={`${className} ${styles.addnew}`} type="button" onClick={addNewItem}>
        Add New Item
      </button>
    </>
  );
}

export default ItemList;
