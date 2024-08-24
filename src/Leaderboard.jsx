import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf"; // Make sure this import is uncommented
import html2canvas from "html2canvas";
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

  // Today's date
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const lastTwoDigitsOfYear = year % 100;
  const currentDate = date + "/" + month + "/" + lastTwoDigitsOfYear;

  const leaderboardRef = useRef(null); // Reference to the leaderboard container

  const handleDownloadPDF = () => {
    const input = leaderboardRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${className}_Leaderboard.pdf`);
    });
  };

  return (
    <div className="container">
      <div className="leaderboard-page" ref={leaderboardRef}>
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
        <button className="pdfbtn" onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default Leaderboard;
