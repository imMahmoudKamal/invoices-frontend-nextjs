import { ErrorMessage } from 'formik';
import Field from '../field/Field';
import Select from '../select/Select';
import styles from './formControl.module.scss';

function FormControl({ className, control, label, ...others }) {
  function getControl() {
    switch (control) {
      case 'input':
        return <Field {...others} />;

      case 'select':
        return <Select {...others} />;

      default:
        return null;
    }
  }

  function setClassName() {
    const defaultClass = `${styles.control}${className ? ` ${className}` : ''}`;

    if (control === 'select') {
      return `${defaultClass} ${styles.select}`;
    } else if (others.type === 'date') {
      return `${defaultClass} ${styles.date}`;
    } else {
      return `${defaultClass}`;
    }
  }

  return (
    <div className={setClassName()}>
      {getControl()}

      <label className={styles.control__label} htmlFor={others.name}>
        {label}
      </label>

      <span className={styles.control__error} id={others.name}>
        <ErrorMessage name={others.name} />
      </span>
    </div>
  );
}

export default FormControl;
