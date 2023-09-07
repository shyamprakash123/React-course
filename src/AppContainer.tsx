import React from "react";
import Header from "./Header";
import { User } from "./types/userTypes";

export default function AppContainer(props: {
  currentUser: User;
  children: React.ReactNode;
}) {
  return (
    <div className="flex  p-10 min-h-screen bg-gray-100 items-center">
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl min-w-[35%]">
        <Header currentUser={props.currentUser} />
        {props.children}
      </div>
    </div>
  );
}
