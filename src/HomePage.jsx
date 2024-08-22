import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

function HomePage() {
  const [newClassName, setNewClassName] = useState('');
  const [classes, setClasses] = useState(['Class 1', 'Class 2']);

  const handleAddClass = () => {
    if (newClassName.trim() !== '') {
      setClasses([...classes, newClassName]);
      setNewClassName('');
    }
  };

  return (
    <>
      <h1>ALMANAR MADRASSA GRADING SYSTEM</h1>
      <h2>Classes</h2>
      <div className="class-tiles">
        {classes.map((className, index) => (
          <Link key={index} to={`/class/${className}`} className='class-tile'>
            {className}
          </Link>
        ))}
      </div>
      <div className="add-class-modal">
        <p className='add-class-heading'>Add new class </p>
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