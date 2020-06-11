import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const brands = await axios.get('product/brands');
      console.log(brands);
    };
    fetchData();
  }, []);
  return <div className='App'>My App</div>;
}

export default App;
