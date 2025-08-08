import { Text, Badge, Button } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";
import styles from "./collections-details.module.css";

interface CollectionsData {
  format: "generate" | "edit";
  taskId: string;
  prompt: string;
  magicPrompt: string;
  aspectRatio: string;
  referenceImage: string[];
  imagens: string[];
}

interface CollectionsDetailsProps {
  data: CollectionsData;
}

export const CollectionsDetails: React.FC<CollectionsDetailsProps> = ({
  data,
}) => {
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatBadgeColor = data.format === "generate" ? "success" : "info";

  return (
    <div className={styles.details_container}>
      {/* User Info */}
      <div className={styles.user_info}>
        <img
          src="https://lh3.googleusercontent.com/a/ACg8ocJ7Nk_vjYZCa7LE-oBYwLZAmZllrqQx_Btvbi-LnUWcGWE=s96-c"
          alt="User avatar"
          className={styles.user_avatar}
        />
        <div className={styles.user_details}>
          <Text as="h6" variant="bodyMd">
            Hải
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            8d ago
          </Text>
        </div>
      </div>

      {/* Format Badge */}
      <div className={styles.format_section}>
        <Badge tone={formatBadgeColor}>
          {data.format.charAt(0).toUpperCase() + data.format.slice(1)}
        </Badge>
        <Text as="span" variant="bodySm" tone="subdued">
          Task ID: {data.taskId}
        </Text>
      </div>

      {/* Aspect Ratio */}
      <div className={styles.aspect_ratio_section}>
        <Text as="h6" variant="bodyMd">
          Aspect Ratio
        </Text>
        <Text as="span" variant="bodySm">
          {data.aspectRatio}
        </Text>
      </div>

      {/* Prompt Section */}
      <div className={styles.prompt_section}>
        <div className={styles.section_header}>
          <Text as="h6" variant="bodyMd">
            Prompt
          </Text>
          <Button
            icon={ClipboardIcon}
            onClick={() => handleCopyText(data.prompt)}
            variant="tertiary"
            size="slim"
          />
        </div>
        <div className={styles.prompt_content}>
          <Text as="p" variant="bodySm">
            {data.prompt}
          </Text>
        </div>
      </div>

      {/* Magic Prompt Section */}
      <div className={styles.prompt_section}>
        <div className={styles.section_header}>
          <Text as="h6" variant="bodyMd">
            Magic Prompt
          </Text>
          <Button
            icon={ClipboardIcon}
            onClick={() => handleCopyText(data.magicPrompt)}
            variant="tertiary"
            size="slim"
          />
        </div>
        <div className={styles.prompt_content}>
          <Text as="p" variant="bodySm">
            {data.magicPrompt}
          </Text>
        </div>
      </div>

      {/* Reference Images */}
      {data.referenceImage.length > 0 && (
        <div className={styles.images_section}>
          <Text as="h6" variant="bodyMd">
            Reference Images
          </Text>
          <div className={styles.images_grid}>
            {data.referenceImage.map((imageUrl, index) => (
              <div key={index} className={styles.grid_image_wrapper}>
                <img
                  src={imageUrl}
                  alt={`Reference ${index}`}
                  className={styles.grid_image}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Images */}
      {data.imagens.length > 0 && (
        <div className={styles.images_section}>
          <Text as="h6" variant="bodyMd">
            Generated Images
          </Text>
          <div className={styles.images_grid}>
            {data.imagens.map((imageUrl, index) => (
              <div key={index} className={styles.grid_image_wrapper}>
                <img
                  src={imageUrl}
                  alt={`Generated ${index}`}
                  className={styles.grid_image}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
