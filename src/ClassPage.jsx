import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import "./ClassPage.css";

function ClassPage() {
  const { className } = useParams();
  const [students, setStudents] = useState([]); // Empty array to store student objects
  const [newStudentName, setNewStudentName] = useState("");

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "classes", className, "students");
        const studentDocs = await getDocs(studentsRef);

        const fetchedStudents = studentDocs.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          count: doc.data().count || 0, // Initialize count to 0 if not present
          disabled: doc.data().disabled || false, // Initialize disabled to false if not present
        }));

        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [className]); // Dependency array ensures fetching happens on class change

  const handleAddStudent = async () => {
    if (newStudentName.trim() !== "") {
      try {
        const studentsRef = collection(db, "classes", className, "students");
        const newStudentDoc = await addDoc(studentsRef, {
          name: newStudentName,
          count: 0,
          disabled: false,
        });

        // Update students state with the newly added student object
        setStudents([...students, { id: newStudentDoc.id, name: newStudentName, count: 0, disabled: false }]);
        setNewStudentName("");
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleCountChange = async (studentId, delta, disable = false) => {
    // Update student count in state and Firestore
    const updatedStudents = students.map((student) =>
      student.id === studentId
        ? { ...student, count: Math.max(0, student.count + delta), disabled: disable }
        : student
    );
    setStudents(updatedStudents);

    // Update student count in Firestore
    const studentRef = doc(db, "classes", className, "students", studentId);
    try {
      await updateDoc(studentRef, { count: updatedStudents.find((s) => s.id === studentId).count , disabled: disable });
    } catch (error) {
      console.error("Error updating student count:", error);
      // Consider showing an error message to the user
    }
  };
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const currentDate = date + "/" + month + "/" + year;

  return (
    <div className="class-page">
      <h1>Madrasathul Manar Chinakkal</h1>
      <h2>QURAN RECITATION TEST</h2>
      <div className="inline-heading">
        <div className="currentClassTile">
          <span>{className}</span>
        </div>
        <div className="currentDateTile">
          <span>{currentDate}</span>
        </div>
      </div>
      {/* <h1>Students in {className}</h1> */}
      <Link to={`/class/${className}/leaderboard`}>
        <button className="leaderboard-link">Leaderboard</button>
      </Link>
      <div className="student-tiles">
        {students.map((student, index) => (
          <div key={student.id} className="student-tile">
            <div className="serial-number">{index + 1}</div> {/* Use student.id for uniqueness */}
            <div className="student-name">{student.name}</div>
            <div className="counter-group">
              <button
                onClick={() => handleCountChange(student.id, -1)}
                disabled={student.disabled}
              >
                -
              </button>
              <span className="counter">{student.count}</span>
              <button
                onClick={() => handleCountChange(student.id, 1)}
                disabled={student.disabled}
              >
                +
              </button>
              <input
                type="checkbox"
                className="disable-counter"
                checked={student.disabled}
                onChange={() => handleCountChange(student.id, null, !student.disabled)}
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