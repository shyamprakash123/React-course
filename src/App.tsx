import React from 'react';

import './App.css';
import AppContainer from './AppContainer';
import Header from './Header';

function App() {
  const formFields = [
    {
      title: "First Name",
      type: "text"
    },
    {
      title: "Last Name",
      type: "text"
    },
    {
      title: "Email",
      type: "email"
    },
    {
      title: "Date of Birth",
      type: "date"
    },
    {
      title: "Phone Number",
      type: "tel"
    }
  ];
  return (
    <AppContainer>
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header title="Welcome to Lesson 5 of #react-typescript with #tailwindcss" />
        {
          formFields.map((field, id) => (
            <div key={id}>
              <label className='font-semibold'>{field.title}</label>
              <input className='border-2 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2 w-full' type={field.type} required />
            </div>
          ))
        }
        <div className='flex justify-center'>
          <button className='p-2 m-2 w-20 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base'>Submit</button>
        </div>
      </div>

    </AppContainer>
  );
}

export default App;
