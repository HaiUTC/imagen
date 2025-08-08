import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionsImagePreview } from "./collections-image-preview";
import { CollectionsDetails } from "./collections-details";
import { CollectionsCarousel } from "./collections-carousel";
import styles from "./collections.module.css";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsContainerProps {
  data?: CollectionsData;
}

export const CollectionsContainer: React.FC<CollectionsContainerProps> = ({
  data = {
    format: "generate",
    taskId: "task-123",
    prompt:
      "A captivating artistic portrait showcasing a teen Asian woman with long, flowing black hair...",
    magicPrompt:
      "A stylized portrait photograph of a young Asian woman with long, flowing black hair framing...",
    aspectRatio: "3:4",
    referenceImage: [
      "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14v4sk498vg.jpeg",
    ],
    imagens: [
      "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14xpsx50nwz.jpeg",
      "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj854dil.jpeg",
      "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj652jz5.jpeg",
      "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj7538m9.jpeg",
    ],
  },
}) => {
  // Sample collections data
  const sampleCollections: CollectionsData[] = [
    {
      format: "generate",
      taskId: "task-123",
      prompt:
        "A captivating artistic portrait showcasing a teen Asian woman with long, flowing black hair...",
      magicPrompt:
        "A stylized portrait photograph of a young Asian woman with long, flowing black hair framing...",
      aspectRatio: "3:4",
      referenceImage: [
        "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14v4sk498vg.jpeg",
      ],
      imagens: [
        "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14xpsx50nwz.jpeg",
        "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj854dil.jpeg",
        "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj652jz5.jpeg",
        "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images/screenshot_me14yoj7538m9.jpeg",
      ],
    },
    {
      format: "edit",
      taskId: "task-456",
      prompt: "A beautiful landscape with mountains and sunset...",
      magicPrompt:
        "A stunning landscape photograph with dramatic mountains and golden sunset...",
      aspectRatio: "16:9",
      referenceImage: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      ],
      imagens: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
      ],
    },
    {
      format: "generate",
      taskId: "task-789",
      prompt: "A futuristic cityscape with neon lights and flying cars...",
      magicPrompt:
        "A cyberpunk cityscape with glowing neon lights and hovering vehicles...",
      aspectRatio: "2:1",
      referenceImage: [],
      imagens: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
      ],
    },
  ];
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState(data);
  const [selectedCollectionId, setSelectedCollectionId] = useState(data.taskId);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleCollectionSelect = (collection: CollectionsData) => {
    setSelectedData(collection);
    setSelectedCollectionId(collection.taskId);
  };

  return (
    <div className={styles.collections_container}>
      <div className={styles.main_preview}>
        <CollectionsImagePreview
          data={selectedData}
          onBackClick={handleBackClick}
        />
      </div>

      <div className={styles.details_panel}>
        <CollectionsDetails data={selectedData} />
      </div>

      <CollectionsCarousel
        collections={sampleCollections}
        onCollectionSelect={handleCollectionSelect}
        selectedCollectionId={selectedCollectionId}
      />
    </div>
  );
};

export default CollectionsContainer;
