import { Popover } from "../popover";
import { Box, Listbox } from "@shopify/polaris";
import { useGenerateImageStore } from "../../../store/generate-image.store";
import {
  DEFAULT_IMAGE_GEN_MODEL,
  DEFAULT_IMAGE_MIXED_GEN_MODEL,
} from "../../constants";

interface ModelOptionProps {
  isReferenceImage?: boolean;
}

export const ModelOption: React.FC<ModelOptionProps> = ({
  isReferenceImage,
}) => {
  const { customInstructions, onChangeCustomInstructions } =
    useGenerateImageStore();

  const handleChangeCustomInstructions = (key: string, value: string) => {
    const objectChange = {
      [key]: value,
    };

    if (value !== "pro") {
      objectChange.number_output = "1";
    }
    onChangeCustomInstructions({
      ...customInstructions,
      ...objectChange,
    });
  };

  return (
    <Popover
      title={(isReferenceImage
        ? DEFAULT_IMAGE_MIXED_GEN_MODEL
        : DEFAULT_IMAGE_GEN_MODEL
      )
        .find((model) => model.id === customInstructions.model)
        ?.name?.replace(/(.*)\s\((.*)\)/, "$1")}
      button={{ variant: "tertiary" }}
    >
      <Box paddingBlock="300" paddingInline="100" width="180px">
        <Listbox
          accessibilityLabel="Listbox with Action example"
          onSelect={(value) => handleChangeCustomInstructions("model", value)}
        >
          {(isReferenceImage
            ? DEFAULT_IMAGE_MIXED_GEN_MODEL
            : DEFAULT_IMAGE_GEN_MODEL
          ).map((model) => (
            <Listbox.Option
              key={model.id}
              value={model.id}
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
