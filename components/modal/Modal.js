import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteFromLocalStorage } from '../../utils';
import invoicesAPI from '../../api';
import styles from './modal.module.scss';

function Modal({ isOpenModal, setIsOpenModal, invoiceDetails }) {
  const Router = useRouter();
  const modalRef = useRef(null);

  const cancelHandler = useCallback(() => setIsOpenModal((prevState) => !prevState), [setIsOpenModal]);

  const deleteHandler = useCallback(async () => {
    if (invoiceDetails.invoiceDetails.status === 'Draft') {
      deleteFromLocalStorage(invoiceDetails._id);
    } else {
      try {
        await invoicesAPI.delete(`invoice/${invoiceDetails._id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }

    // close modal
    cancelHandler();

    // return to home
    Router.push('/');
  }, [invoiceDetails, cancelHandler, Router]);

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.cssText = `
        overflow: hidden !important;
        height: ${modalRef.current.clientHeight - 80}px !important;
      `;
    } else {
      document.body.removeAttribute('style');
    }
  }, [isOpenModal]);

  const shadowAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const scaleAnimation = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: 'spring', duration: 0.35 } },
    exit: { scale: 0, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {isOpenModal && (
        <motion.div
          className={styles.modal}
          variants={shadowAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          ref={modalRef}>
          <motion.div variants={scaleAnimation} className={styles.modal__container}>
            <h2 className={styles.modal__heading}>Confirm Deletion</h2>

            <p className={styles.modal__text}>
              Are you sure you want to delete invoice LE3693? This action cannot be undone.
            </p>

            <div className={styles.modal__cta}>
              <button className={styles.modal__cta__cancel} onClick={cancelHandler}>
                Cancel
              </button>

              <button className={styles.modal__cta__delete} onClick={deleteHandler}>
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
