import { AutoSelection, Box, Listbox } from "@shopify/polaris";
import { Popover } from "../../../../libs/components/popover";
import { useImagenStore } from "../../../../store/imagen.store";
import { DEFAULT_ASPECT_RATIO } from "../../../../libs/constants";

export const AspectRatio: React.FC = () => {
  const { data, onChangeDataValue } = useImagenStore();

  return (
    <Popover
      title={data.generate.aspect_ratio}
      fixed
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="220px">
        <Listbox
          accessibilityLabel="aspect ratio 1"
          autoSelection={AutoSelection.None}
          onSelect={(value) =>
            onChangeDataValue("generate", "aspect_ratio", value)
          }
        >
          {DEFAULT_ASPECT_RATIO.map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
              selected={data.generate.aspect_ratio === model.name}
            >
              {model.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
