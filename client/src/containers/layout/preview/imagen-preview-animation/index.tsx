import { useState, useEffect } from "react";
import styles from "./imagen-preview-animation.module.css";

interface ImagenPreviewAnimationProps {
  step?: "analytic_request" | "magic_processing" | "generate_image";
  autoStep?: boolean;
}

export const ImagenPreviewAnimation: React.FC<ImagenPreviewAnimationProps> = ({
  step,
  autoStep = false,
}) => {
  const steps: Array<
    "analytic_request" | "magic_processing" | "generate_image"
  > = ["analytic_request", "magic_processing", "generate_image"];

  const [currentStep, setCurrentStep] = useState<
    "analytic_request" | "magic_processing" | "generate_image"
  >(step || steps[0]);

  useEffect(() => {
    if (autoStep) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const currentIndex = steps.indexOf(prev);
          const nextIndex = (currentIndex + 1) % steps.length;
          return steps[nextIndex];
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoStep]);

  useEffect(() => {
    if (step) {
      setCurrentStep(step);
    }
  }, [step]);

  const containerClass = `${styles.container} ${styles[`step_${currentStep}`]}`;

  return (
    <div className={containerClass} key={currentStep}>
      <video
        src="/loading.webm"
        autoPlay
        loop
        muted
        className={styles.flying_icon}
      />
      {currentStep === "analytic_request" && (
        <span className={`${styles.flying_icon_text} ${styles.text_analytic}`}>
          Analytic request
        </span>
      )}
      {currentStep === "magic_processing" && (
        <span className={`${styles.flying_icon_text} ${styles.text_magic}`}>
          Magic processing
        </span>
      )}
      {currentStep === "generate_image" && (
        <span className={`${styles.flying_icon_text} ${styles.text_generate}`}>
          Generating image 0%
        </span>
      )}
    </div>
  );
};
