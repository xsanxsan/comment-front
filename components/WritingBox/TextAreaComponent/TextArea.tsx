import React = require('react');
import styles from './text-area.module.css';

interface Props {
  onChange: (e: string) => void;
  initialText?: string;
}
export default function TextArea(props: Props) {
  const [value, setValue] = React.useState(props.initialText ?? '');

  React.useEffect(() => {
    setValue(props.initialText);
  }, [props.initialText]);

  return (
    <textarea
      className={styles.textArea}
      onChange={(e) => {
        setValue(e.target.value);
        props.onChange(e.target.value);
      }}
      value={value}
      placeholder="Add a comment..."
    />
  );
}
