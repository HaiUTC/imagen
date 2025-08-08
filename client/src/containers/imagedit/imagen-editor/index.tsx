import {
  BlockStack,
  Box,
  DropZone,
  InlineError,
  InlineStack,
  LegacyStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { useImagenStore } from "../../../store/imagen.store";

export const ImagenEditEditor: React.FC = () => {
  const { data, errors, onChangeDataValue, setGeneratedImages, setErrors } =
    useImagenStore();

  const handleDropZoneDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    onChangeDataValue("edit", "image", acceptedFiles);
    setErrors({ ...errors, image: "" });
    setGeneratedImages("edit", {
      images: [],
      id: "",
      taskId: "",
    });
  };

  const validImageTypes = [
    "image/webp",
    "image/jpeg",
    "image/png",
    "image/avif",
  ];

  const fileUpload = (
    <DropZone.FileUpload
      actionHint="Accepts .webp, .jpeg, .png and .avif"
      actionTitle="Upload"
    />
  );
  const uploadedFiles = data.edit.image?.length !== 0 && (
    <Box paddingBlockStart="200">
      <InlineStack gap="200">
        {data.edit.image?.map((image) => (
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
            Edit Image
          </Text>
          <Text as="span" tone="subdued" variant="bodyMd">
            Edit image with text instructions and image reference
          </Text>
        </InlineStack>
      </Box>

      <Box>
        <TextField
          label="Edit instructions"
          requiredIndicator={true}
          multiline={5}
          name="prompt"
          autoComplete="off"
          value={data.edit.prompt}
          error={errors.prompt}
          placeholder="Please describe your edit instructions for the image"
          onChange={(value) => {
            setErrors({ ...errors, prompt: "" });
            onChangeDataValue("edit", "prompt", value);
          }}
        />
      </Box>

      <Box>
        <Box padding="100">
          <Text as="span" variant="bodyMd">
            Image to edit
          </Text>
        </Box>
        <DropZone
          onDrop={handleDropZoneDrop}
          allowMultiple={false}
          error={true}
          accept={validImageTypes.join(",")}
        >
          {fileUpload}
        </DropZone>
        {uploadedFiles}
        {errors.image && (
          <Box paddingBlock="100">
            <InlineError message={errors.image} fieldID="myFieldID" />
          </Box>
        )}
      </Box>
    </BlockStack>
  );
};
