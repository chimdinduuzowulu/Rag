import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 p-4 mb-4">
    <ul className="flex space-x-4">
      <li>
        <Link to="/" className="text-white hover:text-gray-300">Quiz</Link>
      </li>
      <li>
        <Link to="/flashcards" className="text-white hover:text-gray-300">Flashcards</Link>
      </li>
      <li>
        <Link to="/progress" className="text-white hover:text-gray-300">Progress</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
