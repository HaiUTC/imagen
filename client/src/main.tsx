import { createRoot } from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import AppImage from "./containers/index.tsx";

createRoot(document.getElementById("root")!).render(<AppImage />);
