import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [celebrities, setCelebrities] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCelebrityId, setSelectedCelebrityId] = useState(null);

  useEffect(() => {
    // Fetch JSON data
    fetch('celebrities.json')
      .then(response => response.json())
      .then(data => setCelebrities(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value.trim().toLowerCase());
  };

  const filteredCelebrities = celebrities.filter(celebrity =>
    celebrity.first.toLowerCase().includes(searchTerm) || celebrity.last.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (editedCelebrity) => {
    // Implement edit logic here
    console.log(`Edit celebrity with ID: ${editedCelebrity.id}`);
    // Update the celebrity in the state or send it to the server
  };

  const handleDelete = (id) => {
    // Implement delete logic here
    setSelectedCelebrityId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    console.log(`Delete celebrity with ID: ${selectedCelebrityId}`);
    // Perform deletion action
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="App">
      <h1>Celebrity Management System</h1>
      <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
      <div className="user-list">
        {filteredCelebrities.map(celebrity => (
          <UserItem key={celebrity.id} celebrity={celebrity} handleEdit={handleEdit} handleDelete={handleDelete} />
        ))}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmationDialog 
          onConfirm={confirmDelete} 
          onCancel={cancelDelete} 
        />
      )}
    </div>
  );
}

function UserItem({ celebrity, handleEdit, handleDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCelebrity, setEditedCelebrity] = useState({ ...celebrity });

  const toggleDetails = () => {
    setShowDetails(prevState => !prevState);
  };

  const toggleEditMode = () => {
    setIsEditMode(prevState => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCelebrity(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    handleEdit(editedCelebrity);
    toggleEditMode();
  };

  return (
    <div className="user-item">
      <div className="user-header" onClick={toggleDetails}>
        <img
          className="user-photo"
          src={celebrity.picture}
          alt={`${celebrity.first} ${celebrity.last}`}
        />
        <span>{`${celebrity.first} ${celebrity.last}`}</span>
        <span className="toggle-icon">{showDetails ? '-' : '+'}</span>
      </div>
      {showDetails && (
        <div className="user-details">
          {isEditMode ? (
            <div>
              <p><label>Email:</label> <input type="text" name="email" value={editedCelebrity.email} onChange={handleChange} /></p>
              <p><label>Gender:</label> <input type="text" name="gender" value={editedCelebrity.gender} onChange={handleChange} /></p>
              <p><label>Country:</label> <input type="text" name="country" value={editedCelebrity.country} onChange={handleChange} /></p>
              <p><label>Description:</label> <textarea name="description" value={editedCelebrity.description} onChange={handleChange} /></p>
              <div className="user-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={toggleEditMode}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p><label>Email:</label> {celebrity.email}</p>
              <p><label>Gender:</label> {celebrity.gender}</p>
              <p><label>Country:</label> {celebrity.country}</p>
              <p><label>Description:</label> {celebrity.description}</p>
              <div className="user-actions">
                <button onClick={toggleEditMode}>Edit</button>
                <button onClick={() => handleDelete(celebrity.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeleteConfirmationDialog({ onConfirm, onCancel }) {
  return (
    <div className="delete-confirmation-dialog">
      <p>Are you sure you want to delete this celebrity?</p>
      <div>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}

function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default App;
