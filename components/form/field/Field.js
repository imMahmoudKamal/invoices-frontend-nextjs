import { useEffect, useRef } from 'react';
import { useField } from 'formik';
import styles from './field.module.scss';
import { formatDate } from '../../../utils';

function Field(props) {
  const [field, meta] = useField(props);
  const dateElement = useRef(null);

  useEffect(() => {
    if (field.name === 'invoiceDetails.invoiceDate') {
      dateElement.current.parentElement.dataset.date = formatDate(field.value);
    }
  }, [field.name, field.value]);

  return (
    <input
      className={styles.field}
      id={field.name}
      ref={dateElement}
      {...field}
      {...props}
      // errors
      aria-invalid={meta.touched && meta.error ? 'true' : 'false'}
      aria-errormessage={field.name}
    />
  );
}

export default Field;
