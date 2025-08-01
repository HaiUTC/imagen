import {
  BlockStack,
  Box,
  DropZone,
  InlineStack,
  LegacyStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { SettingsGenerate } from "./settings/settings-generate";
import { useImagenStore } from "../../../../store/imagen.store";

export const GenerateImageEditor: React.FC = () => {
  const { data, format, onChangeDataValue, setGeneratedImages } =
    useImagenStore();

  const handleDropZoneDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    onChangeDataValue(format, "image", acceptedFiles);
    setGeneratedImages(format, []);
  };

  const validImageTypes = [
    "image/webp",
    "image/jpeg",
    "image/png",
    "image/avif",
  ];

  const fileUpload = <DropZone.FileUpload />;
  const uploadedFiles = data[format].image?.length !== 0 && (
    <Box paddingBlockStart="200">
      <InlineStack gap="200">
        {data[format].image?.map((image) => (
          <LegacyStack key={image.name} alignment="center">
            <img
              src={window.URL.createObjectURL(image)}
              alt={image.name}
              width="50px"
              style={{
                objectFit: "contain",
                maxHeight: "66.67px",
                borderRadius: "var(--p-border-radius-100)",
              }}
            />
            <div>
              {image.name}{" "}
              <Text variant="bodySm" as="p">
                {image.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </InlineStack>
    </Box>
  );

  return (
    <BlockStack gap="500">
      <Box>
        <InlineStack gap="150">
          <Text as="h3" variant="headingMd" fontWeight="semibold">
            Text to Image
          </Text>
          <Text as="span" tone="subdued" variant="bodyMd">
            {/* Generate images from text and image reference */}
            {format === "generate"
              ? "Gen ảnh không giống ảnh reference nhưng thực tế hơn và thời gian gen nhanh hơn"
              : "Gen ảnh không giống ảnh reference nhưng thực tế hơn và thời gian gen nhanh hơn"}
          </Text>
        </InlineStack>
      </Box>

      <Box>
        <TextField
          label="Prompt"
          requiredIndicator={true}
          multiline={5}
          name="prompt"
          autoComplete="off"
          value={data[format].prompt}
          placeholder="Please describe your creative ideas for the image"
          onChange={(value) => onChangeDataValue(format, "prompt", value)}
        />
        <SettingsGenerate />
      </Box>

      <Box>
        <Box padding="100">
          <Text as="span" variant="bodyMd">
            Image reference
          </Text>
        </Box>
        <DropZone
          onDrop={handleDropZoneDrop}
          allowMultiple={true}
          accept={validImageTypes.join(",")}
        >
          {fileUpload}
        </DropZone>
        {uploadedFiles}
      </Box>
    </BlockStack>
  );
};
