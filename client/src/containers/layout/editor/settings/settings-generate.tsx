import { Box, InlineStack } from "@shopify/polaris";
import { AspectRatio } from "./aspect-ratio";

export const SettingsGenerate: React.FC = () => {
  return (
    <Box>
      <InlineStack align="space-between" blockAlign="center">
        <Box width="200px">
          <InlineStack>
            {/* <Box paddingInline="150">
              <NumberOutput />
            </Box> */}
            {/* <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box> */}
            <Box paddingInline="150">
              <AspectRatio />
            </Box>
            {/* <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box>
            <Box paddingInline="150">
              <StyleOption />
            </Box> */}
          </InlineStack>
        </Box>
      </InlineStack>
    </Box>
  );
};
