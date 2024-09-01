import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
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
          {
            id: newStudentDoc.id,
            name: newStudentName,
            count1: 0,
            count2: 0,
            count3: 0,
            disabled: false,
          },
        ]);
        setNewStudentName("");
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleCountChange = async (
    studentId,
    field,
    value,
    disable = false
  ) => {
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

  // Edit Student Function
  const handleEditStudent = (studentId, studentName) => {
    const newStudentName = prompt("Enter new name:", studentName);
    if (newStudentName && newStudentName !== studentName) {
      const studentRef = doc(db, "classes", className, "students", studentId);
      updateDoc(studentRef, { name: newStudentName })
        .then(() => {
          setStudents(
            students.map((student) =>
              student.id === studentId
                ? { ...student, name: newStudentName }
                : student
            )
          );
        })
        .catch((error) => {
          console.error("Error updating student name:", error);
        });
    }
  };

  // Delete Student Function
  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const studentRef = doc(db, "classes", className, "students", studentId);
      deleteDoc(studentRef)
        .then(() => {
          setStudents(students.filter((student) => student.id !== studentId));
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
        });
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
              <div className="Edit_button" onClick={() => handleEditStudent(student.id, student.name)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                  </svg>
                {/* </button> */}
              </div>
              {/* <div className="Dlt_button" onClick={() => handleDeleteStudent(student.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
           
              </div> */}
              <div className="counter-group">
                <input
                  type="number"
                  className="count-input"
                  value={student.count1}
                  onChange={(e) =>
                    handleCountChange(
                      student.id,
                      "count1",
                      parseInt(e.target.value)
                    )
                  }
                  disabled={student.disabled}
                  inputMode="numeric"
                />
                <input
                  type="number"
                  className="count-input"
                  value={student.count2}
                  onChange={(e) =>
                    handleCountChange(
                      student.id,
                      "count2",
                      parseInt(e.target.value)
                    )
                  }
                  disabled={student.disabled}
                  inputMode="numeric"
                />
                <input
                  type="number"
                  className="count-input"
                  value={student.count3}
                  onChange={(e) =>
                    handleCountChange(
                      student.id,
                      "count3",
                      parseInt(e.target.value)
                    )
                  }
                  disabled={student.disabled}
                  inputMode="numeric"
                />
                <span className="total-score">{totalScore}</span>
                <input
                  type="checkbox"
                  className="disable-counter"
                  checked={student.disabled}
                  onChange={() =>
                    handleCountChange(student.id, null, null, !student.disabled)
                  }
                />
              </div>
            </div>
          );
        })}
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
