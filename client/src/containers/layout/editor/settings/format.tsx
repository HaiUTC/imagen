import { Box, Listbox } from "@shopify/polaris";
import {
  useImagenStore,
  type ImagenValue,
} from "../../../../store/imagen.store";
import { Popover } from "../../../../libs/components/popover";
import { DEFAULT_FORMAT } from "../../../../libs/constants";

export const FormatOutput: React.FC = () => {
  const { format, setFormat } = useImagenStore();

  return (
    <Popover
      title={format === "generate" ? "Generate" : "Edit"}
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="180px">
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) => setFormat(value as keyof ImagenValue)}
        >
          {DEFAULT_FORMAT.map((number) => (
            <Listbox.Option
              key={number.id}
              value={number.id}
              selected={format === number.id}
            >
              {number.name}
            </Listbox.Option>
          ))}
        </Listbox>
      </Box>
    </Popover>
  );
};
