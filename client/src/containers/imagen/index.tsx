import { ImagenContainer } from "./imagen-container";
import { ImageGenPreviewContainer } from "../layout/preview";
import { ImagenSideBar } from "../layout/sidebar";
import { ImagenEditor } from "../layout/editor";
import { GenerateImageEditor } from "./imagen-editor";
import { generateImageFlow } from "../../flow/imagen/generate-image.flow";
import { useImagenStore } from "../../store/imagen.store";

export default function App() {
  const { format, data, setErrors, setIsDownloaded } = useImagenStore();

  const handleSubmit = async () => {
    if (data[format || "generate"].prompt) {
      await generateImageFlow();
      setErrors({});
      setIsDownloaded(false);
    } else {
      setErrors({
        prompt: "Prompt is required",
      });
      return;
    }
  };

  return (
    <ImagenContainer>
      <ImagenSideBar />
      <ImagenEditor onSubmit={handleSubmit}>
        <GenerateImageEditor />
      </ImagenEditor>
      <ImageGenPreviewContainer />
    </ImagenContainer>
  );
}
