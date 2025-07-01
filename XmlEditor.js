import React from "react";
 import useXmlEditor from "./useXmlEditor";
import "./App.css";

const XmlEditor = () => {
  const {
    originalMetaList,
    updatedMetaList,
    insertIndex,
    setInsertIndex,
    handleEdit,
    handleInsertRow,
    handleDeleteRow,
    handleDownload,
  } = useXmlEditor();

  const renderTable = (list, editable = false, deletable = false) => (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          <th>S.No</th>
          <th>ID</th>
          <th>Name</th>
          <th>Display Name</th>
          <th>Value</th>
          {deletable && <th>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((meta, index) => (
          <tr key={`${meta.id}-${index}`}>
            <td>{index + 1}</td>
            <td>
              {editable ? (
                <input
                  value={meta.id}
                  onChange={(e) => handleEdit(index, "id", e.target.value)}
                />
              ) : (
                meta.id
              )}
            </td>
            <td>
              {editable ? (
                <input
                  value={meta.name}
                  onChange={(e) => handleEdit(index, "name", e.target.value)}
                />
              ) : (
                meta.name
              )}
            </td>
            <td>
              {editable ? (
                <input
                  value={meta.display_name}
                  onChange={(e) => handleEdit(index, "display_name", e.target.value)}
                />
              ) : (
                meta.display_name
              )}
            </td>
            <td>
              {editable ? (
                <input
                  value={meta.text?.value || ""}
                  onChange={(e) => handleEdit(index, "value", e.target.value)}
                />
              ) : (
                meta.value
              )}
            </td>
            {deletable && (
              <td>
                <button onClick={() => handleDeleteRow(index)}>🗑️</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>XML Meta Editor</h2>
      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {/* Original Table */}
        <div>
          <h3>Original XML (Unchanged)</h3>
          {originalMetaList.length > 0
            ? renderTable(originalMetaList, false)
            : <p>Loading original...</p>}
        </div>

        {/* Updated Table */}
        <div>
          <h3>Updated XML (Editable)</h3>
          {updatedMetaList.length > 0 && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Insert row before S.No: </label>
                <select
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(Number(e.target.value))}
                >
                  {updatedMetaList.map((_, i) => (
                    <option key={i} value={i}>{i + 1}</option>
                  ))}
                  <option value={updatedMetaList.length}>End</option>
                </select>
                <button onClick={handleInsertRow} style={{ marginLeft: "10px" }}>
                  Insert New Row
                </button>
              </div>
              {renderTable(updatedMetaList, true, true)}
              <br />
              <button onClick={handleDownload}>Download Updated XML</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default XmlEditor;



// //import React from "react";
// import XmlEditor from "./XmlEditor";
// import CanvasStage from "./CanvasStage";
// import "./App.css";

// function App() {
//   return (
//     <div className="container">
//       <XmlEditor />
      
//     </div>
//   );
// }

// export default App;
