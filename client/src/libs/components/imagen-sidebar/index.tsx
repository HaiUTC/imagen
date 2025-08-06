import { BlockStack } from "@shopify/polaris";
import { Box } from "@shopify/polaris";
import { OptionImagenDetail } from "./option";
import { useImagenStore } from "../../../store/imagen.store";

export const ImagenSideBar: React.FC = () => {
  const { format, setFormat } = useImagenStore();

  return (
    <Box
      width="80px"
      minHeight="100vh"
      borderColor="border"
      borderInlineEndWidth="025"
    >
      <BlockStack align="center" inlineAlign="center">
        <OptionImagenDetail
          icon="generate"
          label="Generate"
          isActive={format === "generate"}
          onClick={() => setFormat("generate")}
        />
        {/* <OptionImagenDetail
          icon="generate"
          label="Generate V2"
          isActive={format === "generate_v2"}
          onClick={() => setFormat("generate_v2")}
        /> */}
        {/* <OptionImagenDetail
          icon="upscale"
          label="Upscale"
          isActive={format === "upscale"}
          onClick={() => setFormat("upscale")}
        />
        <OptionImagenDetail
          icon="remove-background"
          label="Remove background"
          isActive={format === "remove_background"}
          onClick={() => setFormat("remove_background")}
        />
        <OptionImagenDetail
          icon="resize"
          label="Resize"
          isActive={format === "reframe"}
          onClick={() => setFormat("reframe")}
        />
        <OptionImagenDetail
          icon="shadow"
          label="Shadow"
          isActive={format === "shadow"}
          onClick={() => setFormat("shadow")}
        />
        <OptionImagenDetail
          icon="fashion"
          label="Fashion"
          isActive={format === "fashion"}
          onClick={() => setFormat("fashion")}
        /> */}
        {/* <OptionImagenDetail
          icon="video"
          label="Video"
          isActive={format === "video"}
          onClick={() => setFormat("video")}
        /> */}
      </BlockStack>
    </Box>
  );
};
