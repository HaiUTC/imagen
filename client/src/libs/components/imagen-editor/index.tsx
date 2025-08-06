import { Box, Spinner } from "@shopify/polaris";
import { imagenSubmitFlow } from "../../../flow/imagen/imagen.submit.flow";
import { useImagenStore } from "../../../store/imagen.store";
import { GenerateImageEditor } from "./generate";
import styles from "./imagen-editor.module.css";

export interface ImagenEditorProps {
  type: string;
}

export const ImagenEditor: React.FC<ImagenEditorProps> = ({ type }) => {
  const { loadingGenerate, data, format, setErrors, setIsDownloaded } =
    useImagenStore();

  const handleSubmit = () => {
    if (data[format].prompt) {
      imagenSubmitFlow();
      setErrors({});
      setIsDownloaded(false);
    } else {
      setErrors({
        prompt: "Prompt is required",
      });
      return;
    }
  };
  return (
    <Box padding="300">
      <div className={styles.generate_container}>
        <div className={styles.generate}>
          {type === "generate" && <GenerateImageEditor />}
          <button
            className={styles.submit}
            disabled={loadingGenerate}
            onClick={handleSubmit}
          >
            {loadingGenerate ? <Spinner size="small" /> : <span>Generate</span>}
          </button>
        </div>
      </div>
    </Box>
  );
};
