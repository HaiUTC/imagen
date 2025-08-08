import { useState } from "react";
import styles from "./collections-image-preview.module.css";
import { ICONS, svgIcon } from "../../../libs/constants/icons";

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
  onBackClick: () => void;
}

export const CollectionsImagePreview: React.FC<
  CollectionsImagePreviewProps
> = ({ data, onBackClick }) => {
  const [selectedImage] = useState<string>(
    data.imagens[0] || data.referenceImage[0] || ""
  );

  // const handleImageClick = (imageUrl: string) => {
  //   setSelectedImage(imageUrl);
  // };

  // const allImages = [...data.imagens, ...data.referenceImage];

  return (
    <div className={styles.image_preview_container}>
      {/* Back button */}
      <button className={styles.back_button} onClick={onBackClick}>
        {svgIcon(ICONS.ARROW_LEFT)}
      </button>

      {/* Main image display */}
      <div className={styles.main_image_container}>
        {selectedImage ? (
          <img
            src={selectedImage}
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
