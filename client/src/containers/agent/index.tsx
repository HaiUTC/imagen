import { Box } from "@shopify/polaris";
import { ImagenSideBar } from "../layout/sidebar";
import { HomeContainer } from "../home/home-container";
import { AgentWorkflowContainer } from "./agent-workflow-container";

export default function Agent() {
  return (
    <HomeContainer>
      <ImagenSideBar />
      <Box background="bg-surface" overflowY="scroll" id="scroll-container">
        <AgentWorkflowContainer />
      </Box>
    </HomeContainer>
  );
}