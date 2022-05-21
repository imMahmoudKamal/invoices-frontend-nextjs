import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../card/Card';
import styles from './cardContainer.module.scss';

function CardContainer({ data, cardAnimation }) {
  const cardContainerEl = useRef(null);

  // cards animation
  useEffect(() => {
    if (cardAnimation) {
      cardContainerEl.current.style.cssText = `
        transform: translateY(-5rem);
        opacity: 0;
      `;

      cardContainerEl.current.addEventListener('transitionend', () => {
        cardContainerEl.current.removeAttribute('style');
      });
    }
  }, [cardAnimation, data]);

  const containerAnimation = {
    hidden: {
      opacity: 1,
      x: 0,
    },

    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
        when: 'afterChildren',
      },
    },

    exit: {
      x: '100%',
      transition: {
        duration: 0.6,
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6 } },
    exit: { x: '100%', transition: { duration: 0.3 } },
  };

  return (
    <motion.ul
      className={styles.body}
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      key={data}
      ref={cardContainerEl}>
      {data.map((card, index) => {
        return (
          <motion.li key={index} variants={item}>
            <Card card={card} />
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export default CardContainer;
