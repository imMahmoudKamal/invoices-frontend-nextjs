import { useRouter } from 'next/router';
import { useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context';
import { Formik, Form as FormTag, FieldArray } from 'formik';
import { validationSchema } from '../../validation/formSchema';
import { addToLocalStorage, calcPaymentDate, deleteFromLocalStorage, getDiff, updateLocalStorage } from '../../utils';
import FormControl from './formControl/FormControl';
import styles from './form.module.scss';
import ItemList from './itemList/ItemList';
import invoicesAPI from '../../api';

export default function Form() {
  const { form, ui } = useAppContext();
  const formEl = useRef(null);
  const Router = useRouter();

  useEffect(() => {
    const div = document.querySelector('div#__next');

    if (formEl.current.classList.contains(styles['form--active'])) {
      div.style.overflow = 'hidden';
      div.style.height = `${formEl.current.clientHeight}px`;
    } else {
      div.removeAttribute('style');
    }
  }, [form.isOpenForm]);

  const initialValues = {
    billFrom: {
      street: '',
      city: '',
      post: '',
      country: '',
    },

    clientDetails: {
      name: '',
      email: '',
      address: {
        street: '',
        city: '',
        post: '',
        country: '',
      },
    },

    invoiceDetails: {
      invoiceDate: new Date().toISOString().replace(/T.*/, '').split('-').join('-'),
      paymentDate: calcPaymentDate(1),
      description: '',
      itemList: [
        {
          name: '',
          qty: '',
          price: '',
        },
      ],
    },

    ...form.editFormData,
  };

  const resetFormAndUpdateUI = useCallback(
    (formik, newInvoiceId) => {
      // reset form
      formik.resetForm();

      // close form
      form.setIsOpenForm(false);

      // udpade ui
      ui.setUpdateUI(true);

      // redirect to new invoice
      if (form.editFormData) {
        Router.replace(newInvoiceId);
      }
    },
    [Router, form, ui]
  );

  const formSubmitHandler = useCallback(
    async (values, submitProps) => {
      const formData = { ...values, invoiceDetails: { ...values.invoiceDetails, status: 'Pending' } };

      try {
        const response = await invoicesAPI.post('invoice', formData);
        if (response) {
          submitProps.setSubmitting(false);
          resetFormAndUpdateUI(submitProps, response.data.invoice._id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [resetFormAndUpdateUI]
  );

  const saveAsDraftHandler = useCallback(
    (formik) => {
      const formData = {
        ...formik.values,
        invoiceDetails: { ...formik.values.invoiceDetails, status: 'Draft' },
      };

      if (form.editFormData) {
        updateLocalStorage(form.editFormData._id, formData);
      } else {
        formData._id = `DT${Math.random().toString().substring(2, 6)}`;
        formData.createdAt = new Date().toISOString();

        addToLocalStorage(formData);
      }

      resetFormAndUpdateUI(formik);
    },
    [form.editFormData, resetFormAndUpdateUI]
  );

  const updateFormHandler = useCallback(
    async (formik) => {
      // create new invoice from a draft
      if (form.editFormData.invoiceDetails.status === 'Draft') {
        formik.handleSubmit();

        // delete draft invoice
        deleteFromLocalStorage(form.editFormData._id);
      } else {
        const errors = await formik.setTouched({ ...formik.touched, ...formik.errors });
        const updatedValues = getDiff(form.editFormData, formik.values);

        if (!Object.keys(errors).length && Object.keys(updatedValues).length) {
          try {
            const response = await invoicesAPI.patch(`invoice/${form.editFormData._id}`, updatedValues);

            if (response) {
              formik.setSubmitting(false);
              resetFormAndUpdateUI(formik, form.editFormData._id);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    [form.editFormData, resetFormAndUpdateUI]
  );

  return (
    <>
      {form.isOpenForm && <div className={styles.shadow} onClick={() => form.setIsOpenForm(false)}></div>}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={formSubmitHandler}
        render={(formik) => (
          <FormTag className={`${styles.form} ${form.isOpenForm ? styles['form--active'] : ''}`} ref={formEl}>
            <h2 className={styles.form__header}>
              {form.editFormData ? (
                <>
                  Edit <span className={styles.form__header__id}>{form.editFormData._id}</span>
                </>
              ) : (
                'Create Invoice'
              )}
            </h2>

            <div className={styles.form__body}>
              <fieldset className={styles.form__body__fieldset}>
                <legend className={styles.form__body__legend}>Bill From</legend>

                <FormControl
                  className={styles.form__body__full}
                  control="input"
                  type="text"
                  label="Street Address"
                  name="billFrom.street"
                  autoComplete="nope"
                />
                <FormControl
                  className={styles.form__body__half}
                  control="input"
                  type="text"
                  label="City"
                  name="billFrom.city"
                />
                <FormControl
                  className={styles.form__body__half}
                  control="input"
                  type="number"
                  label="Post Code"
                  name="billFrom.post"
                />
                <FormControl
                  className={`${styles.form__body__half} ${styles['form__body__half--full']}`}
                  control="input"
                  type="text"
                  label="Country"
                  name="billFrom.country"
                />
              </fieldset>

              <fieldset className={styles.form__body__fieldset}>
                <legend className={styles.form__body__legend}>Bill To</legend>

                <FormControl
                  className={`${styles.form__body__full} ${styles['form__body__full--half']}`}
                  control="input"
                  type="text"
                  label="Client's Name"
                  name="clientDetails.name"
                />
                <FormControl
                  className={`${styles.form__body__full} ${styles['form__body__full--half']}`}
                  control="input"
                  type="email"
                  label="Client's Email"
                  placeholder="e.g. email@example.com"
                  name="clientDetails.email"
                />

                <FormControl
                  className={styles.form__body__full}
                  control="input"
                  type="text"
                  label="Client's Address"
                  name="clientDetails.address.street"
                />
                <FormControl
                  className={styles.form__body__half}
                  control="input"
                  type="text"
                  label="City"
                  name="clientDetails.address.city"
                />
                <FormControl
                  className={styles.form__body__half}
                  control="input"
                  type="number"
                  label="Post Code"
                  name="clientDetails.address.post"
                />
                <FormControl
                  className={`${styles.form__body__half} ${styles['form__body__half--full']}`}
                  control="input"
                  type="text"
                  label="Country"
                  name="clientDetails.address.country"
                />
              </fieldset>

              <fieldset className={styles.form__body__fieldset}>
                <legend className={styles.form__body__legend}>Invoice</legend>

                <FormControl
                  className={`${styles.form__body__half} ${styles.form__body__date}`}
                  control="input"
                  type="date"
                  label="Invoice Date"
                  name="invoiceDetails.invoiceDate"
                />

                <FormControl
                  className={`${styles.form__body__half} ${styles.form__body__payment}`}
                  control="select"
                  options={[
                    { key: 'Net 1 Day', value: 1 },
                    { key: 'Net 7 Day', value: 7 },
                    { key: 'Net 14 Day', value: 14 },
                    { key: 'Net 30 Day', value: 30 },
                  ]}
                  label="Payment Term"
                  name="invoiceDetails.paymentDate"
                  invoiceDate={formik.values.invoiceDetails.invoiceDate}
                />

                <FormControl
                  className={styles.form__body__full}
                  control="input"
                  type="text"
                  label="Description"
                  placeholder="e.g. Graphic Design Service"
                  name="invoiceDetails.description"
                />
              </fieldset>

              <fieldset className={styles.form__body__fieldset}>
                <legend className={styles.form__body__items__legend}>Item List</legend>

                <FieldArray
                  name="invoiceDetails.itemList"
                  render={(arrayHelpers) => (
                    <ItemList
                      className={styles.form__body__full}
                      itemList={formik.values.invoiceDetails.itemList}
                      push={arrayHelpers.push}
                      remove={arrayHelpers.remove}
                      handleRemove={formik.setValues}
                    />
                  )}
                />
              </fieldset>
            </div>

            <div className={styles.form__footer}>
              {form.editFormData ? (
                <>
                  <button
                    className={`${styles.form__footer__btn} ${styles['form__footer__btn--discard']}`}
                    type="reset"
                    onClick={() => form.setIsOpenForm(false)}>
                    Discard
                  </button>

                  {form.editFormData.invoiceDetails.status === 'Draft' && (
                    <button
                      className={`${styles.form__footer__btn} ${styles['form__footer__btn--draft']}`}
                      type="button"
                      onClick={saveAsDraftHandler.bind(this, formik)}>
                      Save as Draft
                    </button>
                  )}

                  <button
                    className={`${styles.form__footer__btn} ${styles['form__footer__btn--save']}`}
                    type="button"
                    onClick={updateFormHandler.bind(this, formik)}>
                    Save & send
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`${styles.form__footer__btn} ${styles['form__footer__btn--discard']}`}
                    type="reset"
                    onClick={() => form.setIsOpenForm(false)}>
                    Discard
                  </button>

                  <button
                    className={`${styles.form__footer__btn} ${styles['form__footer__btn--draft']}`}
                    type="button"
                    onClick={saveAsDraftHandler.bind(this, formik)}>
                    Save as Draft
                  </button>

                  <button
                    className={`${styles.form__footer__btn} ${styles['form__footer__btn--save']}`}
                    type="submit"
                    disabled={formik.isSubmitting}>
                    Save & send
                  </button>
                </>
              )}
            </div>
          </FormTag>
        )}
      />
    </>
  );
}
