import React, { useState, useEffect, useRef } from "react";
import LabelledInput from "./LabelledInput";
import { Link, navigate } from "raviger";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

interface formData {
  title: string;
  key: number;
  formFields: form[];
}

interface form {
  title: string;
  id: number;
  type: string;
  value: string;
}

const initialFormFields: form[] = [
  {
    title: "",
    type: "text",
    value: "",
    id: 1,
  },
];

const initialState: (id: number) => formData = (id: number) => {
  const localForms = getLocalForms();
  const newForm: formData = {
    title: "Untitled Quiz",
    key: localForms.length + 1,
    formFields: initialFormFields,
  };
  if (localForms.length > 0) {
    const updatedForm = localForms.find((form) => form.key === id);
    const upd = updatedForm === undefined ? newForm : updatedForm;
    return upd;
  } else {
    return newForm;
  }
};

const submitFormData = (currentState: formData) => {
  let localForms = getLocalForms();
  let updatedForms = localForms.find((form) => form.key === currentState.key);
  if (updatedForms) {
    saveFormData(currentState);
  } else {
    saveLocalForms([...localForms, currentState]);
  }
};

const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

const saveLocalForms = (localForm: formData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForm));
};

const saveFormData = (currentState: formData) => {
  let localForms = getLocalForms();
  const updatedlocalForms = localForms.map((form) =>
    form.key === currentState.key ? currentState : form
  );
  saveLocalForms(updatedlocalForms);
};

export default function Form(props: { id?: number }) {
  const [state, setState] = useState(() => initialState(props.id!));
  const [newField, setNewField] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [dataType, setDataType] = useState("text");

  useEffect(() => {
    state.key !== props.id && navigate(`/forms/${state.key}`);
  }, [state.key, props.id]);

  useEffect(() => {
    console.log("Component Mounted");
    const oldTitle = document.title;
    document.title = "FormEditor";
    titleRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
      console.log("state saved to local storage");
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);
  const addField = () => {
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        {
          title: newField,
          type: dataType,
          value: "",
          id: state.formFields.length + 1,
        },
      ],
    });
    setNewField("");
  };

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((_, idd) => idd !== id),
    });
  };

  const setFieldValue = (updateValue: string, id: number) => {
    const updatedState = [...state.formFields];
    updatedState[id].title = updateValue;
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const clearForm = () => {
    setState({
      ...state,
      formFields: [...state.formFields].map((field) => ({
        ...field,
        value: "",
      })),
    });
  };

  return (
    <div className="divide-y-2 divide-dotted">
      <div>
        <input
          value={state.title}
          onChange={(e) => {
            setState({ ...state, title: e.target.value });
          }}
          ref={titleRef}
          className="border-2 flex-1 w-full border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          type="text"
        />
        {state.formFields.map((field, id) => (
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
      <div className="flex pb-3 justify-center align-middle content-center">
        <input
          value={newField}
          onChange={(e) => {
            setNewField(e.target.value);
          }}
          className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          type="text"
        />
        <select
          name="type"
          id="type"
          onChange={(e) => {
            setDataType(e.target.value);
          }}
          value={dataType}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="password">Password</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="tel">Tel</option>
        </select>
        <button
          onClick={addField}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Add Field
        </button>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={(_) => {
            submitFormData(state);
          }}
          className="p-2 m-2 w-20 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Submit
        </button>
        <Link
          href={`/`}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Close Form
        </Link>
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
