import { TextField, Box, Divider, InlineError } from "@shopify/polaris";
import { urlToFile } from "../../utils/url-2-file";
import { SettingsGenerate } from "../imagen-editor/generate/settings/settings-generate";
import { SkeletonImageGenerated } from "../skeleton";
import styles from "./prompt-only.module.css";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import { type ModalPreviewAction, ModalPreview } from "../modal-preview";
import { Fragment } from "react/jsx-runtime";

export interface PromptOnlyProps {
  onChangeTab: (tab: number) => void;
}

export const PromptOnly: React.FC<PromptOnlyProps> = ({ onChangeTab }) => {
  const {
    userPrompt,
    customInstructions,
    imageGeneratedUrl,
    loadingGenerateImage,
    errorGenerateImage,
    onChangeUserPrompt,
    onChangeCustomInstructions,
  } = useGenerateImageStore();

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
          label="Prompt"
          requiredIndicator={true}
          multiline={5}
          name="prompt"
          autoComplete="off"
          value={userPrompt}
          placeholder="Please describe your creative ideas for the image"
          onChange={onChangeUserPrompt}
        />
        <SettingsGenerate />
      </div>
      <Divider borderWidth="025" />
      <Box paddingBlockStart="300">
        {errorGenerateImage ? (
          <Box paddingBlockStart="300">
            <InlineError
              message={errorGenerateImage}
              fieldID="error_generate_image"
            />
          </Box>
        ) : (
          <Fragment>
            {loadingGenerateImage ? (
              <SkeletonImageGenerated
                n={Number(customInstructions.number_output) || 1}
              />
            ) : (
              <ModalPreview images={imageGeneratedUrl} actions={actions} />
            )}
          </Fragment>
        )}
      </Box>
    </Box>
  );
};
