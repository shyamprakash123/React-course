import React, { useState, useEffect, useRef } from "react";
import LabelledInput from "./LabelledInput";
import { Link, navigate } from "raviger";
import { form, formData, textFieldTypes } from "../types/FormTypes";
import DropDownInput from "./DropDownInput";
import RadioInput from "./RadioInput";
import MultiDropDownInput from "./MultiDropDownInput";
import TextAreaInput from "./TextAreaInput";
import FileInputField from "./FileInputField";

const initialFormFields: form[] = [
  {
    kind: "text",
    title: "",
    type: "text",
    value: "",
    id: 1,
  },
  {
    kind: "dropdown",
    title: "",
    options: ["Low", "High"],
    value: "",
    id: 2,
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

type kindTypes =
  | "text"
  | "textarea"
  | "dropdown"
  | "multidropdown"
  | "radio"
  | "file";

type AddAction = {
  type: "add_field";
  label: string;
  kind: kindTypes;
};

type RemoveAction = {
  type: "remove_field";
  id: number;
};

type FormActions = AddAction | RemoveAction;

const getNewField: (dataType: string, newField: string, id: number) => form = (
  dataType: string,
  newField: string,
  id: number
) => {
  if (dataType === "dropdown") {
    return {
      kind: "dropdown",
      title: newField,
      options: [],
      value: "",
      id: id,
    };
  } else if (dataType === "radio") {
    return {
      kind: "radio",
      title: newField,
      labels: [],
      value: "",
      id: id,
    };
  } else if (dataType === "multidropdown") {
    return {
      kind: "multidropdown",
      title: newField,
      options: [],
      value: "",
      id: id,
    };
  } else if (dataType === "file") {
    return {
      kind: "file",
      title: newField,
      type: "",
      value: "",
      id: id,
    };
  } else if (dataType === "textarea") {
    return {
      kind: "textarea",
      title: newField,
      cols: "",
      rows: "",
      value: "",
      id: id,
    };
  } else {
    return {
      kind: "text",
      title: newField,
      type: dataType as textFieldTypes,
      value: "",
      id: id,
    };
  }
};

const reducer = (state: formData, action: FormActions) => {
  switch (action.type) {
    case "add_field":
      const field = getNewField(
        action.kind,
        action.label,
        state.formFields.length + 1
      );
      return {
        ...state,
        formFields: [...state.formFields, field],
      };

    case "remove_field":
      return {
        ...state,
        formFields: state.formFields.filter((form) => form.id !== action.id),
      };
  }
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

  const dispatchAction = (action: FormActions) => {
    setState((prevState) => {
      return reducer(prevState, action);
    });
  };

  // const addField = () => {
  //   if (dataType === "dropdown") {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "dropdown",
  //           title: newField,
  //           options: [],
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   } else if (dataType === "radio") {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "radio",
  //           title: newField,
  //           labels: [],
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   } else if (dataType === "multidropdown") {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "multidropdown",
  //           title: newField,
  //           options: [],
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   } else if (dataType === "file") {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "file",
  //           title: newField,
  //           type: "",
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   } else if (dataType === "textarea") {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "textarea",
  //           title: newField,
  //           cols: "",
  //           rows: "",
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   } else {
  //     setState({
  //       ...state,
  //       formFields: [
  //         ...state.formFields,
  //         {
  //           kind: "text",
  //           title: newField,
  //           type: dataType as textFieldTypes,
  //           value: "",
  //           id: state.formFields.length + 1,
  //         },
  //       ],
  //     });
  //   }
  //   setNewField("");
  // };

  // const removeField = (id: number) => {
  //   setState({
  //     ...state,
  //     formFields: state.formFields.filter((form) => form.id !== id),
  //   });
  // };

  const setFieldValue = (updateValue: string, id: number) => {
    const updatedState: form[] = [...state.formFields].map((form) => {
      switch (form.kind) {
        case "text":
          return form.id === id
            ? {
                kind: "text",
                title: updateValue,
                id: form.id,
                type: form.type,
                value: form.value,
              }
            : form;
        case "dropdown":
          return form.id === id
            ? {
                kind: "dropdown",
                title: updateValue,
                id: form.id,
                options: form.options,
                value: form.value,
              }
            : form;

        case "multidropdown":
          return form.id === id
            ? {
                kind: "multidropdown",
                title: updateValue,
                id: form.id,
                options: form.options,
                value: form.value,
              }
            : form;

        case "file":
          return form.id === id
            ? {
                kind: "file",
                title: updateValue,
                id: form.id,
                type: form.type,
                value: form.value,
              }
            : form;

        case "textarea":
          return form.id === id
            ? {
                kind: "textarea",
                title: updateValue,
                id: form.id,
                cols: form.cols,
                rows: form.rows,
                value: form.value,
              }
            : form;

        case "radio":
          return form.id === id
            ? {
                kind: "radio",
                title: updateValue,
                id: form.id,
                labels: form.labels,
                value: form.value,
              }
            : form;
        default:
          return form;
      }
    });
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const setOptionsValue = (id: number, options: string[]) => {
    const updatedState: form[] = [...state.formFields].map((form) =>
      form.id === id
        ? {
            kind: "dropdown",
            title: form.title,
            id: form.id,
            options: options,
            value: form.value,
          }
        : form
    );
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const setFileOptionsValue = (id: number, type: string) => {
    const updatedState: form[] = [...state.formFields].map((form) =>
      form.id === id
        ? {
            kind: "file",
            title: form.title,
            id: form.id,
            type: type,
            value: form.value,
          }
        : form
    );
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const setMOptionsValue = (id: number, options: string[]) => {
    const updatedState: form[] = [...state.formFields].map((form) =>
      form.id === id
        ? {
            kind: "multidropdown",
            title: form.title,
            id: form.id,
            options: options,
            value: form.value,
          }
        : form
    );
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const setTOptionsValue = (id: number, cols: string, rows: string) => {
    const updatedState: form[] = [...state.formFields].map((form) =>
      form.id === id
        ? {
            kind: "textarea",
            title: form.title,
            id: form.id,
            cols: cols,
            rows: rows,
            value: form.value,
          }
        : form
    );
    setState({
      ...state,
      formFields: updatedState,
    });
  };

  const setROptionsValue = (id: number, labels: string[]) => {
    const updatedState: form[] = [...state.formFields].map((form) =>
      form.id === id
        ? {
            kind: "radio",
            title: form.title,
            id: form.id,
            labels: labels,
            value: form.value,
          }
        : form
    );
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
        title: "",
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
        {state.formFields.map((field, id) => {
          switch (field.kind) {
            case "text":
              return (
                <LabelledInput
                  key={id}
                  id={field.id}
                  title={field.title}
                  type={field.type}
                  value={field.value}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setFieldValueCB={setFieldValue}
                />
              );

            case "dropdown":
              return (
                <DropDownInput
                  key={id}
                  id={field.id}
                  title={field.title}
                  options={field.options}
                  value={field.value}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setOptionsValueCB={setOptionsValue}
                  setFieldValueCB={setFieldValue}
                />
              );

            case "multidropdown":
              return (
                <MultiDropDownInput
                  key={id}
                  id={field.id}
                  title={field.title}
                  options={field.options}
                  value={field.value}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setMOptionsValueCB={setMOptionsValue}
                  setFieldValueCB={setFieldValue}
                />
              );

            case "file":
              return (
                <FileInputField
                  key={id}
                  id={field.id}
                  title={field.title}
                  value={field.value}
                  type={field.type}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setFileOptionsValueCB={setFileOptionsValue}
                  setFieldValueCB={setFieldValue}
                />
              );

            case "textarea":
              return (
                <TextAreaInput
                  key={id}
                  id={field.id}
                  title={field.title}
                  value={field.value}
                  cols={field.cols}
                  rows={field.rows}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setTOptionsValueCB={setTOptionsValue}
                  setFieldValueCB={setFieldValue}
                />
              );

            case "radio":
              return (
                <RadioInput
                  key={id}
                  id={field.id}
                  title={field.title}
                  labels={field.labels}
                  value={field.value}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "remove_field", id: id })
                  }
                  setROptionsValueCB={setROptionsValue}
                  setFieldValueCB={setFieldValue}
                />
              );

            default:
              return <div></div>;
          }
        })}
      </div>
      <div className="flex flex-1 pb-3 justify-center align-middle content-center">
        <input
          value={newField}
          placeholder="Enter New Question Here"
          onChange={(e) => {
            setNewField(e.target.value);
          }}
          className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          type="text"
        />
        <select
          className="border-2 border-gray-200 focus:border-sky-500 rounded-lg p-2 m-2"
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
          <option value="dropdown">Drop Down</option>
          <option value="multidropdown">Multi Drop Down</option>
          <option value="textarea">Text Area</option>
          <option value="radio">Radio Field</option>
          <option value="file">File Field</option>
        </select>
        <button
          onClick={(_) =>
            dispatchAction({
              type: "add_field",
              label: newField,
              kind: dataType as kindTypes,
            })
          }
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
