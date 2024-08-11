// App.js
/*
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // firebase.js dosyasının doğru konumda olduğundan emin olun
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

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

// app/page.js (veya ilgili sayfa bileşeni)
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Firebase'i tarayıcı tarafında başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Tarayıcı tarafında çalışacak kod
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error('Error fetching items: ', error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim()) {
      try {
        await addDoc(collection(db, 'items'), { name: newItem });
        setNewItem('');
        // Ekleme işleminden sonra listeyi güncelle
        const querySnapshot = await getDocs(collection(db, 'items'));
        const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error('Error adding item: ', error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      // Silme işleminden sonra listeyi güncelle
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={newItem} 
        onChange={(e) => setNewItem(e.target.value)} 
        placeholder="Add a new item" 
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} 
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
