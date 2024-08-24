import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { className } = useParams();
  const [students, setStudents] = useState([]); // Array to store fetched student data

  // Fetch student data on component mount and listen for changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "classes", className, "students");
        const studentDocs = await getDocs(studentsRef);

        const fetchedStudents = studentDocs.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          count: doc.data().count || 0,
        }));

        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();

    // Listen for real-time updates to student data (optional)
    const unsubscribe = onSnapshot(
      collection(db, "classes", className, "students"),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          count: doc.data().count || 0,
        }));
        setStudents(updatedStudents);
      }
    );

    // Cleanup function to unsubscribe from real-time updates on unmount
    return () => unsubscribe();
  }, [className]); // Dependency array ensures fetching happens on class change

  // Sort students by count in ascending order
  const sortedStudents = students.sort((a, b) => a.count - b.count);
  //today's date
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const currentDate = date + "/" + month + "/" + year;

  return (
    <div className="leaderboard-page">
      <h1>QURAN RECITATION TEST</h1>
      <h1>RANK LIST</h1>
      <div className="inline-heading">
        <div className="currentClassTile">
          <span>{className}</span>
        </div>
        <div className="currentDateTile">
          <span>{currentDate}</span>
        </div>
      </div>
      <div className="leaderboard-tiles">
        {/* Heading row */}
        <div className="leaderboard-heading">
          <span className="rank-heading">Rank</span>
          <div className="student-info">
            <span className="name-heading">Name</span>
            <span className="mistakes-heading">Mistakes</span>
          </div>
        </div>
  
        {/* Student tiles */}
        {sortedStudents.map((student, index) => (
          <div key={student.id} className="student-tile">
            <span className="rank">{index + 1}.</span>
            <div className="student-info">
              <span className="student-name">{student.name}</span>
              <span className="student-count">{student.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
