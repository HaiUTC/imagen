import { Fragment, useEffect, useRef, useState } from "react";
import { Popover, type PopoverRefResponse } from "../../popover";
import styles from "./imagen-preview-actions.module.css";
import { ICONS, svgIcon } from "../../../constants/icons";
import {
  AutoSelection,
  Box,
  Button,
  Divider,
  EmptyState,
  Icon,
  Listbox,
  Scrollable,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { AppsIcon, ChevronLeftIcon, SearchIcon } from "@shopify/polaris-icons";
import { useImagenStore } from "../../../../store/imagen.store";
import { addImagenToTemplateFlow } from "../../../../flow/template/add-imagen-to-template.flow";
import {
  useTemplateStore,
  type Template,
} from "../../../../store/template.store";

export const ImageGenPreviewTemplate: React.FC = () => {
  const popoverRef = useRef<PopoverRefResponse>(null);
  const [active, setActive] = useState<boolean>(false);
  const [openScreen, setOpenScreen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { templates } = useTemplateStore();
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const { generatedImages, format } = useImagenStore();

  useEffect(() => {
    if (search) {
      setFilteredTemplates(
        templates.filter(
          (template) =>
            template.name.toLowerCase().includes(search.toLowerCase().trim()) ||
            template.description
              .toLowerCase()
              .includes(search.toLowerCase().trim())
        )
      );
    } else {
      setFilteredTemplates(templates);
    }
  }, [search, templates.length]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleTogglePopover = () => {
    setActive(!active);
    popoverRef.current?.togglePopover();
  };

  return (
    <Popover
      title="Save as template"
      ref={popoverRef}
      fullHeight
      preventCloseOnChildOverlayClick={true}
      onClose={handleTogglePopover}
      activator={
        <button className={styles.button} onClick={handleTogglePopover}>
          {svgIcon(ICONS.SAVE)} Save as template
          <svg
            width="8"
            height="5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.download}
            style={{
              transform: `rotate(${active ? "180deg" : "0deg"})`,
            }}
          >
            <path
              d="M.71 1.71L3.3 4.3c.39.39 1.02.39 1.41 0L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C.52 0 .08 1.08.71 1.71z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      }
    >
      <Box
        width="320px"
        minHeight="450px"
        position="relative"
        overflowX="hidden"
        overflowY="hidden"
      >
        <Box padding="300" borderColor="border" borderBlockEndWidth="025">
          <Text as="h5" variant="headingMd">
            {openScreen ? "Create new template" : "Save as template"}
          </Text>
        </Box>
        {templates.length || openScreen ? (
          <div className={styles.template_container}>
            <Box width="100%">
              <div style={{ padding: "5px 10px" }}>
                <TextField
                  clearButton
                  labelHidden
                  label="Customer segments"
                  placeholder="Search template"
                  autoComplete="off"
                  value={search}
                  onChange={setSearch}
                  prefix={<Icon source={SearchIcon} />}
                />
              </div>

              <Scrollable
                shadow
                style={{
                  position: "relative",
                  maxHeight: "300px",
                  padding: "var(--p-space-100) 0",
                }}
              >
                {filteredTemplates.length ? (
                  <Fragment>
                    <Listbox
                      enableKeyboardControl
                      autoSelection={AutoSelection.FirstSelected}
                      onSelect={(value) => setSelectedTemplate(value)}
                    >
                      {filteredTemplates.map((template) => (
                        <Listbox.Option
                          value={template._id}
                          selected={selectedTemplate === template._id}
                        >
                          <Listbox.TextOption
                            selected={selectedTemplate === template._id}
                          >
                            <Box>
                              <Text as="h6" variant="bodyMd">
                                {template.name}
                              </Text>
                              <Text as="span" variant="bodySm" tone="subdued">
                                {template.description}
                              </Text>
                            </Box>
                          </Listbox.TextOption>
                        </Listbox.Option>
                      ))}
                    </Listbox>
                  </Fragment>
                ) : (
                  <EmptyState
                    heading={`No templates found with search "${search}"`}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  ></EmptyState>
                )}
              </Scrollable>
            </Box>
            <Box width="100%">
              <Divider />
              <Box paddingInline="200" paddingBlock="200">
                <Button
                  icon={AppsIcon}
                  variant="tertiary"
                  onClick={() => setOpenScreen(true)}
                >
                  Create new template
                </Button>
              </Box>
              <Divider />

              <Box
                paddingInline="300"
                paddingBlockEnd="200"
                paddingBlockStart="400"
              >
                <button
                  className={styles.submit}
                  onClick={() => {
                    addImagenToTemplateFlow({
                      imagenId: generatedImages[format].id,
                      id: selectedTemplate,
                    });
                  }}
                >
                  {false ? <Spinner size="small" /> : <span>Save</span>}
                </button>
              </Box>
            </Box>
          </div>
        ) : (
          <EmptyState
            heading="No templates found"
            action={{
              content: "Create new template",
              onAction: () => setOpenScreen(true),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Create a new template to save your current image.</p>
          </EmptyState>
        )}

        <TemplateFormCreateNew
          openScreen={openScreen}
          setOpenScreen={setOpenScreen}
        />
      </Box>
    </Popover>
  );
};

interface TemplateFormCreateNewProps {
  openScreen: boolean;
  setOpenScreen: (openScreen: boolean) => void;
}

const TemplateFormCreateNew: React.FC<TemplateFormCreateNewProps> = ({
  openScreen,
  setOpenScreen,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { generatedImages, format } = useImagenStore();

  return (
    <div className={`${styles.screen} ${openScreen ? styles.active : ""}`}>
      <Box>
        <Button
          icon={ChevronLeftIcon}
          variant="tertiary"
          onClick={() => setOpenScreen(false)}
        >
          Back to main
        </Button>
      </Box>
      <div className={styles.screen_container}>
        <Box width="100%">
          <Box paddingBlockEnd="300" width="100%">
            <TextField
              label="Name"
              requiredIndicator
              placeholder="Template name"
              autoComplete="off"
              value={name}
              onChange={(value) => setName(value)}
            />
          </Box>
          <Box paddingBlockEnd="300" width="100%">
            <TextField
              label="Description"
              multiline={5}
              placeholder="Template description"
              autoComplete="off"
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </Box>
        </Box>
        <Box paddingBlockEnd="200" paddingBlockStart="400" width="100%">
          <button
            className={styles.submit}
            onClick={() =>
              addImagenToTemplateFlow({
                imagenId: generatedImages[format].id,
                name,
                description,
              })
            }
          >
            {false ? <Spinner size="small" /> : <span>Create</span>}
          </button>
        </Box>
      </div>
    </div>
  );
};
