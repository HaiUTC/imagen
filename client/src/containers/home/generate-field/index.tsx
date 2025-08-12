import { Box, InlineStack, Text } from "@shopify/polaris";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import { useImagenStore } from "../../../store/imagen.store";
import { SettingsGenerate } from "../../layout/editor/settings/settings-generate";
import styles from "./generate-field.module.css";
import { Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { generateImageFlow } from "../../../flow/imagen/generate-image.flow";
import { editImageFlow } from "../../../flow/imagen/edit-image.flow";

export interface GenerateFieldProps {
  isSticky: boolean;
  observer?: boolean;
  labelHidden?: boolean;
  setIsSticky: (isSticky: boolean) => void;
}

export const GenerateField: React.FC<GenerateFieldProps> = ({
  isSticky,
  setIsSticky,
  labelHidden = false,
  observer = false,
}) => {
  const {
    data,
    format,
    errors,
    onChangeDataValue,
    loadingGenerate,
    setErrors,
  } = useImagenStore();
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStickyVariant, setIsStickyVariant] = useState<boolean>(false);

  useEffect(() => {
    if (!observer) {
      setIsStickyVariant(true);
      return;
    }
    const observerIntersection = new IntersectionObserver(
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
      observerIntersection.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observerIntersection.unobserve(stickyRef.current);
      }
    };
  }, [isStickyVariant, observer]);

  useEffect(() => {
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
      if (format === "generate") {
        const fileValid = validFiles.filter(
          (file) =>
            !data.generate.image?.find((image) => image.name === file.name)
        );
        onChangeDataValue("generate", "image", [
          ...(data.generate.image || []),
          ...fileValid,
        ]);
      } else {
        onChangeDataValue("edit", "image", validFiles);
      }
    }
  };

  const hasImageUpload = data[format].image && data[format].image.length > 0;

  const isDisableGenerate =
    data[format].prompt.trim().length === 0 ||
    (format === "edit" && !hasImageUpload) ||
    loadingGenerate;

  const handleSubmit = async () => {
    try {
      if (format === "generate") {
        await generateImageFlow();
      } else {
        await editImageFlow();
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setErrors({
        submit: "Failed to process your request. Please try again.",
      });
    }
  };

  return (
    <Fragment>
      {!labelHidden && (
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
      )}

      <div ref={stickyRef} className={styles.as567} />
      <div
        className={styles.sticky}
        style={{
          height: isSticky
            ? "65px"
            : Math.floor(data.generate.prompt.length / 142 + 1) * 20 +
              100 +
              "px",
        }}
        ref={containerRef}
      >
        <div className={styles.content_container}>
          <div className={styles.content_container_inner} ref={contentRef}>
            <div className={styles.field_container}>
              <textarea
                className={`${styles.textarea} ${
                  errors.prompt ? styles.textarea_error : ""
                }`}
                name="prompt"
                rows={Math.floor(data[format].prompt.length / 142) + 1}
                autoComplete="off"
                value={data[format].prompt}
                placeholder={
                  format === "generate"
                    ? "Describe your creative ideas for the image"
                    : "Describe your creative ideas to edit the image"
                }
                onChange={(e) =>
                  onChangeDataValue(format, "prompt", e.target.value)
                }
                onFocus={() => {
                  setIsSticky(false);
                }}
              />
              {errors.prompt && (
                <div className={styles.error_message}>{errors.prompt}</div>
              )}
              {errors.submit && (
                <div className={styles.error_message}>{errors.submit}</div>
              )}
              <div
                className={styles.generate_actions}
                style={{
                  zIndex: isSticky ? "0" : "30",
                  opacity: isSticky ? "0" : "1",
                }}
              >
                <div className={styles.generate_actions_container}>
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
                            {data[format].image?.map((image, index) => (
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
                        multiple={format === "generate" ? true : false}
                        accept=".png,.jpeg,.jpg,.webp,.avif"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className={styles.upload}>
                        {svgIcon(ICONS.UPLOAD)}
                      </label>
                      <button
                        className={`${styles.generate} ${
                          isDisableGenerate ? styles.disabled : ""
                        }`}
                        disabled={isDisableGenerate}
                        onClick={handleSubmit}
                      >
                        <span>
                          {format === "generate" ? "Generate" : "Edit"}
                        </span>
                      </button>
                    </InlineStack>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
