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
          count1: doc.data().count1 || 0, // Initialize count1 to 0 if not present
          count2: doc.data().count2 || 0, // Initialize count2 to 0 if not present
          count3: doc.data().count3 || 0, // Initialize count3 to 0 if not present
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
          count1: 0,
          count2: 0,
          count3: 0,
          disabled: false,
        });

        // Update students state with the newly added student object
        setStudents([
          ...students,
          { id: newStudentDoc.id, name: newStudentName, count1: 0, count2: 0, count3: 0, disabled: false },
        ]);
        setNewStudentName("");
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleCountChange = async (studentId, field, value, disable = false) => {
    // Update student counts in state and Firestore
    const updatedStudents = students.map((student) =>
      student.id === studentId
        ? { ...student, [field]: Math.max(0, value), disabled: disable }
        : student
    );
    setStudents(updatedStudents);

    // Update student counts in Firestore
    const studentRef = doc(db, "classes", className, "students", studentId);
    try {
      await updateDoc(studentRef, {
        [field]: updatedStudents.find((s) => s.id === studentId)[field],
        disabled: disable,
      });
    } catch (error) {
      console.error("Error updating student counts:", error);
    }
  };

  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const lastTwoDigitsOfYear = year % 100;
  const currentDate = date + "/" + month + "/" + lastTwoDigitsOfYear;

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
      <Link to={`/class/${className}/leaderboard`}>
        <button className="leaderboard-link">Leaderboard</button>
      </Link>
      <div className="student-tiles">
        {students.map((student, index) => {
          const totalScore = student.count1 + student.count2 + student.count3;
          return (
            <div key={student.id} className="student-tile">
              <div className="serial-number">{index + 1}</div>
              <div className="student-name">{student.name}</div>
              <div className="counter-group">
                <div className="input-group">
                  <label className="input-label">Ayath</label>
                  <input
                    type="number"
                    className="count-input"
                    value={student.count1}
                    onChange={(e) => handleCountChange(student.id, "count1", parseInt(e.target.value))}
                    disabled={student.disabled}
                    inputMode="numeric"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Fluency</label>
                  <input
                    type="number"
                    className="count-input"
                    value={student.count2}
                    onChange={(e) => handleCountChange(student.id, "count2", parseInt(e.target.value))}
                    disabled={student.disabled}
                    inputMode="numeric"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Tajweed</label>
                  <input
                    type="number"
                    className="count-input"
                    value={student.count3}
                    onChange={(e) => handleCountChange(student.id, "count3", parseInt(e.target.value))}
                    disabled={student.disabled}
                    inputMode="numeric"
                  />
                </div>
                <span className="total-score">{totalScore}</span>
                <input
                  type="checkbox"
                  className="disable-counter"
                  checked={student.disabled}
                  onChange={() => handleCountChange(student.id, null, null, !student.disabled)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="add-student-modal">
        <p className="add-student-heading">Add New Student</p>
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
