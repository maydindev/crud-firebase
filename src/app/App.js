/*
//"use client";
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // firebase.js dosyasının doğru konumda olduğundan emin olun
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { saveAs } from 'file-saver'; // npm install file-saver

// JSON'dan CSV'ye dönüşüm fonksiyonu
const exportToCSV = (data) => {
    const header = Object.keys(data[0]);
    const csv = [
        header.join(','),
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
};

function App() {
    const [text, setText] = useState('');
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // Metin giriş alanını güncelleyen handler
    const handleChange = (e) => {
        setText(e.target.value);
    };

    // Veriyi Firestore'a ekleme ve listeyi güncelleme
    const handleCreate = async () => {
        if (text.trim()) {
            try {
                await addDoc(collection(db, 'items'), { text });
                setText('');
                handleRead(); // Create işleminden sonra listeyi güncelle
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    // Firestore'dan verileri okuma
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

    // Veriyi Firestore'da güncelleme
    const handleUpdate = async () => {
        if (selectedId && text.trim()) {
            try {
                const docRef = doc(db, 'items', selectedId);
                await updateDoc(docRef, { text });
                setText('');
                setSelectedId(null);
                handleRead(); // Güncelleme işleminden sonra listeyi güncelle
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    // Firestore'dan veriyi silme
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            handleRead(); // Silme işleminden sonra listeyi güncelle
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Verileri CSV formatında dışa aktarma
    const handleExport = () => {
        exportToCSV(items);
    };

    // Bileşen yüklendiğinde verileri çekme
    useEffect(() => {
        handleRead();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>CRUD with Firebase</h1>
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
                Export to CSV
            </button>
            <ul style={{ marginTop: '20px' }}>
                {items.length > 0 ? (
                    items.map(item => (
                        <li key={item.id} style={{ marginBottom: '10px' }}>
                            {item.text}
                            <button
                                onClick={() => {
                                    setSelectedId(item.id);
                                    setText(item.text);
                                }}
                                style={{ marginLeft: '10px' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{ marginLeft: '10px' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No items available</li>
                )}
            </ul>
        </div>
    );
}

export default App;
*/

"use client";
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // firebase.js dosyasının doğru konumda olduğundan emin olun
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx'; // XLSX kütüphanesini import edin

// JSON'dan XLSX'ye dönüşüm fonksiyonu
const exportToXLSX = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Blob ve dosya kaydetme
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

function App() {
    const [text, setText] = useState('');
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // Metin giriş alanını güncelleyen handler
    const handleChange = (e) => {
        setText(e.target.value);
    };

    // Veriyi Firestore'a ekleme ve listeyi güncelleme
    const handleCreate = async () => {
        if (text.trim()) {
            try {
                await addDoc(collection(db, 'items'), { text });
                setText('');
                handleRead(); // Create işleminden sonra listeyi güncelle
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    // Firestore'dan verileri okuma
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

    // Veriyi Firestore'da güncelleme
    const handleUpdate = async () => {
        if (selectedId && text.trim()) {
            try {
                const docRef = doc(db, 'items', selectedId);
                await updateDoc(docRef, { text });
                setText('');
                setSelectedId(null);
                handleRead(); // Güncelleme işleminden sonra listeyi güncelle
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    // Firestore'dan veriyi silme
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            handleRead(); // Silme işleminden sonra listeyi güncelle
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Verileri XLSX formatında dışa aktarma
    const handleExport = () => {
        exportToXLSX(items);
    };

    // Bileşen yüklendiğinde verileri çekme
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Text</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map(item => (
                            <tr key={item.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.text}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => {
                                                setSelectedId(item.id);
                                                setText(item.text);
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
                            <td colSpan="2" style={{ textAlign: 'center', padding: '8px' }}>No items available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default App;
