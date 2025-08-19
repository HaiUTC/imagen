import { BlockStack } from "@shopify/polaris";
import { Box } from "@shopify/polaris";
import { OptionImagenDetail } from "./option";
import { useImagenStore } from "../../../store/imagen.store";
import { ImagenSideBarLogo } from "./logo";
import { useNavigate } from "react-router-dom";

export const ImagenSideBar: React.FC = () => {
  const { format, setFormat } = useImagenStore();
  const navigate = useNavigate();

  return (
    <Box
      width="80px"
      minHeight="100vh"
      borderColor="border"
      borderInlineEndWidth="025"
    >
      <BlockStack align="center" inlineAlign="center">
        <ImagenSideBarLogo
          onClick={() => {
            setFormat("generate");
            navigate("/");
          }}
        />
        <OptionImagenDetail
          icon="generate"
          label="Generate"
          isActive={format === "generate"}
          onClick={() => {
            setFormat("generate");
            navigate("/imagen");
          }}
        />
        <OptionImagenDetail
          icon="edit"
          label="Edit"
          isActive={format === "edit"}
          onClick={() => {
            setFormat("edit");
            navigate("/imagedit");
          }}
        />
        {/* <OptionImagenDetail
          icon="resize"
          label="Agent"
          isActive={false}
          onClick={() => {}}
        /> */}
        {/* <OptionImagenDetail
          icon="remove-background"
          label="Remove background"
          isActive={false}
          onClick={() => {}}
        /> */}
        {/* <OptionImagenDetail
          icon="shadow"
          label="Shadow"
          isActive={false}
          onClick={() => {}}
        />
        <OptionImagenDetail
          icon="fashion"
          label="Fashion"
          isActive={false}
          onClick={() => {}}
        />
        <OptionImagenDetail
          icon="video"
          label="Video"
          isActive={false}
          onClick={() => {}}
        /> */}
      </BlockStack>
    </Box>
  );
};
