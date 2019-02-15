import React from 'react';
import { render } from 'react-dom';

/// -----------------------------------------------------------------------------------------------
// page component

function App() {
  return (
    <h1>I&apos;m a happy guy</h1>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

