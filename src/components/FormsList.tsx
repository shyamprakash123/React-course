import React from "react";
interface forms {
  title: string;
  deleteCB: (title: string) => void;
  editCB: (title: string) => void;
}
export default function FormsList(props: forms) {
  return (
    <div className="w-full mt-4 rounded-md flex bg-blue-300 hover:bg-blue-500 gap-3 justify-center items-center">
      <p className="text-white font-bold flex-1 ml-2">{props.title}</p>
      <button
        onClick={() => {
          props.editCB(props.title);
        }}
        className="pl-5 pr-5 pt-2 pb-2 mt-2 mb-2 bg-orange-500 rounded-xl hover:bg-orange-600 text-white font-bold text-base"
      >
        Edit
      </button>
      <button
        onClick={() => {
          props.deleteCB(props.title);
        }}
        className="p-2 mt-2 mb-2 mr-2 bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
      >
        Delete
      </button>
    </div>
  );
}
