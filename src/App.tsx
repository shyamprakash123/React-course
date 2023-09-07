import React, { useEffect, useState } from "react";

import "./App.css";
import AppRouter from "./router/AppRouter";
import { me } from "./components/utils/apiUtils";
import { User } from "./types/userTypes";
const getCurrentUser = async (setCurrentUser: (currentUser: User) => void) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
};
function App() {
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  return <AppRouter currentUser={currentUser} />;
}

export default App;
