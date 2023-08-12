import React, { useState } from "react";
import LabelledInput from "./LabelledInput";
const formFields = [
  {
    title: "First Name",
    type: "text",
    value: "",
  },
  {
    title: "Last Name",
    type: "text",
    value: "",
  },
  {
    title: "Email",
    type: "email",
    value: "",
  },
  {
    title: "Date of Birth",
    type: "date",
    value: "",
  },
  {
    title: "Phone Number",
    type: "tel",
    value: "",
  },
];
export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(formFields);
  const [newField, setNewField] = useState("");
  const addField = () => {
    setState([
      ...state,
      {
        title: newField,
        type: "text",
        value: "",
      },
    ]);
    setNewField("");
  };

  const removeField = (id: number) => {
    setState(state.filter((_, idd) => idd !== id));
  };

  const setFieldValue = (updateValue: string, id: number) => {
    const updatedState = [...state];
    updatedState[id].value = updateValue;
    setState(updatedState);
  };

  const clearForm = () => {
    setState([...state].map((field) => ({ ...field, value: "" })));
  };

  return (
    <div className="divide-y-2 divide-dotted">
      <div>
        {state.map((field, id) => (
          <LabelledInput
            key={id}
            id={id}
            title={field.title}
            type={field.type}
            value={field.value}
            removeFieldCB={removeField}
            setFieldValueCB={setFieldValue}
          />
        ))}
      </div>
      <div className="flex pb-3">
        <input
          value={newField}
          onChange={(e) => {
            setNewField(e.target.value);
          }}
          className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          type="text"
        />
        <button
          onClick={addField}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Add Field
        </button>
      </div>
      <div className="flex justify-center items-center">
        <button className="p-2 m-2 w-20 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base">
          Submit
        </button>
        <button
          onClick={() => {
            props.closeFormCB();
          }}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Close Home
        </button>
        <button
          onClick={clearForm}
          className="p-2 m-2  bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
