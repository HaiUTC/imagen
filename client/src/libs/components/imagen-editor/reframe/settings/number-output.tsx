import { Box, Listbox } from "@shopify/polaris";
import { Popover } from "../../../popover";
import { useImagenStore } from "../../../../../store/imagen.store";
import { DEFAULT_NUMBER_RESULT } from "../../../../constants";

export const NumberOutput: React.FC = () => {
  const { data, format, onChangeDataValue } = useImagenStore();

  return (
    <Popover
      title={`${data.reframe.n} output${data.reframe.n === 1 ? "" : "s"}`}
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="180px">
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) => onChangeDataValue(format, "n", value)}
        >
          {DEFAULT_NUMBER_RESULT.map((number) => (
            <Listbox.Option
              key={number.id}
              value={number.id}
              selected={data.reframe.n === +number.name}
            >
              {number.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
