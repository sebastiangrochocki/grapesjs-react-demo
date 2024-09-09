import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  Button,
  Flex,
  Toolbar,
  Heading,
  Toggle,
  ToggleGroup,
  IconButton,
  Separator,
  Input,
} from "blocksin-system";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "./App.scss";
import ReactDOM from "react-dom";
import { Template } from "./Template";
import {
  ChevronDownIcon,
  DirectionColumnIcon,
  DirectionRowIcon,
  FontBoldIcon,
  TrashIcon,
} from "sebikostudio-icons";

function App() {
  // eslint-disable-next-line
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);
  const [selectedTextBlock, setSelectedTextBlock] = useState(null);
  const [selectedBoxBlock, setSelectedBoxBlock] = useState(null); // State for selected Box block
  const [selectedAvatarBlock, setSelectedAvatarBlock] = useState(null);

  const [reloadTemplate, setReloadTemplate] = useState(false);
  const [size, setSize] = useState("");
  const [isBold, setIsBold] = useState(false); // State for bold toggle
  const [avatarSrc, setAvatarSrc] = useState(""); // State for avatar source URL

  useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = grapesjs.init({
        container: "#gjs",
        fromElement: false,
        height: "100%",
        width: "auto",
        storageManager: false,
        blockManager: {
          appendTo: "#blocks",
        },
        panels: {
          defaults: [
            {
              id: "panel-devices",
              el: ".panel__devices",
              buttons: [],
            },
          ],
        },
        canvas: {
          styles: ["./grapes.css"],
        },
      });

      editorInstance.BlockManager.add("box-block", {
        label:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 18.5L3.5 18.5C2.39543 18.5 1.5 17.6046 1.5 16.5L1.5 3.5C1.5 2.39543 2.39543 1.5 3.5 1.5L16.5 1.5C17.6046 1.5 18.5 2.39543 18.5 3.5L18.5 16.5C18.5 17.6046 17.6046 18.5 16.5 18.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "Box",
        content: {
          type: "Box",
          components: [],
          attributes: { class: "box-block" },
        },
        category: "Components",
      });

      editorInstance.BlockManager.add("text-block", {
        label:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 5.5V4C4.5 3.72386 4.72386 3.5 5 3.5L15 3.5C15.2761 3.5 15.5 3.72386 15.5 4V5.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3.5V16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 16.5L12 16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "Text",
        content: {
          type: "text",
          content: "Text",
          traits: [
            {
              type: "select",
              label: "Size",
              name: "size",
              options: [
                { value: "text-small", name: "Small" },
                { value: "text-medium", name: "Medium" },
                { value: "text-large", name: "Large" },
              ],
              changeProp: 1,
            },
          ],
        },
        category: "Components",
      });

      editorInstance.BlockManager.add("avatar-block", {
        label:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="8" r="2.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15.5C5.21427 14.2142 6 12.5 8 12.5H12C14 12.5 14.7857 14.2142 15 15.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "Avatar",
        content: {
          type: "avatar",
          components: [
            {
              type: "image",
              tagName: "img",
              attributes: {
                src: "https://plus.unsplash.com/premium_photo-1668319915384-3cccf7689bef?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "Avatar",
              },
            },
          ],
          attributes: { class: "avatar-block" },
        },
        category: "Components",
      });

      editorInstance.DomComponents.addType("avatar", {
        model: {
          defaults: {
            tagName: "div",
            draggable: true,
            droppable: false,
            attributes: { class: "avatar-block" },
            components: [
              {
                type: "image",
                tagName: "img",
                attributes: {
                  src: "https://plus.unsplash.com/premium_photo-1668319915384-3cccf7689bef?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Avatar",
                },
              },
            ],
            traits: [
              {
                type: "text",
                label: "Image URL",
                name: "src",
                changeProp: 1,
              },
              {
                type: "text",
                label: "Alt Text",
                name: "alt",
                changeProp: 1,
              },
            ],
          },
          init() {
            this.listenTo(this, "change:src", this.updateSrc);
            this.listenTo(this, "change:alt", this.updateAlt);
          },
          updateSrc() {
            const src = this.get("src");
            this.get("components").at(0).set({ src });
          },
          updateAlt() {
            const alt = this.get("alt");
            this.get("components").at(0).set({ alt });
          },
        },
      });

      editorInstance.on("component:selected", (component) => {
        if (component.is("text")) {
          setSelectedTextBlock(component);
          setSize(component.get("attributes").class || "");
          setIsBold(
            component.get("attributes").class?.includes("bold") || false
          );
          setSelectedBoxBlock(null);
          setSelectedAvatarBlock(null);
        } else if (component.is("Box")) {
          setSelectedBoxBlock(component);
          setSelectedTextBlock(null);
          setSelectedAvatarBlock(null);
          addCustomToolbarButtons(component); // Add custom toolbar button
        } else if (component.is("avatar")) {
          setSelectedAvatarBlock(component);
          setSelectedTextBlock(null);
          setSelectedBoxBlock(null);
          setAvatarSrc(
            component.get("components").at(0).get("attributes").src || ""
          );
        } else {
          setSelectedTextBlock(null);
          setSelectedBoxBlock(null);
          setSelectedAvatarBlock(null);
        }
      });

      const savedContent = JSON.parse(localStorage.getItem("MyPage"));
      if (savedContent) {
        editorInstance.setComponents(savedContent.components);
      }

      editorInstance.on("load", () => {
        const caretIcons = document.querySelectorAll(".gjs-caret-icon");
        caretIcons.forEach((icon) => {
          icon.style.display = "none";
        });

        const categoryTitles = document.querySelectorAll(
          ".gjs-block-category .gjs-title"
        );
        categoryTitles.forEach((title) => {
          const customIconContainer = document.createElement("span");
          customIconContainer.className = "custom-caret-icon";
          title.appendChild(customIconContainer);
          ReactDOM.render(<ChevronDownIcon />, customIconContainer);
        });

        // Customize RTE action bar
        const customizeRTE = () => {
          const rteActions = document.querySelectorAll(".gjs-rte-action");
          rteActions.forEach((action) => {
            const title = action.getAttribute("title");
            if (title !== "Link" && title !== "Unlink") {
              action.style.display = "none";
            }
          });
        };

        customizeRTE();

        editorInstance.on("rte:enable", customizeRTE);
      });

      editorRef.current = editorInstance;
      setEditor(editorInstance);
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  const handleSave = () => {
    if (editorRef.current) {
      const components = editorRef.current.getComponents();
      const savedContent = {
        components: components.toJSON(),
      };
      localStorage.setItem("MyPage", JSON.stringify(savedContent));
      setReloadTemplate((prev) => !prev);
    }
  };

  const handleSizeChange = (value) => {
    if (selectedTextBlock) {
      selectedTextBlock.removeClass("text-small text-medium text-large");
      selectedTextBlock.addClass(value);
      selectedTextBlock.set("attributes", {
        ...selectedTextBlock.get("attributes"),
        class: value,
      });
    }
  };

  const handleBoldToggle = (pressed) => {
    if (selectedTextBlock) {
      if (pressed) {
        selectedTextBlock.addClass("bold");
      } else {
        selectedTextBlock.removeClass("bold");
      }
      setIsBold(pressed);
    }
  };

  const handleChange = (value) => {
    setSize(value);
    handleSizeChange(value);
  };

  const handleDirectionChange = (value) => {
    if (selectedBoxBlock) {
      selectedBoxBlock.removeClass("direction-row direction-column");
      selectedBoxBlock.addClass(`direction-${value}`);
    }
  };

  const handleAvatarSrcChange = (e) => {
    const newSrc = e.target.value;
    setAvatarSrc(newSrc);
    if (selectedAvatarBlock) {
      selectedAvatarBlock.set("src", newSrc);
      selectedAvatarBlock.get("components").at(0).set("src", newSrc);
    }
  };

  //

  const handleClearEditor = () => {
    if (editorRef.current) {
      editorRef.current.DomComponents.clear(); // Clear all components from the editor
      localStorage.removeItem("MyPage"); // Optionally clear saved content from local storage
      setReloadTemplate((prev) => !prev);
    }
  };

  //

  const addCustomToolbarButtons = (component) => {
    // Wait for a short delay to ensure the toolbar is rendered
    setTimeout(() => {
      const toolbar = document.querySelector(".gjs-toolbar-items");
      if (toolbar) {
        if (!toolbar.querySelector(".custom-bg-red-btn")) {
          const customButtonRed = document.createElement("div");
          customButtonRed.className =
            "gjs-toolbar-item gjs-toolbar-item-color custom-bg-red-btn";
          customButtonRed.innerHTML =
            '<span style="background: #F55F55;"></span>';
          customButtonRed.addEventListener("click", () => {
            removeBackgroundClasses(component);
            component.addClass("bg-red");
          });
          toolbar.appendChild(customButtonRed);
        }

        if (!toolbar.querySelector(".custom-bg-white-btn")) {
          const customButtonWhite = document.createElement("div");
          customButtonWhite.className =
            "gjs-toolbar-item gjs-toolbar-item-color custom-bg-white-btn";
          customButtonWhite.innerHTML =
            '<span style="background: white; 1px solid #000;"></span>';
          customButtonWhite.addEventListener("click", () => {
            removeBackgroundClasses(component);
            component.addClass("bg-white");
          });
          toolbar.appendChild(customButtonWhite);
        }
      }
    }, 100); // Delay of 100ms to ensure the toolbar is rendered
  };

  const removeBackgroundClasses = (component) => {
    component.removeClass("bg-red bg-white");
  };
  //
  return (
    <div className="GrapesJsApp">
      <Toolbar
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: "99",
          gap: "8px",
        }}
      >
        {selectedTextBlock && (
          <>
            <Toggle
              onPressedChange={handleBoldToggle}
              pressed={isBold}
              aria-label="Bold"
            >
              <FontBoldIcon />
            </Toggle>
            <Select value={size} onValueChange={handleChange}>
              <Select.Trigger aria-label="Size">
                <Select.Value placeholder="Select size" />
              </Select.Trigger>
              <Select.Content
                position="popper"
                side="bottom"
                sideOffset={8}
                align="start"
              >
                <Select.Item value="text-small">Small</Select.Item>
                <Select.Item value="text-medium">Medium</Select.Item>
                <Select.Item value="text-large">Large</Select.Item>
              </Select.Content>
            </Select>
            <Separator vertical />
          </>
        )}
        {selectedAvatarBlock && (
          <Input
            value={avatarSrc}
            onChange={handleAvatarSrcChange}
            placeholder="Image URL"
            label="Image URL"
          />
        )}
        {selectedBoxBlock && (
          <Flex gap={100}>
            <ToggleGroup
              type="single"
              aria-label="Direction options"
              onValueChange={handleDirectionChange}
            >
              <ToggleGroup.Item value="row" aria-label="Row">
                <DirectionRowIcon />
              </ToggleGroup.Item>
              <ToggleGroup.Item value="column" aria-label="Column">
                <DirectionColumnIcon />
              </ToggleGroup.Item>
            </ToggleGroup>
            <Separator vertical />
          </Flex>
        )}

        <IconButton variant="danger" onClick={handleClearEditor}>
          <TrashIcon />
        </IconButton>
        <Button onClick={handleSave}>Save</Button>
      </Toolbar>
      <Flex style={{ padding: "0 16px", gap: "16px" }}>
        <div className="Editor">
          <div id="blocks">
            <Heading level={4} weight="bold">
              Custom Blocks
            </Heading>
          </div>
          <Flex direction="column" style={{ flex: 7, gap: 16 }}>
            <Heading level={4} weight="bold">
              Editor
            </Heading>
            <div id="gjs" style={{ height: "100%" }} />
          </Flex>
        </div>
        <Template key={reloadTemplate} />
      </Flex>
    </div>
  );
}

export default App;
