import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Resume from './components/Resume';

const App = () => {
  const [result, setResult] = useState({});

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='/resume' element={<Resume result={result} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
