import { Box } from "@shopify/polaris";
import { ModalPreview } from "../modal-preview";
import { useGenerateImageStore } from "../../../store/generate-image.store";

export const ImageReferencePreview: React.FC = () => {
  const { customInstructions, onChangeCustomInstructions } =
    useGenerateImageStore();

  if (!customInstructions.reference_image) return null;

  const handleRemoveReferenceImage = () => {
    onChangeCustomInstructions({
      ...customInstructions,
      reference_image: null,
    });
  };

  return (
    <Box position="relative" width="60px" minHeight="40px">
      <ModalPreview
        columns={1}
        images={[
          {
            id: 1,
            url: window.URL.createObjectURL(
              customInstructions.reference_image!
            ),
          },
        ]}
        imageStyles={{ maxWidth: "60px", maxHeight: "40px" }}
        actions={[
          {
            label: "Remove",
            status: "danger",
            onAction: handleRemoveReferenceImage,
          },
        ]}
      />
    </Box>
  );
};
