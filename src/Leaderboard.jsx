import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { className } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "classes", className, "students");
        const studentDocs = await getDocs(studentsRef);

        const fetchedStudents = studentDocs.docs.map((doc) => {
          const data = doc.data();
          const count1 = data.count1 || 0;
          const count2 = data.count2 || 0;
          const count3 = data.count3 || 0;
          const total = count1 + count2 + count3;
          return {
            id: doc.id,
            name: data.name,
            count1,
            count2,
            count3,
            total,
          };
        });

        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();

    const unsubscribe = onSnapshot(
      collection(db, "classes", className, "students"),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => {
          const data = doc.data();
          const count1 = data.count1 || 0;
          const count2 = data.count2 || 0;
          const count3 = data.count3 || 0;
          const total = count1 + count2 + count3;
          return {
            id: doc.id,
            name: data.name,
            count1,
            count2,
            count3,
            total,
          };
        });
        setStudents(updatedStudents);
      }
    );

    return () => unsubscribe();
  }, [className]);

  const sortedStudents = students.sort((a, b) => a.total - b.total);
  const finalStudentList = [];
  let preTotal = sortedStudents.length > 0 ? sortedStudents[0].total : 0;
  let prevRank = 1;
  sortedStudents.forEach((student, index) => {
    if (student.total > preTotal) {
      // Increment the rank if the current student's total is greater than the previous total
      prevRank = prevRank + 1;
      preTotal = student.total;
    } // Add the student and their rank to the final student list

    finalStudentList.push([student, prevRank]);
  });

  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const lastTwoDigitsOfYear = year % 100;
  const currentDate = date + "/" + month + "/" + lastTwoDigitsOfYear;

  const leaderboardRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = leaderboardRef.current;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${className}_Leaderboard.pdf`);
    });
  };

  return (
    <div className="container">
      <div className="leaderboard-page" ref={leaderboardRef}>
        <h1 className="h1">QURAN RECITATION TEST</h1>
        <h1 className="h1">RANK LIST</h1>
        <div className="inline-heading">
          <div className="currentClassTile">
            <span>{className}</span>
          </div>
          <div className="currentDateTile">
            <span>{currentDate}</span>
          </div>
        </div>
        <div className="leaderboard-tiles">
          <div className="leaderboard-heading">
            <span className="rank-heading">Rank</span>
            <div className="student-info">
              <span className="name-heading">Name</span>
              <span className="mistakes-heading">Total Mistakes</span>
            </div>
          </div>

          {finalStudentList.map(([student, rank]) => (
            <div key={student.id} className="student-tile">
                  <span className="rank">{rank}.</span>{" "}
              <div className="student-info">
                      <span className="student-name">{student.name}</span>     {" "}
                <span className="student-count">{student.total}</span>   {" "}
              </div>
               {" "}
            </div>
          ))}
        </div>
      </div>
      <button className="pdfbtn" onClick={handleDownloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default Leaderboard;
