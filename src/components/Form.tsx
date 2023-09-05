import React, { useState, useEffect, useRef, useReducer } from "react";
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
  let isOptionNotAvailable = currentState.formFields.find((form) => {
    if (form.kind === "dropdown" && form.options.length === 0) {
      return true;
    } else if (form.kind === "multidropdown" && form.options.length === 0) {
      return true;
    } else if (form.kind === "radio" && form.labels.length === 0) {
      return true;
    }
    return false;
  });
  if (isOptionNotAvailable === undefined) {
    const updatedlocalForms = localForms.map((form) =>
      form.key === currentState.key ? currentState : form
    );
    saveLocalForms(updatedlocalForms);
  } else {
    alert(`The type ${isOptionNotAvailable!.kind} option is needed!`);
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
  let isOptionNotAvailable = currentState.formFields.find((form) => {
    if (form.kind === "dropdown" && form.options.length === 0) {
      return true;
    } else if (form.kind === "multidropdown" && form.options.length === 0) {
      return true;
    } else if (form.kind === "radio" && form.labels.length === 0) {
      return true;
    }
    return false;
  });
  if (isOptionNotAvailable === undefined) {
    const updatedlocalForms = localForms.map((form) =>
      form.key === currentState.key ? currentState : form
    );
    saveLocalForms(updatedlocalForms);
  }
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
  callback: () => void;
};

type RemoveAction = {
  type: "remove_field";
  id: number;
};

type UpdateTitleAction = {
  type: "update_title";
  value: string;
};

type UpdateLabelsAction = {
  type: "update_label";
  updateValue: string;
  id: number;
};

type UpdateDropDownAction = {
  type: "update_dropdown";
  id: number;
  options: string[];
};

type UpdateMultiDropDownAction = {
  type: "update_multidropdown";
  id: number;
  options: string[];
};

type UpdateFileAction = {
  type: "update_file";
  id: number;
  type_f: string;
};

type UpdateTextAreaAction = {
  type: "update_textarea";
  id: number;
  cols: string;
  rows: string;
};

type UpdateRadioAction = {
  type: "update_radio";
  id: number;
  labels: string[];
};

type ClearFormAction = {
  type: "clear_form";
};

type FormActions =
  | AddAction
  | RemoveAction
  | UpdateTitleAction
  | UpdateLabelsAction
  | ClearFormAction
  | UpdateDropDownAction
  | UpdateFileAction
  | UpdateMultiDropDownAction
  | UpdateTextAreaAction
  | UpdateRadioAction;

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

