import styles from "./imagen-preview-animation.module.css";
import type { StreamingStep } from "../../../../store/imagen.store";

interface ImagenPreviewAnimationProps {
  step?: StreamingStep;
  progress?: number;
}

export const ImagenPreviewAnimation: React.FC<ImagenPreviewAnimationProps> = ({
  step,
  progress,
}) => {
  const containerClass = `${styles.container} ${styles[`step_${step}`]}`;

  return (
    <div className={containerClass} key={step}>
      <video
        src="/loading.webm"
        autoPlay
        loop
        muted
        className={styles.flying_icon}
      />
      {step === "analytic_request" && (
        <span className={`${styles.flying_icon_text} ${styles.text_analytic}`}>
          Analytic request
        </span>
      )}
      {step === "magic_processing" && (
        <span className={`${styles.flying_icon_text} ${styles.text_magic}`}>
          Magic processing
        </span>
      )}
      {step === "generate_image" && (
        <span className={`${styles.flying_icon_text} ${styles.text_generate}`}>
          {progress ? `Completed ${progress}%` : "Generating image"}
        </span>
      )}
    </div>
  );
};
