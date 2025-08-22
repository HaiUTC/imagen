import {
  AppProvider,
  Text,
  DropZone,
  LegacyStack,
  Thumbnail,
  InlineStack,
  FormLayout,
  TextField,
  Button,
  Box,
} from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { useState, useCallback } from "react";

export default function Agent() {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    []
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("description", prompt);
    files.forEach((file) => {
      formData.append("images", file);
    });
    const response = await fetch("http://localhost:3003/api/v1/phase-1", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <AppProvider i18n={polarisTranslations}>
      <Box width="60%" padding="200">
        <FormLayout>
          <FormLayout.Group>
            <TextField
              label="Prompt"
              placeholder="Enter your prompt here"
              autoComplete="off"
              value={prompt}
              onChange={(value) => setPrompt(value)}
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <DropZone onDrop={handleDropZoneDrop}>
              {uploadedFiles}
              {fileUpload}
            </DropZone>
          </FormLayout.Group>
        </FormLayout>
        <FormLayout.Group>
          <Button onClick={handleSubmit}>Submit</Button>
        </FormLayout.Group>
      </Box>
    </AppProvider>
  );
}
