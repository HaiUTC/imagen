import { Box, Listbox } from "@shopify/polaris";
import { Popover } from "../popover";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import { DEFAULT_NUMBER_RESULT } from "../../constants";

export const NumberOutput: React.FC = () => {
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
      title={`${customInstructions.number_output} output${
        customInstructions.number_output === "1" ? "" : "s"
      }`}
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="180px">
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) =>
            handleChangeCustomInstructions("number_output", value)
          }
        >
          {DEFAULT_NUMBER_RESULT.map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
              disabled={model.exclude?.includes(customInstructions.model)}
              selected={customInstructions.model === model.name}
            >
              {model.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
