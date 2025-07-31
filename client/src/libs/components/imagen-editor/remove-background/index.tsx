import {
  BlockStack,
  Box,
  DropZone,
  InlineStack,
  LegacyStack,
  Text,
} from "@shopify/polaris";
import { useImagenStore } from "../../../../store/imagen.store";

export const RemoveBackground: React.FC = () => {
  const { data, format, onChangeDataValue, setGeneratedImages } =
    useImagenStore();

  const handleDropZoneDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    onChangeDataValue(format, "image", acceptedFiles);
    setGeneratedImages("remove_background", []);
  };

  const validImageTypes = [
    "image/webp",
    "image/jpeg",
    "image/png",
    "image/avif",
  ];

  const fileUpload = data.remove_background.image?.length == 0 && (
    <DropZone.FileUpload />
  );
  const uploadedFiles = data.remove_background.image?.length !== 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {data.remove_background.image && (
          <LegacyStack
            alignment="center"
            key={data.remove_background.image[0].name}
          >
            <img
              src={window.URL.createObjectURL(data.remove_background.image[0])}
              alt={data.remove_background.image[0].name}
              width="60px"
              style={{
                objectFit: "contain",
                maxHeight: "100px",
                borderRadius: "var(--p-border-radius-100)",
              }}
            />
            <div>
              {data.remove_background.image[0].name}{" "}
              <Text variant="bodySm" as="p">
                {data.remove_background.image[0].size} bytes
              </Text>
            </div>
          </LegacyStack>
        )}
      </LegacyStack>
    </div>
  );
  return (
    <BlockStack gap="500">
      <Box>
        <InlineStack gap="150">
          <Text as="h3" variant="headingMd" fontWeight="semibold">
            Remove background
          </Text>
          <Text as="span" tone="subdued" variant="bodyMd">
            Remove background from image
          </Text>
        </InlineStack>
      </Box>
      <Box>
        <Box padding="100">
          <Text as="span" variant="bodyMd">
            Image
          </Text>
        </Box>
        <DropZone
          onDrop={handleDropZoneDrop}
          allowMultiple={false}
          accept={validImageTypes.join(",")}
        >
          {uploadedFiles}
          {fileUpload}
        </DropZone>
      </Box>
    </BlockStack>
  );
};
