import {
  BlockStack,
  Box,
  Button,
  DropZone,
  InlineStack,
  LegacyStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { SettingsGenerate } from "../../layout/editor/settings/settings-generate";
import { useImagenStore } from "../../../store/imagen.store";

export const GenerateImageEditor: React.FC = () => {
  const { data, errors, onChangeDataValue, setGeneratedImages } =
    useImagenStore();

  const handleDropZoneDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    const validFile = acceptedFiles.filter(
      (file) => !data.generate.image?.find((image) => image.name === file.name)
    );
    onChangeDataValue("generate", "image", [
      ...(data.generate.image || []),
      ...validFile,
    ]);
    setGeneratedImages("generate", {
      images: [],
      id: "",
      taskId: "",
    });
  };

  const handleRemoveImage = (image: File) => {
    onChangeDataValue("generate", "image", [
      ...(data.generate.image?.filter((file) => file.name !== image.name) ||
        []),
    ]);
  };

  const handlePerspectiveDropZoneDrop = (
    _dropFiles: File[],
    acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    if (acceptedFiles.length > 0) {
      onChangeDataValue("generate", "perspective", acceptedFiles[0]);
      setGeneratedImages("generate", {
        images: [],
        id: "",
        taskId: "",
      });
    }
  };

  const handleRemovePerspective = () => {
    onChangeDataValue("generate", "perspective", undefined);
  };

  const validImageTypes = [
    "image/webp",
    "image/jpeg",
    "image/png",
    "image/avif",
  ];

  const fileUpload = (
    <DropZone.FileUpload actionHint="Accepts .webp, .jpeg, .png and .avif" />
  );

  const perspectiveFileUpload = (
    <DropZone.FileUpload actionHint="Accepts single .webp, .jpeg, .png and .avif file" />
  );

  const uploadedFiles = data.generate.image?.length !== 0 && (
    <Box paddingBlockStart="200">
      <InlineStack gap="200">
        {data.generate.image?.map((image) => (
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
              <Text as="p"> {image.name}</Text>
              <Button
                variant="plain"
                tone="critical"
                onClick={() => handleRemoveImage(image)}
              >
                Remove
              </Button>
            </div>
          </LegacyStack>
        ))}
      </InlineStack>
    </Box>
  );

  const uploadedPerspective = data.generate.perspective && (
    <Box paddingBlockStart="200">
      <LegacyStack alignment="center">
        <img
          src={window.URL.createObjectURL(data.generate.perspective)}
          alt={data.generate.perspective.name}
          width="50px"
          style={{
            objectFit: "contain",
            maxHeight: "66.67px",
            borderRadius: "var(--p-border-radius-100)",
          }}
        />
        <div>
          <Text as="p"> {data.generate.perspective.name}</Text>
          <Button
            variant="plain"
            tone="critical"
            onClick={handleRemovePerspective}
          >
            Remove
          </Button>
        </div>
      </LegacyStack>
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
            Generate images from text and image reference
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
          value={data.generate.prompt}
          error={errors.prompt}
          placeholder="Please describe your creative ideas for the image"
          onChange={(value) => onChangeDataValue("generate", "prompt", value)}
        />
        <Box paddingBlockStart="300">
          <SettingsGenerate />
        </Box>
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

      <Box>
        <Box padding="100">
          <Text as="span" variant="bodyMd">
            Reference perspective
          </Text>
        </Box>
        <DropZone
          onDrop={handlePerspectiveDropZoneDrop}
          allowMultiple={false}
          accept={validImageTypes.join(",")}
        >
          {perspectiveFileUpload}
        </DropZone>
        {uploadedPerspective}
      </Box>
    </BlockStack>
  );
};
