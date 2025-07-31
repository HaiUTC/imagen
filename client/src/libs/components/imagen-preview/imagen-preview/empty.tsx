import { useImagenStore } from "../../../../store/imagen.store";
import styles from "./imagen-preview.module.css";

export const EmptyImagePreview: React.FC = () => {
  const { format, onChangeDataValue } = useImagenStore();

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      onChangeDataValue(format, "image", Array.from(files));
    }
  };
  return (
    <label className={styles.empty_image_preview}>
      <img src="/favicon.png" alt="empty-image" />
      <h4>Click or drag and drop an image to generate</h4>
      <span>Support image formats: PNG, JPEG, WEBP, AVIF</span>
      <input
        type="file"
        accept=".jpg,.png,.webp,.avif"
        onChange={handleUploadImage}
      />
    </label>
  );
};