const reducer: (state: formData, action: FormActions) => formData = (
  state: formData,
  action: FormActions
) => {
  switch (action.type) {
    case "add_field":
      if (action.label.length > 0) {
        action.callback();
        const field = getNewField(
          action.kind,
          action.label,
          state.formFields.length + 1
        );
        return {
          ...state,
          formFields: [...state.formFields, field],
        };
      } else {
        return state;
      }

    case "remove_field":
      return {
        ...state,
        formFields: state.formFields.filter((form) => form.id !== action.id),
      };

    case "update_title":
      return {
        ...state,
        title: action.value,
      };

    case "update_label":
      const updatedState: form[] = [...state.formFields].map((form) => {
        switch (form.kind) {
          case "text":
            return form.id === action.id
              ? {
                  kind: "text",
                  title: action.updateValue,
                  id: form.id,
                  type: form.type,
                  value: form.value,
                }
              : form;
          case "dropdown":
            return form.id === action.id
              ? {
                  kind: "dropdown",
                  title: action.updateValue,
                  id: form.id,
                  options: form.options,
                  value: form.value,
                }
              : form;

          case "multidropdown":
            return form.id === action.id
              ? {
                  kind: "multidropdown",
                  title: action.updateValue,
                  id: form.id,
                  options: form.options,
                  value: form.value,
                }
              : form;

          case "file":
            return form.id === action.id
              ? {
                  kind: "file",
                  title: action.updateValue,
                  id: form.id,
                  type: form.type,
                  value: form.value,
                }
              : form;

          case "textarea":
            return form.id === action.id
              ? {
                  kind: "textarea",
                  title: action.updateValue,
                  id: form.id,
                  cols: form.cols,
                  rows: form.rows,
                  value: form.value,
                }
              : form;

          case "radio":
            return form.id === action.id
              ? {
                  kind: "radio",
                  title: action.updateValue,
                  id: form.id,
                  labels: form.labels,
                  value: form.value,
                }
              : form;
          default:
            return form;
        }
      });
      return {
        ...state,
        formFields: updatedState,
      };

    case "update_dropdown":
      return {
        ...state,
        formFields: [...state.formFields].map((form) =>
          form.id === action.id
            ? {
                kind: "dropdown",
                title: form.title,
                id: form.id,
                options: action.options,
                value: form.value,
              }
            : form
        ),
      };

    case "update_multidropdown":
      return {
        ...state,
        formFields: [...state.formFields].map((form) =>
          form.id === action.id
            ? {
                kind: "multidropdown",
                title: form.title,
                id: form.id,
                options: action.options,
                value: form.value,
              }
            : form
        ),
      };

    case "update_textarea":
      return {
        ...state,
        formFields: [...state.formFields].map((form) =>
          form.id === action.id
            ? {
                kind: "textarea",
                title: form.title,
                id: form.id,
                cols: action.cols,
                rows: action.rows,
                value: form.value,
              }
            : form
        ),
      };

    case "update_file":
      return {
        ...state,
        formFields: [...state.formFields].map((form) =>
          form.id === action.id
            ? {
                kind: "file",
                title: form.title,
                id: form.id,
                type: action.type_f,
                value: form.value,
              }
            : form
        ),
      };

    case "update_radio":
      return {
        ...state,
        formFields: [...state.formFields].map((form) =>
          form.id === action.id
            ? {
                kind: "radio",
                title: form.title,
                id: form.id,
                labels: action.labels,
                value: form.value,
              }
            : form
        ),
      };

    case "clear_form":
      return {
        ...state,
        formFields: [...state.formFields].map((field) => ({
          ...field,
          title: "",
        })),
      };
  }
};

type ChangeText = {
  type: "change_text";
  value: string;
};

type ClearText = {
  type: "clear_text";
};

type NewFieldActions = ChangeText | ClearText;

const newFieldReducer = (state: string, action: NewFieldActions) => {
  switch (action.type) {
    case "change_text":
      return action.value;

    case "clear_text":
      return "";
  }
};

export default function Form(props: { id?: number }) {
  const [state, dispatchState] = useReducer(reducer, null, () =>
    initialState(props.id!)
  );
  const [newField, dispatch] = useReducer(newFieldReducer, "");
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

  return (
    <div className="divide-y-2 divide-dotted">
      <div>
        <input
          value={state.title}
          onChange={(e) => {
            dispatchState({ type: "update_title", value: e.target.value });
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setOptionsValueCB={(id, options) =>
                    dispatchState({
                      type: "update_dropdown",
                      id: id,
                      options: options,
                    })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setMOptionsValueCB={(id, options) =>
                    dispatchState({
                      type: "update_multidropdown",
                      id: id,
                      options: options,
                    })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setFileOptionsValueCB={(id, type) =>
                    dispatchState({ type: "update_file", id: id, type_f: type })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setTOptionsValueCB={(id, cols, rows) =>
                    dispatchState({
                      type: "update_textarea",
                      id: id,
                      cols: cols,
                      rows: rows,
                    })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
                    dispatchState({ type: "remove_field", id: id })
                  }
                  setROptionsValueCB={(id, labels) =>
                    dispatchState({
                      type: "update_radio",
                      id: id,
                      labels: labels,
                    })
                  }
                  setFieldValueCB={(updateValue, id) =>
                    dispatchState({
                      type: "update_label",
                      updateValue: updateValue,
                      id: id,
                    })
                  }
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
            dispatch({ type: "change_text", value: e.target.value });
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
            dispatchState({
              type: "add_field",
              label: newField,
              kind: dataType as kindTypes,
              callback: () => dispatch({ type: "clear_text" }),
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
          onClick={() => dispatchState({ type: "clear_form" })}
          className="p-2 m-2  bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
