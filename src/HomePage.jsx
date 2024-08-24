import React, { useState,useEffect} from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import { db } from "./firebase";
import { doc, setDoc ,getDocs, collection} from "firebase/firestore";

function HomePage() {
  const [newClassName, setNewClassName] = useState("");
  const [classes, setClasses] = useState([""]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesRef = collection(db, "classes");
        const classesSnap = await getDocs(classesRef);
        const fetchedClasses = classesSnap.docs.map((doc) => ([
          doc.id,
          // ...doc.data(),
        ]));
        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (newClassName.trim() !== "") {
      try {
        // Create a new reference to the "classes" collection
        const classesRef = doc(db, "classes", newClassName);

        setDoc(classesRef, { capital: true }, { merge: true });
        // Update the local state with the new class
        setClasses([...classes, newClassName]);
        setNewClassName("");
      } catch (error) {
        console.error("Error adding class:", error);
        // Handle errors appropriately (e.g., display an error message to the user)
      }
    }
  };
  return (
    <>
      <h1>Madrasathul Manar Chinakkal</h1>
      <h2>QURAN RECITATION TEST</h2>
      <h2>Classes</h2>
      <div className="class-tiles">
        {classes.map((className, index) => (
          <Link key={index} to={`/class/${className}`} className="class-tile">
            {className}
          </Link>
        ))}
      </div>
      <div className="add-class-modal">
        <p className="add-class-heading">Add new class </p>
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter class name"
        />
        <button onClick={handleAddClass}>Add Class</button>
      </div>
    </>
  );
}

export default HomePage;
