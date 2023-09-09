import React from "react";

export default function RadioInput(props: {
  id: number;
  title: string;
  labels: {};
  value: string;
  setFieldValueCB: (updateValue: string, id: number) => void;
  removeFieldCB: (id: number) => void;
  setROptionsValueCB: (id: number, labels: string) => void;
}) {
  return (
    <div>
      <label className="font-semibold">{`Question No ${props.id} : `}</label>
      <div className="flex gap-2">
        <div className="flex flex-col w-full">
          <input
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            value={props.title}
            placeholder="Enter Your Question Here"
            onChange={(e) => {
              props.setFieldValueCB(e.target.value, props.id);
            }}
            type="text"
          />
          <label className="font-semibold">{`Options for QNo ${props.id} : `}</label>
          <input
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            value={props.labels.toString()}
            placeholder="Enter Your Options separated with commas (,)"
            onChange={(e) => {
              props.setROptionsValueCB(props.id, e.target.value);
            }}
            type="text"
          />
        </div>
        <button
          onClick={() => props.removeFieldCB(props.id)}
          className="p-2 mt-2 mb-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Remove
        </button>
        <button
          onClick={() => props.setFieldValueCB("", props.id)}
          className="p-2 mt-2 mb-2  bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
