import React from "react";

export default function LabelledInput(props: {
  id: number;
  title: string;
  type: string;
  value: string;
  removeFieldCB: (id: number) => void;
  setFieldValueCB: (updateValue: string, id: number) => void;
}) {
  return (
    <div>
      <label className="font-semibold">{props.title}</label>
      <div className="flex gap-2">
        <input
          className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          value={props.value}
          onChange={(e) => {
            props.setFieldValueCB(e.target.value, props.id);
          }}
          type={props.type}
        />
        <button
          onClick={() => props.removeFieldCB(props.id)}
          className="p-2 mt-2 mb-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Remove
        </button>
        <button
          onClick={() => props.setFieldValueCB("", props.id)}
          className="p-2 mt-2 mb-2  bg-red-300 rounded-xl hover:bg-red-400 text-white font-bold text-base"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
