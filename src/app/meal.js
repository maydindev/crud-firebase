"use client";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const exportToXLSX = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function Meal() {
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");
  const [text7, setText7] = useState("");
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [radioValue, setRadioValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [comboValue, setComboValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [operationTimestamp, setOperationTimestamp] = useState(
    new Date().toISOString()
  );
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(
    new Date().toISOString()
  );

  // Filter state
  const [textFilter, setTextFilter] = useState("");
  const [radioFilter, setRadioFilter] = useState("");
  const [checkboxFilter, setCheckboxFilter] = useState("");
  const [comboFilter, setComboFilter] = useState("");
  const [textareaFilter, setTextareaFilter] = useState("");
  const [operationFilter, setOperationFilter] = useState("");
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const handleCheckboxChange = () => {
    setCheckboxValue(!checkboxValue);
  };

  const handleComboChange = (e) => {
    setComboValue(e.target.value);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleOperationTimestampChange = (e) => {
    setOperationTimestamp(e.target.value);
  };

  const handleCreate = async () => {
    if (text.trim()) {
      try {
        await addDoc(collection(db, "items"), {
          text,
          radioValue,
          checkboxValue,
          comboValue,
          textareaValue,
          operationTimestamp,
          lastUpdatedTimestamp: new Date().toISOString(),
        });
        setText("");
        setRadioValue("");
        setCheckboxValue(false);
        setComboValue("");
        setTextareaValue("");
        setOperationTimestamp(new Date().toISOString());
        setLastUpdatedTimestamp(new Date().toISOString());
        handleRead();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleRead = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const handleUpdate = async () => {
    if (selectedId && text.trim()) {
      try {
        const docRef = doc(db, "items", selectedId);
        await updateDoc(docRef, {
          text,
          radioValue,
          checkboxValue,
          comboValue,
          textareaValue,
          operationTimestamp,
          lastUpdatedTimestamp: new Date().toISOString(),
        });
        setText("");
        setRadioValue("");
        setCheckboxValue(false);
        setComboValue("");
        setTextareaValue("");
        setOperationTimestamp(new Date().toISOString());
        setLastUpdatedTimestamp(new Date().toISOString());
        setSelectedId(null);
        handleRead();
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      handleRead();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleExport = () => {
    exportToXLSX(items);
  };

  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setOperationTimestamp(now);
    setLastUpdatedTimestamp(now);
    handleRead();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      (!textFilter ||
        item.text.toLowerCase().includes(textFilter.toLowerCase())) &&
      (!radioFilter || item.radioValue === radioFilter) &&
      (checkboxFilter === "" ||
        item.checkboxValue === (checkboxFilter === "Checked")) &&
      (!comboFilter || item.comboValue === comboFilter) &&
      (!textareaFilter ||
        item.textareaValue
          .toLowerCase()
          .includes(textareaFilter.toLowerCase())) &&
      (!operationFilter ||
        new Date(item.operationTimestamp)
          .toLocaleDateString()
          .includes(operationFilter)) &&
      (!lastUpdatedFilter ||
        new Date(item.lastUpdatedTimestamp)
          .toLocaleDateString()
          .includes(lastUpdatedFilter))
  );

  return (
    <div style={{ padding: "20px" }}>
      <h3>Ölçüm, İlaç ve Beslenme Takibi</h3>

      <div style={{ marginTop: "10px" }}>
        <label>
          Date and Time:
          <input
            type="datetime-local"
            value={operationTimestamp}
            onChange={handleOperationTimestampChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>
      <br />

      <div>
            <label>
              <input
                type="radio"
                value="Kahvaltı"
                checked={radioValue === "Kahvaltı"}
                onChange={handleRadioChange}
              />
              Kahvaltı
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="Öğle Yemeği"
                checked={radioValue === "Öğle Yemeği"}
                onChange={handleRadioChange}
              />
              Öğle Yemeği
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="Akşam Yemeği"
                checked={radioValue === "Akşam Yemeği"}
                onChange={handleRadioChange}
              />
              Akşam Yemeği
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="Ara Öğün"
                checked={radioValue === "Ara Öğün"}
                onChange={handleRadioChange}
              />
              Ara Öğün
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="Düşük Şeker"
                checked={radioValue === "Düşük Şeker"}
                onChange={handleRadioChange}
              />
              Düşük Şeker
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="Düşük Şeker"
                checked={radioValue === "Düşük Şeker"}
                onChange={handleRadioChange}
              />
              Yüksek Şeker
            </label>
          </div>
<br />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >

            <div>




            <div>
            <label>
              İnsülin Dozu (Öğün):
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>
          <div>
            <label>
              İnsülin Dozu (Yüksek Giriş):
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>
          
          <div>
            <label>
              İnsülin Dozu (Toplam):
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>


            </div>
          
          <br />
          
        </div>


<div>


<div>
            <label>
              Açlık Sensör Şeker Ölçümü :
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
              <label>
              Select an option:
              <select
                value={comboValue}
                onChange={handleComboChange}
                style={{ marginLeft: "10px" }}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="Combo Option 1">Combo Option 1</option>
                <option value="Combo Option 2">Combo Option 2</option>
                <option value="Combo Option 3">Combo Option 3</option>
              </select>
            </label>
            </label>
          </div>
          <div>
            <label>
              Açlık Kan Şeker Ölçümü :
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Yemek Bekleme Dk. :
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Toplam Karbonhidrat : 
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Tokluk Şeker Ölçümü : 
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text"
                style={{ marginRight: "10px" }}
              />
            </label>
          </div>






</div>
<br />



        <div style={{ marginBottom: "20px" }}>
          
          <div style={{ marginTop: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Gano
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Keçiboynuzu
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Damla
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Çinko
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Çay
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkboxValue}
                onChange={handleCheckboxChange}
              />
              Krem
            </label>
          </div>

          <div style={{ marginTop: "10px" }}>
            
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>
              Details:
              <textarea
                value={textareaValue}
                onChange={handleTextareaChange}
                placeholder="Enter more details here..."
                style={{ width: "100%", height: "100px", marginTop: "5px" }}
              />
            </label>
          </div>
        </div>
        <div>
          <button onClick={selectedId ? handleUpdate : handleCreate}>
            {selectedId ? "Update" : "Create"}
          </button>
          <button onClick={handleExport} style={{ marginLeft: "10px" }}>
            Export to XLSX
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Filters</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Filter by Text"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Radio"
            value={radioFilter}
            onChange={(e) => setRadioFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Checkbox (Checked/Unchecked)"
            value={checkboxFilter}
            onChange={(e) => setCheckboxFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Combo"
            value={comboFilter}
            onChange={(e) => setComboFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Textarea"
            value={textareaFilter}
            onChange={(e) => setTextareaFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Operation Date"
            value={operationFilter}
            onChange={(e) => setOperationFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Filter by Last Updated Date"
            value={lastUpdatedFilter}
            onChange={(e) => setLastUpdatedFilter(e.target.value)}
            style={{ marginRight: "10px" }}
          />
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Operation Timestamp
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Text</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Radio</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Checkbox
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Combobox
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Textarea
            </th>

            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Last Updated Timestamp
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.operationTimestamp).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.text}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.radioValue}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.checkboxValue ? "Checked" : "Unchecked"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.comboValue}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {item.textareaValue}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(item.lastUpdatedTimestamp).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedId(item.id);
                        setText(item.text);
                        setRadioValue(item.radioValue);
                        setCheckboxValue(item.checkboxValue);
                        setComboValue(item.comboValue);
                        setTextareaValue(item.textareaValue);
                        setOperationTimestamp(item.operationTimestamp);
                        setLastUpdatedTimestamp(item.lastUpdatedTimestamp);
                      }}
                      style={{ fontSize: "12px", padding: "5px 10px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ fontSize: "12px", padding: "5px 10px" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "8px" }}>
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Meal;



