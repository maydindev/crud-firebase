"use client";
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const exportToXLSX = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

function Meal() {
    const [text, setText] = useState('');
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [radioValue, setRadioValue] = useState('');
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [comboValue, setComboValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

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

    const handleCreate = async () => {
        if (text.trim()) {
            try {
                await addDoc(collection(db, 'items'), {
                    text,
                    radioValue,
                    checkboxValue,
                    comboValue,
                    textareaValue
                });
                setText('');
                setRadioValue('');
                setCheckboxValue(false);
                setComboValue('');
                setTextareaValue('');
                handleRead();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    const handleRead = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'items'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(data);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    const handleUpdate = async () => {
        if (selectedId && text.trim()) {
            try {
                const docRef = doc(db, 'items', selectedId);
                await updateDoc(docRef, {
                    text,
                    radioValue,
                    checkboxValue,
                    comboValue,
                    textareaValue
                });
                setText('');
                setRadioValue('');
                setCheckboxValue(false);
                setComboValue('');
                setTextareaValue('');
                setSelectedId(null);
                handleRead();
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            handleRead();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleExport = () => {
        exportToXLSX(items);
    };

    useEffect(() => {
        handleRead();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>CRUD with Firebase</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    placeholder="Enter text"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={selectedId ? handleUpdate : handleCreate}>
                    {selectedId ? 'Update' : 'Create'}
                </button>
                <button onClick={handleExport} style={{ marginLeft: '10px' }}>
                    Export to XLSX
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="Option 1"
                            checked={radioValue === 'Option 1'}
                            onChange={handleRadioChange}
                        />
                        Option 1
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            value="Option 2"
                            checked={radioValue === 'Option 2'}
                            onChange={handleRadioChange}
                        />
                        Option 2
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            value="Option 3"
                            checked={radioValue === 'Option 3'}
                            onChange={handleRadioChange}
                        />
                        Option 3
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={checkboxValue}
                            onChange={handleCheckboxChange}
                        />
                        Check this box
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label>
                        Select an option:
                        <select value={comboValue} onChange={handleComboChange} style={{ marginLeft: '10px' }}>
                            <option value="" disabled>Select an option</option>
                            <option value="Combo Option 1">Combo Option 1</option>
                            <option value="Combo Option 2">Combo Option 2</option>
                            <option value="Combo Option 3">Combo Option 3</option>
                        </select>
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <textarea
                        value={textareaValue}
                        onChange={handleTextareaChange}
                        placeholder="Enter more details here..."
                        style={{ width: '100%', height: '100px' }}
                    />
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Text</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Radio</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Checkbox</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Combobox</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Textarea</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map(item => (
                            <tr key={item.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.text}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.radioValue}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.checkboxValue ? 'Yes' : 'No'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.comboValue}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.textareaValue}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => {
                                                setSelectedId(item.id);
                                                setText(item.text);
                                                setRadioValue(item.radioValue);
                                                setCheckboxValue(item.checkboxValue);
                                                setComboValue(item.comboValue);
                                                setTextareaValue(item.textareaValue);
                                            }}
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>No items available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Meal;
