import React, { useState, useEffect, useRef } from "react";
import LabelledInput from "./LabelledInput";
import FormsList from "./FormsList";
interface formData {
  title: string;
  formFields: form[];
}

interface form {
  title: string;
  type: string;
  value: string;
}

const initialFormFields: form[] = [
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

const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

const initialState: () => formData = () => {
  const localForms = getLocalForms();
  if (localForms.length > 0) {
    return localForms[0];
  }
  const newForm = {
    title: "Untitled Form",
    formFields: initialFormFields,
  };
  saveLocalForms([newForm]);
  return newForm;
};

const saveLocalForms = (localForm: formData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForm));
};

const saveFormData = (currentState: formData) => {
  let localForms = getLocalForms();
  const updatedForms = localForms.map((form) =>
    form.title === currentState.title ? currentState : form
  );
  saveLocalForms(updatedForms);
};

export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(() => initialState());
  const [newField, setNewField] = useState("");
  const [fieldList, setFieldList] = useState(getLocalForms());
  const titleRef = useRef<HTMLInputElement>(null);

  const submitFormData = (currentState: formData) => {
    let localForms = getLocalForms();
    let updatedForms: formData[] = [];
    const elementExist = localForms.find(
      (element) => element.title === currentState.title
    );
    if (elementExist) {
      updatedForms = localForms.map((form) =>
        form.title === currentState.title ? currentState : form
      );
    } else {
      updatedForms = [...localForms, currentState];
    }

    // console.log(JSON.stringify(updatedForms));
    saveLocalForms(updatedForms);
    setFieldList(updatedForms);
  };

  const deleteFieldList = (title: string) => {
    let localForms = getLocalForms();
    const updatedForms = localForms.filter((form) => form.title !== title);
    saveLocalForms(updatedForms);
    setFieldList(updatedForms);
  };

  const editField = (title: string) => {
    const updatedForm = [...fieldList].filter((form) => form.title === title);
    setState(updatedForm[0]);
  };

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
          type: "text",
          value: "",
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
    saveFormData(state);
  };

  const setFieldValue = (updateValue: string, id: number) => {
    const updatedState = [...state.formFields];
    updatedState[id].value = updateValue;
    setState({
      ...state,
      formFields: updatedState,
    });
    saveFormData(state);
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
      <div className="flex flex-col justify-center w-full mb-5 items-center">
        <p className="bg-gray-300 w-fit text-gray-800 font-bold py-2 px-4 rounded-lg text-lg text-center">
          Available Forms
        </p>
        {fieldList.map((ele, indx) => (
          <FormsList
            key={indx}
            title={ele.title}
            deleteCB={deleteFieldList}
            editCB={editField}
          />
        ))}
      </div>
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
        <button
          onClick={(_) => {
            submitFormData(state);
          }}
          className="p-2 m-2 w-20 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
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
