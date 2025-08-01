import { AutoSelection, Box, Listbox } from "@shopify/polaris";
import { Popover } from "../../../popover";
import { DEFAULT_ASPECT_RATIO } from "../../../../constants";
import { useImagenStore } from "../../../../../store/imagen.store";

export const AspectRatio: React.FC = () => {
  const { data, format, onChangeDataValue } = useImagenStore();

  return (
    <Popover
      title={data[format].aspect_ratio}
      fixed
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="220px">
        <Listbox
          accessibilityLabel="aspect ratio 1"
          autoSelection={AutoSelection.None}
          onSelect={(value) => onChangeDataValue(format, "aspect_ratio", value)}
        >
          {DEFAULT_ASPECT_RATIO.map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
              selected={data[format].aspect_ratio === model.name}
            >
              {model.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
