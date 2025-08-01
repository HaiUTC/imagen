import { Box, Spinner } from "@shopify/polaris";
import { imagenSubmitFlow } from "../../../flow/imagen.submit.flow";
import { useImagenStore } from "../../../store/imagen.store";
import { GenerateImageEditor } from "./generate";
import styles from "./imagen-editor.module.css";

export interface ImagenEditorProps {
  type: string;
}

export const ImagenEditor: React.FC<ImagenEditorProps> = ({ type }) => {
  const { loadingGenerate } = useImagenStore();
  return (
    <Box padding="300">
      <div className={styles.generate_container}>
        <div className={styles.generate}>
          {type === "generate" && <GenerateImageEditor />}
          {type === "generate_v2" && <GenerateImageEditor />}
          <button
            className={styles.submit}
            disabled={loadingGenerate}
            onClick={imagenSubmitFlow}
          >
            {loadingGenerate ? <Spinner size="small" /> : <span>Generate</span>}
          </button>
        </div>
      </div>
    </Box>
  );
};
