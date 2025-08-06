import { AppProvider, Box } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { ImagenContainer } from "../libs/components/imagen-container";
import { ImagenEditor } from "../libs/components/imagen-editor";
import { ImageGenPreviewContainer } from "../libs/components/imagen-preview";
import { ImagenSideBar } from "../libs/components/imagen-sidebar";
import { useImagenStore } from "../store/imagen.store";
import { useEffect } from "react";
import { getTemplatesFlow } from "../flow/template/get-templates.flow";
import { useTemplateStore } from "../store/template.store";

export default function AppImage() {
  const { format } = useImagenStore();
  const { templates } = useTemplateStore();

  useEffect(() => {
    if (!templates.length) {
      getTemplatesFlow();
    }
  }, []);

  return (
    <AppProvider i18n={polarisTranslations}>
      <Box background="bg-surface">
        <ImagenContainer>
          <ImagenSideBar />
          <ImagenEditor type={format} />
          <ImageGenPreviewContainer />
        </ImagenContainer>
      </Box>
    </AppProvider>
  );
}
