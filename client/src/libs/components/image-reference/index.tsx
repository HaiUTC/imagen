import { Box, Divider, DropZone, TextField } from "@shopify/polaris";
import { ModalPreview, type ModalPreviewAction } from "../modal-preview";
import { SkeletonImageGenerated } from "../skeleton";
import { urlToFile } from "../../utils/url-2-file";
import styles from "../prompt-only/prompt-only.module.css";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import { SettingsGenerate } from "../imagen-editor/generate/settings/settings-generate";

export interface PromptImageReferenceProps {
  onChangeTab: (tab: number) => void;
}

export const PromptImageReference: React.FC<PromptImageReferenceProps> = ({
  onChangeTab,
}) => {
  const {
    userPrompt,
    customInstructions,
    loadingGenerateImage,
    imageGeneratedUrl,
    onChangeUserPrompt,
    onChangeCustomInstructions,
  } = useGenerateImageStore();

  const handleDropImage = (_: any, files: File[]) => {
    onChangeCustomInstructions({
      ...customInstructions,
      reference_image: files[0],
    });
  };

  const handleImproveImageGenerated = async (
    selectedImageId: number | null,
    onClosePreview: () => void
  ) => {
    onChangeTab(1);
    const image = imageGeneratedUrl.find((img) => img.id === selectedImageId);
    if (!image) return;
    onChangeCustomInstructions({
      ...customInstructions,
      reference_image: await urlToFile(image.url, image.id.toString()),
      model: "pro",
    });
    onClosePreview();
  };

  const actions: ModalPreviewAction[] = [
    {
      label: "Choose",
      status: "primary",
      onAction: () => {
        console.log("Choose");
      },
    },
    {
      label: "Improve",
      status: "default",
      onAction: handleImproveImageGenerated,
    },
  ];

  return (
    <Box paddingBlockEnd="200">
      <div className={styles.promptInput}>
        <TextField
          // label={
          //   <InlineStack align="space-between" blockAlign="center">
          //     <Box paddingInlineStart="200">
          //       <Text as="span">Prompt (Required)</Text>
          //     </Box>
          //     <Box paddingInlineEnd="200">
          //       <CustomInstruction customInstructions={customInstructions} setCustomInstructions={onChangeCustomInstructions} />
          //     </Box>
          //   </InlineStack>
          // }
          label="Prompt"
          requiredIndicator={true}
          multiline={5}
          name="prompt"
          autoComplete="off"
          value={userPrompt}
          placeholder="Please describe your creative ideas for the image"
          onChange={onChangeUserPrompt}
        />
        <Box
          position="absolute"
          insetBlockEnd="100"
          insetInlineEnd="200"
          zIndex="999"
          width="30px"
          minHeight="30px"
        >
          <div className={styles.upload}>
            <DropZone
              type="image"
              onDrop={handleDropImage}
              allowMultiple={false}
              accept="image/jpeg, image/png, image/webp"
            >
              <DropZone.FileUpload />
            </DropZone>
          </div>
        </Box>
      </div>
      <SettingsGenerate />
      <Divider borderWidth="025" />
      <Box paddingBlockStart="300">
        {loadingGenerateImage ? (
          <SkeletonImageGenerated
            n={Number(customInstructions.number_output) || 1}
          />
        ) : (
          <ModalPreview images={imageGeneratedUrl} actions={actions} />
        )}
      </Box>
    </Box>
  );
};
