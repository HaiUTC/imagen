import { ImagenContainer } from "../imagen/imagen-container";
import { ImagenSideBar } from "../layout/sidebar";
import { ImageGenPreviewContainer } from "../layout/preview";
import { ImagenEditEditor } from "./imagen-editor";
import { ImagenEditor } from "../layout/editor";
import { useImagenStore } from "../../store/imagen.store";
import { editImageFlow } from "../../flow/imagen/edit-image.flow";

export default function ImagEdit() {
  const { format, data, setErrors, setIsDownloaded } = useImagenStore();

  const handleSubmit = async () => {
    if (data[format || "edit"].prompt && data[format || "edit"].image?.length) {
      await editImageFlow();
      setErrors({});
      setIsDownloaded(false);
    }

    let error: Record<string, string> = {};

    if (!data[format || "edit"].prompt) {
      error.prompt = "Prompt is required";
    }
    if (!data[format || "edit"].image?.length) {
      error.image = "Image reference is required";
    }

    setErrors(error);
  };

  return (
    <ImagenContainer>
      <ImagenSideBar />
      <ImagenEditor onSubmit={handleSubmit}>
        <ImagenEditEditor />
      </ImagenEditor>
      <ImageGenPreviewContainer />
    </ImagenContainer>
  );
}
