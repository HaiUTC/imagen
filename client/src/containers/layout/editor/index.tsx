import { Box, Spinner } from "@shopify/polaris";
import { useImagenStore } from "../../../store/imagen.store";
import styles from "./editor.module.css";

export interface ImagenEditorProps {
  children: React.ReactNode;
  onSubmit: () => Promise<void>;
}

export const ImagenEditor: React.FC<ImagenEditorProps> = ({
  children,
  onSubmit,
}) => {
  const { loadingGenerate, format } = useImagenStore();

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Box padding="300">
      <div className={styles.generate_container}>
        <div className={styles.generate}>
          {children}
          <button
            className={styles.submit}
            disabled={loadingGenerate}
            onClick={handleSubmit}
          >
            {loadingGenerate ? (
              <Spinner size="small" />
            ) : (
              <span>{format === "edit" ? "Edit" : "Generate"}</span>
            )}
          </button>
        </div>
      </div>
    </Box>
  );
};
