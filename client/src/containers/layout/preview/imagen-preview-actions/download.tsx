import styles from "./imagen-preview-actions.module.css";
import { imagenDownloadFlow } from "../../../../flow/imagen/imagen.dowload.flow";
import { useImagenStore } from "../../../../store/imagen.store";
import { svgIcon, ICONS } from "../../../../libs/constants/icons";
import { Spinner } from "@shopify/polaris";

export const ImageGenPreviewDownload: React.FC = () => {
  const { loadingDownload, taskIdGenerated, generatedImages, format } =
    useImagenStore();

  const handleDownload = () => {
    if (format != null && !generatedImages[format]?.images.length) {
      return;
    }

    imagenDownloadFlow(taskIdGenerated);
  };

  return (
    <button className={styles.button} onClick={handleDownload}>
      {loadingDownload ? <Spinner size="small" /> : svgIcon(ICONS.DOWNLOAD)}
      <span>Download</span>
    </button>
  );
};
