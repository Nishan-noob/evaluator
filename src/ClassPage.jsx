import React, { useState } from "react";
import { Link ,useParams } from "react-router-dom";
import "./ClassPage.css";

function ClassPage() {
  const { className } = useParams();
  const [newStudentName, setNewStudentName] = useState("");
  const [students, setStudents] = useState([
    "student 1",
    "student 2",
    "student 3",
  ]);
  const [studentCounts, setStudentCounts] = useState(() => {
    // Initialize studentCounts with initial values
    const initialCounts = {};
    students.forEach(
      (student) => (initialCounts[student] = { count: 0, disabled: false })
    );
    return initialCounts;
  });

  const handleAddStudent = () => {
    if (newStudentName.trim() !== "") {
      setStudents([...students, newStudentName]);
      setStudentCounts({ ...studentCounts, [newStudentName]: 0 }); // Initialize count to 0
      setNewStudentName("");
    }
  };

  const handleCountChange = (studentName, delta, disable = false) => {
    setStudentCounts({
      ...studentCounts,
      [studentName]: {
        count: Math.max(0, studentCounts[studentName]?.count + delta || 0),
        disabled: disable,
      },
    });
  };

  return (
    <div className="class-page">
      <h1>Students in {className}</h1>
      <Link to={`/class/${className}/leaderboard`}  >
        <button className="leaderboard-link">Leaderboard</button>{" "}
      </Link>
      <div className="student-tiles">
        {students.map((studentName, index) => (
          <div key={index} className="student-tile">
            <div className="serial-number">
              {index + 1} {/* Use index + 1 for serial numbers */}
            </div>
            <div className="student-name">{studentName}</div>
            <div className="counter-group">
              <button
                onClick={() => handleCountChange(studentName, -1)}
                disabled={studentCounts[studentName]?.disabled}
              >
                -
              </button>
              <span className="counter">
                {studentCounts[studentName] !== undefined
                  ? studentCounts[studentName].count
                  : 0}
              </span>
              <button
                onClick={() => handleCountChange(studentName, 1)}
                disabled={studentCounts[studentName]?.disabled}
              >
                +
              </button>
              <input
                type="checkbox"
                className="disable-counter"
                checked={studentCounts[studentName]?.disabled || false} // Set default disabled state to false
                onChange={() =>
                  handleCountChange(
                    studentName,
                    null,
                    !studentCounts[studentName]?.disabled
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="add-student-modal">
        <p className="add-student-heading">Add New Student </p>
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
