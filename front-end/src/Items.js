// src/QuickNotes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this CSS is saved and imported

const QuickNotes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ name: '', description: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes', error);
      }
    };
    fetchNotes();
  }, [reload]);

  const handleAddNote = async e => {
    e.preventDefault();
    if (newNote.name) {
      await axios.post('http://localhost:5000/items', newNote);
      setNewNote({ name: '', description: '' });
      setReload(prev => !prev);
    }
  };

  const handleDeleteNote = async id => {
    await axios.delete(`http://localhost:5000/items/${id}`);
    setReload(prev => !prev);
  };

  const handleEditNote = note => {
    setEditingNote({ ...note });
  };

  const handleSaveNote = async () => {
    await axios.put(`http://localhost:5000/items/${editingNote._id}`, editingNote);
    setEditingNote(null);
    setReload(prev => !prev);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditingNote(prevNote => ({
      ...prevNote,
      [name]: value,
    }));
  };

  return (
    <div className="app-container">
      <h1>📝 QuickNotes</h1>
      <p className="tagline">Capture your thoughts, ideas, and reminders.</p>

      <form onSubmit={handleAddNote}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.name}
          onChange={e => setNewNote({ ...newNote, name: e.target.value }) }
        />
        <textarea
          placeholder="Description"
          value={newNote.description}
          onChange={e => setNewNote({ ...newNote, description: e.target.value })}
        />
        <button type="submit">Add Note</button>
        
      </form>

      <ul>
        {notes.map(note => (
          <li key={note._id}>
 {editingNote && editingNote._id === note._id ? (
  <div className="edit-form">
    <input
      type="text"
      name="name"
      value={editingNote.name}
      onChange={handleInputChange}
      placeholder="Title"
    />
    <textarea
      name="description"
      value={editingNote.description}
      onChange={handleInputChange}
      placeholder="Description"
    />
    <div className="card-actions">
      <button onClick={handleSaveNote}>💾 Save</button>
    </div>
  </div>) : (
              <>
              <div className="note-card">
                <h3>🗒️ {note.name}</h3>
                <p>{note.description}</p>
                
                  <button onClick={() => handleEditNote(note)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteNote(note._id)}>🗑️ Delete</button>
                  </div>
                
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickNotes;
