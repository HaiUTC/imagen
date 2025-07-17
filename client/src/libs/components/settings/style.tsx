import { Box, Listbox, Divider, TextField } from "@shopify/polaris";
import { useState } from "react";
import { DEFAULT_STYLE_GEN } from "../../constants";
import { Popover } from "../popover";
import { useGenerateImageStore } from "../../../store/generate-image.store";

export const StyleOption: React.FC = () => {
  const { customInstructions, onChangeCustomInstructions } =
    useGenerateImageStore();

  const [customStyle, setCustomStyle] = useState<boolean>(false);
  const [customStyleValue, setCustomStyleValue] = useState<string>("");

  const handleChangeCustomInstructions = (
    key: string,
    value: string,
    isCustom: boolean = false
  ) => {
    onChangeCustomInstructions({
      ...customInstructions,
      [key]: value,
    });
    if (!isCustom) {
      setCustomStyle(false);
    }
  };

  const onChangeCustomStyle = (value: string) => {
    setCustomStyleValue(value);
    handleChangeCustomInstructions("style", value, true);
  };

  const onSubmitCustomStyle = () => {
    if (customStyleValue) {
      handleChangeCustomInstructions("style", customStyleValue);
      setCustomStyle(true);
    }
  };

  return (
    <Popover
      title={
        DEFAULT_STYLE_GEN.find((model) => model.id === customInstructions.style)
          ?.name ||
        customStyleValue ||
        "Realistic"
      }
      sectioned={false}
      button={{ variant: "tertiary" }}
    >
      <Box
        paddingBlock="300"
        paddingInline="100"
        width="200px"
        minHeight="200px"
      >
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) => handleChangeCustomInstructions("style", value)}
        >
          {DEFAULT_STYLE_GEN.map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
              selected={customInstructions.model === model.name}
            >
              {model.name}
            </Listbox.Option>
          ))}
          <Box paddingBlock="200">
            <Divider />
          </Box>
          <Box
            paddingInline="200"
            paddingBlockEnd="200"
            paddingBlockStart="100"
          >
            <TextField
              label="Custom"
              placeholder="e.g. 3D, Digital art, ..."
              value={customStyleValue}
              onFocus={onSubmitCustomStyle}
              onBlur={() => setCustomStyle(false)}
              focused={customStyle}
              onChange={onChangeCustomStyle}
              autoComplete="off"
            />
          </Box>
        </Listbox>
      </Box>
    </Popover>
  );
};
