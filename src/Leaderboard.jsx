import React from 'react';
import { useParams } from 'react-router-dom';


const Leaderboard = () => {

  const { className } = useParams(); // Access the className from the URL

  // Assuming you have a way to fetch student data from the backend
  const studentData = [
    { name: 'Student A', count: 10 },
    { name: 'Student B', count: 5 },
    { name: 'Student C', count: 8 },
    // ... more student data
  ];

  // Sort student data by count in descending order
  const sortedStudents = studentData.sort((a, b) => b.count - a.count);

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard for {className}</h1>
      <ul>
        {sortedStudents.map((student, index) => (
          <li key={index}>
            {index + 1}. {student.name} - {student.count}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default Leaderboard