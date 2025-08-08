import { AppProvider, Box } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getTemplatesFlow } from "../../flow/template/get-templates.flow";
import { useTemplateStore } from "../../store/template.store";

export default function Layout() {
  const { templates } = useTemplateStore();

  useEffect(() => {
    if (!templates.length) {
      getTemplatesFlow();
    }
  }, []);

  return (
    <AppProvider i18n={polarisTranslations}>
      <Box background="bg-surface">
        <Outlet />
      </Box>
    </AppProvider>
  );
}
