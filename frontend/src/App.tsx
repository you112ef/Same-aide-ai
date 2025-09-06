import "./App.css";
import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <div className="app-container">
      <div className="sidebar">
        <ChatWindow />
      </div>
      <div className="main-content">
        <div className="editor-pane">
          <h2>Editor</h2>
          {/* Code editor will go here */}
        </div>
        <div className="preview-pane">
          <h2>Preview</h2>
          {/* Live preview will go here */}
        </div>
      </div>
    </div>
  );
}

export default App;
