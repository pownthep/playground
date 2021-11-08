import React from 'react';
import './App.css';
import TagInput from 'rsuite/TagInput';

function App() {
  return (
    <div className='App'>
      <TagInput
        data={[]}
        trigger={['Enter', 'Space', 'Comma']}
        placeholder='Enter, Space, Comma'
        style={{ width: 500 }}
        menuStyle={{ width: 300 }}
        onCreate={(value, item) => {
          console.log(value, item);
        }}
      />
    </div>
  );
}

export default App;
