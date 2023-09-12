/* eslint-disable jsx-a11y/no-access-key */
import React, { useState, useEffect, useRef, useReducer } from "react";
import LabelledInput from "./LabelledInput";
import { Link, navigate } from "raviger";
import { FormField, kindTypes } from "../types/FormTypes";
import DropDownInput from "./DropDownInput";
import RadioInput from "./RadioInput";
import {
  createFormField,
  deleteFormField,
  listFormFields,
  listFormsID,
  me,
  updateForm,
  updateFormField,
} from "./utils/apiUtils";

type FormData = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

type AddAction = {
  type: "add_field";
  data: FormField;
};

type UpdateLabelsAction = {
  type: "update_label";
  updateValue: string;
  id: number;
  kind: kindTypes;
};

type UpdateOptionsAction = {
  type: "update_options";
  id: number;
  options: { options: string };
};

type FetchAction = {
  type: "Fetch";
  data: FormField[];
};

type DeleteFieldAction = {
  type: "DeleteField";
  id: number;
};

type ClearFields = {
  type: "ClearField";
  id?: number;
};

type FormActions =
  | AddAction
  | FetchAction
  | DeleteFieldAction
  | UpdateLabelsAction
  | UpdateOptionsAction
  | ClearFields;

type FetchTitleAction = {
  type: "FetchTitle";
  data: FormData;
};

type UpdateFormAction = {
  type: "UpdateForm";
  data: FormData;
};

type UpdateFormTitleAction = {
  type: "UpdateTitle";
  title: string;
};

type TitleActions = FetchTitleAction | UpdateFormTitleAction | UpdateFormAction;

const getCurrentUser = async () => {
  const currentUser = await me();
  if (currentUser?.username.length === 0) {
    navigate("/Unauthenticated");
  }
};

