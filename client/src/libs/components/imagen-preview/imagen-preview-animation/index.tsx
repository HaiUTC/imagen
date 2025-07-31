import styles from "./imagen-preview-animation.module.css";

export const ImagenPreviewAnimation: React.FC = () => {
  return (
    <div className={styles.container}>
      <video
        src="/loading.webm"
        autoPlay
        loop
        muted
        className={styles.flying_icon}
      />
      <span className={styles.flying_icon_text}>Generating</span>
    </div>
  );
};
