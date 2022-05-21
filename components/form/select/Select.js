import { useField } from 'formik';
import { calcPaymentDate } from '../../../utils';
import styles from './select.module.scss';

function Select(props) {
  const [field] = useField(props);

  return (
    <select className={styles.select} id={field.name} {...field}>
      {props.options.map(({ key, value }) => (
        <option key={value} value={calcPaymentDate(value)}>
          {key}
        </option>
      ))}
    </select>
  );
}

export default Select;
