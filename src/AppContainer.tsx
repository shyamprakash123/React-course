import React from "react";

export default function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex  p-10 min-h-screen bg-gray-100 items-center">
      {props.children}
    </div>
  );
}
