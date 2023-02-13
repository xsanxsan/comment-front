import React = require('react');
import styles from './styled-button.module.css';

interface Props {
  label: string;
  onClick?: ([...args]: any) => void;
  isCancelButton?: boolean;
}

export default function StyledButton(props: Props) {
  return (
    <button
      className={
        props.isCancelButton
          ? styles.styledButton + ' ' + styles.isCancelButton
          : styles.styledButton + ' ' + styles.primaryButton
      }
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
