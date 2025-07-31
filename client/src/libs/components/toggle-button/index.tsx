import React from "react";
import styles from "./toggle-button.module.css";

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  id = "toggle-switch",
}) => {
  return (
    <>
      <input
        id={id}
        className={styles.switch}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className={styles.label} htmlFor={id}>
        Toggle
      </label>
    </>
  );
};
