import React, { useState } from "react";

import "./App.css";
import AppContainer from "./AppContainer";
import Header from "./Header";
import Home from "./components/Home";
import Form from "./components/Form";

function App() {
  const [state, setState] = useState("Home");

  const openForm = () => {
    setState("Form");
  };

  const closeForm = () => {
    setState("Home");
  };

  return (
    <AppContainer>
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header title="Welcome to Lesson 5 of #react-typescript with #tailwindcss" />
        {state === "Home" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
