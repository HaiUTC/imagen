import { AutoSelection, Box, InlineStack, Listbox } from "@shopify/polaris";
import { Popover } from "../../../popover";
import { DEFAULT_RESOLUTION } from "../../../../constants";
import { useImagenStore } from "../../../../../store/imagen.store";

export const Resolution: React.FC = () => {
  const { data, format, onChangeDataValue } = useImagenStore();

  return (
    <Popover
      title={data.reframe.resolution}
      fixed
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="280px">
        <Listbox
          accessibilityLabel="aspect ratio 1"
          autoSelection={AutoSelection.None}
          onSelect={(value) => onChangeDataValue(format, "resolution", value)}
        >
          <InlineStack wrap={false}>
            <Box>
              {DEFAULT_RESOLUTION.slice(0, 7).map((model) => (
                <Listbox.Option
                  key={model.id}
                  value={model.id}
                  selected={data.reframe.resolution === model.name}
                >
                  {model.name}
                </Listbox.Option>
              ))}
            </Box>
            <Box>
              {DEFAULT_RESOLUTION.slice(7).map((model) => (
                <Listbox.Option
                  key={model.id}
                  value={model.id}
                  selected={data.reframe.resolution === model.name}
                >
                  {model.name}
                </Listbox.Option>
              ))}
            </Box>
          </InlineStack>
        </Listbox>
      </Box>
    </Popover>
  );
};