const add_field = async (
  dispatchState: (format: FormActions) => void,
  id: number,
  label: string,
  kind: kindTypes,
  options: string,
  clearCB: () => void
) => {
  if (label.length > 0 && kind.length > 0) {
    if (kind === "DROPDOWN" || kind === "RADIO") {
      if (options.length > 0) {
        const data = {
          label: label,
          kind: kind,
          options: { options },
        };
        try {
          const field = await createFormField(id, data);
          dispatchState({ type: "add_field", data: field });
          clearCB();
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Options are needed for dropdown or radio fields");
      }
    } else {
      const data = {
        label: label,
        kind: kind,
        options: { options },
      };
      try {
        const field = await createFormField(id, data);
        dispatchState({ type: "add_field", data: field });
        clearCB();
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    alert("Inputs are required!");
  }
};

const updateField = async (
  dispatchForm: (format: TitleActions) => void,
  id: number,
  title: string,
  description: string,
  is_public: boolean
) => {
  if (title.length > 0) {
    const form = {
      title: title,
      description: description,
      is_public: is_public,
    };
    try {
      const formData = await updateForm(id, form);
      dispatchForm({ type: "UpdateForm", data: formData });
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("Title is a mandatory field!");
  }
};

const reducer: (state: FormField[], action: FormActions) => FormField[] = (
  state,
  action
) => {
  switch (action.type) {
    case "add_field":
      return [...state, action.data];

    case "DeleteField":
      return state.filter((field) => field.id !== action.id);

    case "update_label":
      return state.map((field) => {
        return field.id === action.id
          ? {
              id: field.id,
              label: action.updateValue,
              kind: field.kind,
              options: field.options!,
              value: field.value,
              meta: field.meta,
            }
          : field;
      });

    case "update_options":
      return state.map((field) => {
        return field.id === action.id
          ? {
              id: field.id,
              label: field.label,
              kind: field.kind,
              options: action.options,
              value: field.value,
              meta: field.meta,
            }
          : field;
      });

    case "Fetch":
      return action.data;

    case "ClearField":
      return action.id
        ? state.map((field) => {
            return field.id === action.id
              ? {
                  id: field.id,
                  label: "",
                  kind: field.kind,
                  options: { options: "" },
                  value: field.value,
                  meta: field.meta,
                }
              : field;
          })
        : state.map((field) => {
            return {
              id: field.id,
              label: "",
              kind: field.kind,
              options: { options: "" },
              value: field.value,
              meta: field.meta,
            };
          });
  }
};

const titleReducer: (state: FormData, action: TitleActions) => FormData = (
  state: FormData,
  action: TitleActions
) => {
  switch (action.type) {
    case "FetchTitle":
      return action.data;

    case "UpdateTitle":
      return {
        ...state,
        title: action.title,
      };

    case "UpdateForm":
      return action.data;
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

const initialState = async (
  dispatchState: (format: FetchAction) => void,
  dispatchForm: (format: FetchTitleAction) => void,
  id: number
) => {
  const formFields = await listFormFields(id);
  dispatchState({ type: "Fetch", data: formFields.results });
  const form = await listFormsID(id);
  dispatchForm({ type: "FetchTitle", data: form });
};

export default function Form(props: { id?: number }) {
  const initialFormField = [
    {
      id: 1,
      label: "",
      kind: "TEXT" as kindTypes,
      options: { options: "" },
      value: "",
      meta: {},
    },
  ];
  const initialForm = {
    id: 1,
    title: "",
    description: "",
    is_public: false,
  };
  const [state, dispatchState] = useReducer(reducer, initialFormField);
  const [FormData, dispatchForm] = useReducer(titleReducer, initialForm);
  const [newField, dispatch] = useReducer(newFieldReducer, "");
  const [options, setOptions] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [dataType, setDataType] = useState("TEXT");

  useEffect(() => {
    getCurrentUser();
    console.log("Component Mounted");
    const oldTitle = document.title;
    document.title = "FormEditor";
    titleRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    initialState(dispatchState, dispatchForm, props.id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveForm = () => {
    updateField(
      dispatchForm,
      props.id!,
      FormData.title,
      FormData.description!,
      FormData.is_public!
    );
    state.forEach(async (form) => {
      try {
        if (form.label.length > 0) {
          await updateFormField(props.id!, form);
        } else {
          alert("Labels are mandatory fields");
          throw Error("Labels are mandatory fields");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div>
      <div>
        <label className="font-semibold">Title:</label>
        <input
          value={FormData.title}
          onChange={(e) => {
            dispatchForm({ type: "UpdateTitle", title: e.target.value });
          }}
          ref={titleRef}
          className="border-2 flex-1 w-full border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
          type="text"
        />
        <label className="font-semibold">Description:</label>
        <div className="flex">
          <input
            value={FormData.description}
            onChange={(e) => {
              updateField(
                dispatchForm,
                props.id!,
                FormData.title,
                e.target.value,
                FormData.is_public!
              );
            }}
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            type="text"
          />
          <input
            checked={FormData.is_public}
            onChange={(e) => {
              updateField(
                dispatchForm,
                props.id!,
                FormData.title,
                FormData.description!,
                e.target.checked
              );
            }}
            className="border-2 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            type="checkbox"
          />
          <label className="font-semibold pt-3">Is Public</label>
        </div>
        {state.length > 0 ? (
          state.map((field: FormField, idx: number) => {
            switch (field.kind) {
              case "TEXT":
                return (
                  <LabelledInput
                    key={idx}
                    id={field.id!}
                    title={field.label}
                    value={field.value!}
                    removeFieldCB={async (id) => {
                      try {
                        const res = await deleteFormField(props.id!, id);
                        if (res) {
                          dispatchState({ type: "DeleteField", id: id });
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    setFieldValueCB={(updateValue, id) =>
                      dispatchState({
                        type: "update_label",
                        updateValue: updateValue,
                        id: id,
                        kind: field.kind,
                      })
                    }
                  />
                );

              case "DROPDOWN":
                return (
                  <DropDownInput
                    key={idx}
                    id={field.id!}
                    title={field.label}
                    options={field.options!.options}
                    value={field.value!}
                    removeFieldCB={async (id) => {
                      try {
                        const res = await deleteFormField(props.id!, id);
                        if (res) {
                          dispatchState({ type: "DeleteField", id: id });
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    setOptionsValueCB={(id, options) =>
                      dispatchState({
                        type: "update_options",
                        options: { options: options },
                        id: id,
                      })
                    }
                    setFieldValueCB={(updateValue, id) =>
                      dispatchState({
                        type: "update_label",
                        updateValue: updateValue,
                        id: id,
                        kind: field.kind,
                      })
                    }
                  />
                );

              case "RADIO":
                return (
                  <RadioInput
                    key={idx}
                    id={field.id!}
                    title={field.label}
                    labels={field.options!.options}
                    value={field.value!}
                    removeFieldCB={async (id) => {
                      try {
                        const res = await deleteFormField(props.id!, id);
                        if (res) {
                          dispatchState({ type: "DeleteField", id: id });
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    setROptionsValueCB={(id, labels) =>
                      dispatchState({
                        type: "update_options",
                        options: { options: labels },
                        id: id,
                      })
                    }
                    setFieldValueCB={(updateValue, id) =>
                      dispatchState({
                        type: "update_label",
                        updateValue: updateValue,
                        id: id,
                        kind: field.kind,
                      })
                    }
                  />
                );

              default:
                return <div></div>;
            }
          })
        ) : (
          <h1>No Fields Available</h1>
        )}
      </div>
      <div className="flex flex-1 justify-center align-middle content-center">
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
          <option value="TEXT">Text</option>
          <option value="DROPDOWN">Drop Down</option>
          <option value="RADIO">Radio Field</option>
        </select>
        <button
          onClick={(_) => {
            add_field(
              dispatchState,
              props.id!,
              newField,
              dataType as kindTypes,
              options,
              () => {
                dispatch({ type: "clear_text" });
                setOptions("");
                setDataType("");
              }
            );
          }}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Add Field
        </button>
      </div>
      {dataType === "DROPDOWN" || dataType === "RADIO" ? (
        <div className="flex flex-1 pb-3 justify-center align-middle content-center">
          <input
            value={options}
            placeholder="Enter Options separated by commas Here..."
            onChange={(e) => {
              setOptions(e.target.value);
            }}
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            type="text"
          />
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center items-center">
        <button
          accessKey="s"
          onClick={(_) => {
            saveForm();
          }}
          className="p-2 m-2 w-20 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Submit
        </button>
        <Link
          accessKey="c"
          href={`/`}
          className="p-2 m-2  bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
        >
          Close Form
        </Link>
        <button
          onClick={() => dispatchState({ type: "ClearField" })}
          className="p-2 m-2  bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
