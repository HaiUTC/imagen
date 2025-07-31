import { Box, Listbox, Divider, TextField } from "@shopify/polaris";
import { useState } from "react";
import { DEFAULT_STYLE_GEN } from "../../../../constants";
import { Popover } from "../../../popover";
import { useImagenStore } from "../../../../../store/imagen.store";

export const StyleOption: React.FC = () => {
  const { data, format, onChangeDataValue } = useImagenStore();

  const [customStyle, setCustomStyle] = useState<boolean>(false);
  const [customStyleValue, setCustomStyleValue] = useState<string>("");

  const onChangeCustomStyle = (value: string) => {
    setCustomStyleValue(value);
    onChangeDataValue(format, "style", value);
  };

  const onSubmitCustomStyle = () => {
    if (customStyleValue) {
      onChangeDataValue(format, "style", customStyleValue);
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
          onSelect={(value) => onChangeDataValue(format, "style", value)}
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
