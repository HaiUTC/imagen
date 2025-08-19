import { createRoot } from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Home from "./containers/home";
import Imagen from "./containers/imagen";
import Layout from "./containers/layout";
import ImagEdit from "./containers/imagedit";
import CollectionsContainer from "./containers/collections";
import Agent from "./containers/agent";
import { useImagenStore } from "./store/imagen.store";
import { useEffect } from "react";

function App() {
  const { setFormat } = useImagenStore.getState();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("imagen")) {
      setFormat("generate");
    } else if (pathname.includes("imagedit")) {
      setFormat("edit");
    }
    // else if (pathname.includes("agent")) {
    //   setFormat("agent");
    // }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/imagen" element={<Imagen />} />
        <Route path="/imagedit" element={<ImagEdit />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/i/:id" element={<CollectionsContainer />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
