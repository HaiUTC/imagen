import { Box } from "@shopify/polaris";
import { ImageGenPreview } from "./imagen-preview";
import { ImageGenPreviewActions } from "./imagen-preview-actions";
import { useImagenStore } from "../../../store/imagen.store";

export const ImageGenPreviewContainer: React.FC = () => {
  const { data, loadingGenerate, format, generatedImages } = useImagenStore();

  return (
    <Box
      background="bg-surface-secondary"
      paddingBlockStart="600"
      paddingInline="800"
      paddingBlockEnd="300"
    >
      <ImageGenPreviewActions />
      <Box position="relative">
        <ImageGenPreview
          images={
            generatedImages[format].length
              ? generatedImages[format]
              : data[format].image?.map(window.URL.createObjectURL)
          }
          loading={loadingGenerate}
        />
      </Box>
    </Box>
  );
};
