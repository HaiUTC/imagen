import { AppProvider, Box, InlineStack, Page, Tabs } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { useState } from "react";
import { useGenerateImageStore } from "../store/generate-image.store";
import { PromptOnly } from "../libs/components/prompt-only";
import { PromptImageReference } from "../libs/components/image-reference";

export default function AppImage() {
  const [tab, setTab] = useState<number>(0);

  const { customInstructions, onChangeCustomInstructions } =
    useGenerateImageStore.getState();

  const handleSelectTab = (tab: number) => {
    setTab(tab);
    if (tab === 1) {
      onChangeCustomInstructions({
        ...customInstructions,
        model: "pro",
      });
    }
  };

  return (
    <AppProvider i18n={polarisTranslations}>
      <Page fullWidth>
        <InlineStack align="center">
          <Box width="70%">
            <Tabs
              tabs={[
                { id: "text_to_image", content: "Text to Image" },
                {
                  id: "image_reference",
                  content: "Image reference",
                },
              ]}
              fitted
              selected={tab}
              onSelect={handleSelectTab}
            />
            <Box paddingBlock="300">
              {tab === 0 && <PromptOnly onChangeTab={handleSelectTab} />}
              {tab === 1 && (
                <PromptImageReference onChangeTab={handleSelectTab} />
              )}
            </Box>
          </Box>
        </InlineStack>
      </Page>
    </AppProvider>
  );
}
