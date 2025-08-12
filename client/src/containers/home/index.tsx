import { Box } from "@shopify/polaris";
import { useState } from "react";
import { ImagenSideBar } from "../layout/sidebar";
import { GenerateField } from "./generate-field";
import { HomeContainer } from "./home-container";
import { Library } from "./library";
import { CollectionGeneratingFloat } from "../collections/collection-generating-float";

export default function Home() {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  return (
    <HomeContainer>
      <ImagenSideBar />
      <Box minHeight="100vh" overflowY="scroll">
        <GenerateField isSticky={isSticky} observer setIsSticky={setIsSticky} />
        <Library isSticky={isSticky} />
      </Box>
      <CollectionGeneratingFloat />
    </HomeContainer>
  );
}
