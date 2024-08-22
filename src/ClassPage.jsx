import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ClassPage.css';

function ClassPage() {
  const { className } = useParams();
  const [newStudentName, setNewStudentName] = useState('');
  const [students, setStudents] = useState([]);

  const handleAddStudent = () => {
    if (newStudentName.trim() !== '') {
      setStudents([...students, newStudentName]);
      setNewStudentName('');
    }
  };

  return (
    <div className="class-page">
      <h1>Students in {className}</h1>
      <div className="student-tiles">
        {students.map((studentName, index) => (
          <div key={index} className="student-tile">
            {studentName}
          </div>
        ))}
      </div>
      <div className="add-student-modal">
      <p className='add-student-heading'>Add New Student </p>
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>
    </div>
  );
}

export default ClassPage;