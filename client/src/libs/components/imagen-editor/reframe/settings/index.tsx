import { Box, InlineStack } from "@shopify/polaris";
import { NumberOutput } from "./number-output";
import { Resolution } from "./resolution";

export const SettingsReframe: React.FC = () => {
  return (
    <Box paddingBlockStart="300">
      <InlineStack align="space-between" blockAlign="center" wrap={false}>
        <Box width="100%">
          <InlineStack wrap={false}>
            <Box paddingInline="150" width="100%">
              <NumberOutput />
            </Box>
            <Box
              borderInlineStartWidth="025"
              borderColor="border-hover"
              minHeight="20px"
            ></Box>
            <Box paddingInline="150" width="100%">
              <Resolution />
            </Box>
          </InlineStack>
        </Box>
      </InlineStack>
    </Box>
  );
};
