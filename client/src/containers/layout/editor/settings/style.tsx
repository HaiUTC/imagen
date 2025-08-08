import { Box, Listbox, Divider, TextField } from "@shopify/polaris";
import { useState } from "react";

import { useImagenStore } from "../../../../store/imagen.store";
import { Popover } from "../../../../libs/components/popover";
import { DEFAULT_STYLE_GEN } from "../../../../libs/constants";

export const StyleOption: React.FC = () => {
  const { data, onChangeDataValue } = useImagenStore();

  const [customStyle, setCustomStyle] = useState<boolean>(false);
  const [customStyleValue, setCustomStyleValue] = useState<string>("");

  const onChangeCustomStyle = (value: string) => {
    setCustomStyleValue(value);
    onChangeDataValue("generate", "style", value);
  };

  const onSubmitCustomStyle = () => {
    if (customStyleValue) {
      onChangeDataValue("generate", "style", customStyleValue);
      setCustomStyle(true);
    }
  };

  return (
    <Popover
      title={
        DEFAULT_STYLE_GEN.find((model) => model.id === data.generate.style)
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
          onSelect={(value) => onChangeDataValue("generate", "style", value)}
        >
          {DEFAULT_STYLE_GEN.map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
              selected={data.generate.style === model.name}
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
