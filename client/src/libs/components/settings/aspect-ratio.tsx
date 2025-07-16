import { AutoSelection, Box, InlineStack, Listbox } from "@shopify/polaris";
import { Popover } from "../popover";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import { DEFAULT_ASPECT_RATIO } from "../../constants";

export const AspectRatio: React.FC = () => {
  const { customInstructions, onChangeCustomInstructions } =
    useGenerateImageStore();

  const handleChangeCustomInstructions = (key: string, value: string) => {
    onChangeCustomInstructions({
      ...customInstructions,
      [key]: value,
    });
  };

  return (
    <Popover
      title={customInstructions.aspect_ratio}
      fixed
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="220px">
        <InlineStack gap="200" wrap={false}>
          <Listbox
            accessibilityLabel="aspect ratio 1"
            autoSelection={AutoSelection.None}
            onSelect={(value) =>
              handleChangeCustomInstructions("aspect_ratio", value)
            }
          >
            <InlineStack gap="200" wrap={false}>
              <Box>
                {DEFAULT_ASPECT_RATIO.slice(0, 5).map((model) => (
                  <Listbox.Option
                    key={model.id}
                    value={model.id}
                    disabled={model.exclude?.includes(customInstructions.model)}
                    selected={customInstructions.aspect_ratio === model.name}
                  >
                    {model.name}
                  </Listbox.Option>
                ))}
              </Box>

              <Box>
                {DEFAULT_ASPECT_RATIO.slice(5, 10).map((model) => (
                  <Listbox.Option
                    key={model.id}
                    value={model.id}
                    disabled={model.exclude?.includes(customInstructions.model)}
                    selected={customInstructions.aspect_ratio === model.name}
                  >
                    {model.name}
                  </Listbox.Option>
                ))}
              </Box>
              <Box>
                {DEFAULT_ASPECT_RATIO.slice(10).map((model) => (
                  <Listbox.Option
                    key={model.id}
                    value={model.id}
                    disabled={model.exclude?.includes(customInstructions.model)}
                    selected={customInstructions.aspect_ratio === model.name}
                  >
                    {model.name}
                  </Listbox.Option>
                ))}
              </Box>
            </InlineStack>
          </Listbox>
        </InlineStack>
      </Box>
    </Popover>
  );
};
