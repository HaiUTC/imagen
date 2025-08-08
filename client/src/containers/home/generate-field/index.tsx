import { Box, InlineStack, Text, TextField } from "@shopify/polaris";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import { useImagenStore } from "../../../store/imagen.store";
import { SettingsGenerate } from "../../layout/editor/settings/settings-generate";
import styles from "./generate-field.module.css";
import { Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";

export interface GenerateFieldProps {
  isSticky: boolean;
  setIsSticky: (isSticky: boolean) => void;
}

export const GenerateField: React.FC<GenerateFieldProps> = ({
  isSticky,
  setIsSticky,
}) => {
  const { data, errors, onChangeDataValue } = useImagenStore();
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isStickyVariant, setIsStickyVariant] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
        setIsStickyVariant(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    // Blur outside logic
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isStickyVariant &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsSticky(true);
      }
    };
    containerRef.current?.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
      containerRef.current?.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isStickyVariant]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedFormats = [".png", ".jpeg", ".jpg", ".webp", ".avif"];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (allowedFormats.includes(fileExtension)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      onChangeDataValue("generate", "image", validFiles);
    }
  };

  const hasImageUpload = data.generate.image && data.generate.image.length > 0;

  return (
    <Fragment>
      <Box paddingBlockStart="1000">
        <Text
          as="h2"
          variant="heading3xl"
          fontWeight="medium"
          alignment="center"
        >
          What will you create?
        </Text>
      </Box>
      <div ref={stickyRef} className={styles.as567} />
      <div
        className={styles.sticky}
        style={{ height: isSticky ? "65px" : "120px" }}
        ref={containerRef}
      >
        <InlineStack align="center" blockAlign="center">
          <Box
            position="relative"
            width="60%"
            paddingBlock="200"
            ref={contentRef}
          >
            <TextField
              label="Prompt"
              labelHidden
              multiline={isSticky ? 2 : hasImageUpload ? 5 : 4}
              name="prompt"
              autoComplete="off"
              value={data.generate.prompt}
              error={errors.prompt}
              placeholder="Describe your creative ideas for the image"
              onChange={(value) =>
                onChangeDataValue("generate", "prompt", value)
              }
              onFocus={() => {
                setIsSticky(false);
              }}
            />
            <div
              className={styles.generate_actions}
              style={{
                zIndex: isSticky ? "0" : "30",
                opacity: isSticky ? "0" : "1",
              }}
            >
              <InlineStack align="space-between" blockAlign="center">
                <SettingsGenerate />
                <Box paddingInlineEnd="200">
                  <InlineStack gap="200" align="center" blockAlign="center">
                    {hasImageUpload && (
                      <Box
                        borderInlineEndWidth="025"
                        borderColor="border-hover"
                        paddingInline="200"
                      >
                        <InlineStack align="end" blockAlign="center">
                          {data.generate.image?.map((image, index) => (
                            <img
                              key={index}
                              className={styles.image}
                              src={URL.createObjectURL(image)}
                              alt={image.name}
                            />
                          ))}
                        </InlineStack>
                      </Box>
                    )}
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpeg,.jpg,.webp,.avif"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className={styles.upload}>
                      {svgIcon(ICONS.UPLOAD)}
                    </label>
                    <button className={styles.generate}>
                      <span>Generate</span>
                    </button>
                  </InlineStack>
                </Box>
              </InlineStack>
            </div>
          </Box>
        </InlineStack>
      </div>
    </Fragment>
  );
};
