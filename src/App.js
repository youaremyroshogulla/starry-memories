import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const NASA_API_KEY = "GV3pKuoghLEGVVphnRWQXo1MyKGejRtf3aU9PxBI";

export default function App() {
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [memories, setMemories] = useState(() => {
    return JSON.parse(localStorage.getItem("memories")) || [];
  });

  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    localStorage.setItem("memories", JSON.stringify(memories));
  }, [memories]);

  const fetchAPOD = async () => {
    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`
      );

      const newMemory = {
        id: Date.now(), // Unique ID for deletion
        note,
        date,
        time: new Date().toLocaleTimeString(),
        imageUrl: response.data.url,
      };

      setMemories([...memories, newMemory]);
      setNote("");
    } catch (error) {
      alert("Error fetching image!");
    }
  };

  const deleteMemory = (id, event) => {
    event.stopPropagation(); // Prevent opening modal when deleting
    const updatedMemories = memories.filter((memory) => memory.id !== id);
    setMemories(updatedMemories);
  };

  return (
    <div className={`container ${selectedMemory ? "modal-open" : ""}`}>
      <h1>💖 Starry Memories 💫</h1>

      <div className="input-section">
        <h2>Add a New Memory</h2>
        <label>Write a Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <label>Select a Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchAPOD}>Save Memory</button>
      </div>

      <h2>💌 Saved Memories</h2>
      <div className="gallery">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="memory-card"
            onClick={() => setSelectedMemory(memory)}
          >
            <span
              className="trash-icon"
              onClick={(e) => deleteMemory(memory.id, e)}
            >
              🗑️
            </span>
            <p className="date-time">
              {memory.date} - {memory.time}
            </p>
            <p className="note">"{memory.note}"</p>
            <div className="image-container">
              <img src={memory.imageUrl} alt="NASA APOD" />
            </div>
          </div>
        ))}
      </div>

      {selectedMemory && (
        <div className="modal">
          <img src={selectedMemory.imageUrl} alt="Memory" />
          <h3>
            {selectedMemory.date} - {selectedMemory.time}
          </h3>
          <p>"{selectedMemory.note}"</p>
          <button className="close-btn" onClick={() => setSelectedMemory(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
