import { Box, Listbox } from "@shopify/polaris";
import { useImagenStore } from "../../../../store/imagen.store";
import { Popover } from "../../../../libs/components/popover";
import { DEFAULT_NUMBER_RESULT } from "../../../../libs/constants";

export const NumberOutput: React.FC = () => {
  const { data, onChangeDataValue } = useImagenStore();

  return (
    <Popover
      title={`${data.generate.n} output${data.generate.n === 1 ? "" : "s"}`}
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="180px">
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) => onChangeDataValue("generate", "n", value)}
        >
          {DEFAULT_NUMBER_RESULT.map((number) => (
            <Listbox.Option
              key={number.id}
              value={number.id}
              selected={data.generate.n === +number.name}
            >
              {number.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
