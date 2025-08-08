import { createRoot } from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./containers/home";
import Imagen from "./containers/imagen";
import Layout from "./containers/layout";
import ImagEdit from "./containers/imagedit";
import CollectionsContainer from "./containers/collections";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/imagen" element={<Imagen />} />
        <Route path="/imagedit" element={<ImagEdit />} />
        <Route path="/collections" element={<CollectionsContainer />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
