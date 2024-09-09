import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.scss";
import { Heading } from "blocksin-system";
import { ScrollArea } from "blocksin-system";

const Box = ({ style, children, className }) => {
  return (
    <div style={{ ...style }} className={className}>
      {children}
    </div>
  );
};

const Avatar = ({ style, src, className, text }) => {
  return (
    <div style={{ ...style }} className={className}>
      <img src={src} alt={text} />
    </div>
  );
};

const Text = ({ style, children, className }) => {
  return (
    <p style={style} className={className}>
      {children}
    </p>
  );
};

const Template = () => {
  const [content, setContent] = useState([]);
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem("MyPage"));
    if (savedContent) {
      setContent(savedContent.components);
    }
  }, []);

  useEffect(() => {
    const renderMarkup = (component, indent = 0) => {
      const className = component.classes ? component.classes.join(" ") : "";
      const indentation = "  ".repeat(indent);

      if (component.type === "Box") {
        return `${indentation}<Box style={{${JSON.stringify(component.style, null, 2) || ""}}} className="${className}">
${component.components?.map((child) => renderMarkup(child, indent + 1)).join("\n") || "// content goes here"}
${indentation}</Box>`;
      } else if (component.type === "text") {
        return `${indentation}<Text style={{${JSON.stringify(component.style, null, 2) || ""}}} className="${className}">${component.components?.map((child) => child.content).join("") || component.content}</Text>`;
      } else if (component.type === "avatar") {
        return `${indentation}<Avatar style={{${JSON.stringify(component.style, null, 2) || ""}}} src="${component.components[0].attributes.src}" className="${className}" text="${component.components[0].attributes.alt || ""}" />`;
      }
      return "";
    };

    setMarkup(content.map((component) => renderMarkup(component)).join("\n"));
  }, [content]);

  const renderComponent = (component) => {
    const className = component.classes ? component.classes.join(" ") : "";

    if (component.type === "Box") {
      return (
        <Box style={component.style} className={className}>
          {component.components?.map((child, index) => (
            <React.Fragment key={index}>
              {renderComponent(child)}
            </React.Fragment>
          ))}
        </Box>
      );
    } else if (component.type === "text") {
      return (
        <Text style={component.style} className={className}>
          {component.components?.map((child) => child.content).join("") ||
            component.content}
        </Text>
      );
    } else if (component.type === "avatar") {
      return (
        <Avatar
          style={component.style}
          src={component.components[0].attributes.src}
          className={className}
          text={component.components[0].attributes.alt || ""}
        />
      );
    }
    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        gap: 16,
        overflow: "hidden",
      }}
    >
      <Heading level={4} weight="bold">
        React Render
      </Heading>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "white",
          border: "1px solid var(--border-neutral-subtle)",
          boxShadow: "var(--shadow-level-1)",
        }}
        className="page"
      >
        {content.map((component, index) => (
          <React.Fragment key={index}>
            {renderComponent(component)}
          </React.Fragment>
        ))}
      </div>
      <Heading level={4} weight="bold">
        React Markup
      </Heading>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--shadow-level-1)",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
          }}
          className="markup"
        >
                <ScrollArea style>

          <SyntaxHighlighter
            language="jsx"
            showLineNumbers={true}
            style={vscDarkPlus}
          >
            {markup}
          </SyntaxHighlighter>
          </ScrollArea>

        </div>
    </div>
  );
};

export { Template, Box, Text, Avatar };
