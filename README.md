# GrapesJS React Integration App

This project integrates **GrapesJS** into a **React** application, allowing you to dynamically build and manage custom components like text blocks, box layouts, and avatar components. It provides features for real-time component customization through a toolbar and allows saving and reloading content from local storage.

## Features

- **Component Building**: Add text, box, and avatar components to your page using GrapesJS.
- **Custom Toolbar**: Modify selected components using a custom toolbar (e.g., change text size, toggle bold, set flex direction for box blocks).
- **Real-time Preview**: View and interact with components in real-time within a customizable editor.
- **Save/Load Functionality**: Save your page design to local storage and reload it later.
- **React Integration**: Render saved content as React components (e.g., `<Box>`, `<Text>`, `<Avatar>`).

## Tech Stack

- **React**: Front-end framework for building the UI.
- **GrapesJS**: JavaScript framework for building web pages using a visual editor.
- **SCSS**: Used for styling the components.
- **Custom Icon Library**: Uses `sebikostudio-icons` for toolbar icons.
- **blocksin-system**: UI component system for buttons, inputs, and toolbars.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sebastiangrochocki/grapesjs-react-demo.git
   ```

2. Install the dependencies:
   ```bash
   cd grapesjs-react-demo
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   This will open the app in your browser at `http://localhost:3000`.

## Usage

- **Add Blocks**: Use the block manager to add **Text**, **Box**, or **Avatar** components.
- **Edit Components**: Select a component to open the toolbar, where you can change text size, toggle bold, or set avatar image URLs.
- **Save Design**: Click on the "Save" button to store your design in local storage.
- **Reload Design**: The app will automatically load your last saved design from local storage on page refresh.

## File Structure

```bash
src/
│
├── App.js             # Main application file integrating GrapesJS
├── Template.js        # Component for rendering saved components as React elements
├── index.js           # React entry point
└── App.scss           # Main stylesheet
```

## Key Components

### `App.js`
This is the main file that initializes the GrapesJS editor and handles interactions like component selection, toolbar actions, and saving/loading content.

### `Template.js`
This file renders the saved components as React elements (e.g., `<Box>`, `<Text>`, `<Avatar>`).

## Customization

You can easily extend the app by adding new blocks or modifying existing ones. To add a new block, use the `BlockManager` from GrapesJS as shown in `App.js`.

Example of adding a custom block:

```javascript
editorInstance.BlockManager.add("custom-block", {
  label: "Custom Block",
  content: "<div>Custom Block Content</div>",
  category: "Components",
});
```

## License

This project is licensed under the MIT License.
