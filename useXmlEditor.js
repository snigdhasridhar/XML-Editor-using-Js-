import { useEffect, useState } from "react";
import { parseStringPromise, Builder } from "xml2js";

const useXmlEditor = () => {
  const [originalMetaList, setOriginalMetaList] = useState([]);
  const [updatedMetaList, setUpdatedMetaList] = useState([]);
  const [parsedXml, setParsedXml] = useState(null);
  const [insertIndex, setInsertIndex] = useState(0);
  const [newRowCounter, setNewRowCounter] = useState(0);

  useEffect(() => {
    fetch("/data.xml")
      .then((res) => res.text())
      .then(async (xmlString) => {
        const result = await parseStringPromise(xmlString, {
          explicitArray: false,
          mergeAttrs: true,
        });

        const metaArray = result.order?.content_meta?.meta;

        if (!metaArray) {
          console.error("No <meta> found in XML");
          return;
        }

        const normalizedMetaList = Array.isArray(metaArray)
          ? metaArray
          : [metaArray];

        const parsedList = normalizedMetaList.map((meta, idx) => ({
          id: meta.id || "",
          name: meta.name || "",
          display_name: meta.display_name || "",
          editable: meta.editable || "",
          key: meta.key || "",
          text: { value: meta.text?.value || "" },
          _index: idx,
        }));

        setParsedXml(result);

        setOriginalMetaList(
          parsedList.map(({ id, name, display_name, text }) => ({
            id,
            name,
            display_name,
            value: text.value,
          }))
        );

        setUpdatedMetaList(parsedList);
      })
      .catch((err) => console.error("Error parsing XML:", err));
  }, []);

  const handleEdit = (index, field, newValue) => {
    const updated = [...updatedMetaList];

    if (field === "value") {
      updated[index].text = { ...updated[index].text, value: newValue };
    } else {
      updated[index][field] = newValue;
    }

    setUpdatedMetaList(updated);
  };

  const handleInsertRow = () => {
  const updated = [...updatedMetaList];

  // Insert new row with id equal to insertIndex
  const newMeta = {
    id: `${insertIndex}`,
    name: "",
    display_name: "",
    editable: "True",
    key: "",
    text: { value: "" },
  };

  updated.splice(insertIndex, 0, newMeta);

  // Reassign ids to maintain serial order
  const reassigned = updated.map((item, idx) => ({
    ...item,
    id: `${idx}`,
  }));

  setUpdatedMetaList(reassigned);
  setNewRowCounter((prev) => prev + 1);
};


  const handleDeleteRow = (index) => {
    const updated = [...updatedMetaList];
    updated.splice(index, 1);
    setUpdatedMetaList(updated);
  };

  const handleDownload = () => {
    if (!parsedXml) return;

    const metaArray = updatedMetaList.map((meta) => ({
      $: {
        id: meta.id || "",
        name: meta.name || "",
        display_name: meta.display_name || "",
        editable: meta.editable || "",
        key: meta.key || "",
      },
      text: {
        value: meta.text?.value || "",
      },
    }));

    const newXml = {
      ...parsedXml,
      order: {
        ...parsedXml.order,
        content_meta: {
          meta: metaArray,
        },
      },
    };

    const builder = new Builder({
      headless: true,
      xmldec: { version: "1.0", encoding: "UTF-8" },
    });

    const xmlString = builder.buildObject(newXml);

    const blob = new Blob([xmlString], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_data.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    originalMetaList,
    updatedMetaList,
    insertIndex,
    setInsertIndex,
    handleEdit,
    handleInsertRow,
    handleDeleteRow,
    handleDownload,
  };
};

export default useXmlEditor;
