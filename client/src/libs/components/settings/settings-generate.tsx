import { Box, Button, InlineStack } from "@shopify/polaris";

import { ImageReferencePreview } from "../image-reference/image-reference-preview";
import { AspectRatio } from "./aspect-ratio";
import { ModelOption } from "./model";
import { NumberOutput } from "./number-output";
import { StyleOption } from "./style";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import { generateImageFlow } from "../../../flow/generate-image.flow";

interface SettingsGenerateProps {
  isReferenceImage?: boolean;
}

export const SettingsGenerate: React.FC<SettingsGenerateProps> = ({
  isReferenceImage,
}) => {
  const { userPrompt, customInstructions, loadingGenerateImage } =
    useGenerateImageStore();

  const handleSubmitGenerateImage = async () => {
    await generateImageFlow({ prompt: userPrompt, customInstructions });
  };

  return (
    <Box paddingBlock="300">
      <InlineStack align="space-between" blockAlign="center">
        <Box>
          <InlineStack>
            <Box paddingInlineEnd="150">
              <ModelOption isReferenceImage={isReferenceImage} />
            </Box>
            <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box>
            <Box paddingInline="150">
              <NumberOutput />
            </Box>
            <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box>
            <Box paddingInline="150">
              <AspectRatio />
            </Box>
            <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box>
            <Box paddingInline="150">
              <StyleOption />
            </Box>
          </InlineStack>
        </Box>
        <Box>
          <InlineStack wrap={false} gap="200">
            {isReferenceImage && <ImageReferencePreview />}
            <Button
              onClick={handleSubmitGenerateImage}
              loading={loadingGenerateImage}
            >
              Generate
            </Button>
          </InlineStack>
        </Box>
      </InlineStack>
    </Box>
  );
};
