import { useRef } from "react";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import styles from "./collections-image-preview.module.css";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsImagePreviewProps {
  data: CollectionsData;
  imagePreview: string;
  onBackClick: () => void;
}

export const CollectionsImagePreview: React.FC<
  CollectionsImagePreviewProps
> = ({ onBackClick, imagePreview }) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.image_preview_container}>
      {/* Back button */}
      <button className={styles.back_button} onClick={onBackClick}>
        {svgIcon(ICONS.ARROW_LEFT)}
      </button>

      {/* Main image display */}
      <div ref={imageContainerRef} className={styles.main_image_container}>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Selected image"
            className={styles.main_image}
          />
        ) : (
          <div className={styles.empty_image}>
            <p>No image selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
