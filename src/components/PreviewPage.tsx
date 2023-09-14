/* eslint-disable jsx-a11y/no-access-key */
import React, { useEffect, useReducer, useRef } from "react";
import Result from "./Result";
import { navigate } from "raviger";
import {
  listFormFields,
  listFormsID,
  listsubmittedForms,
  me,
  submitForm,
} from "./utils/apiUtils";
import {
  Answer,
  Form,
  FormField,
  Submission,
  kindTypes,
} from "../types/FormTypes";

const getCurrentUser = async () => {
  const currentUser = await me();
  if (currentUser?.username.length === 0) {
    navigate("/Unauthenticated");
  }
};

type fetchQuiz = {
  type: "fetchquiz";
  current: Submission;
};

type fetchFields = {
  type: "fetchfields";
  current: FormField[];
};

type PreviewQuizActions = fetchQuiz;

type FieldActions = fetchFields;

const quizReducer: (
  state: Submission,
  action: PreviewQuizActions
) => Submission = (state: Submission, action: PreviewQuizActions) => {
  switch (action.type) {
    case "fetchquiz":
      return action.current;
  }
};

const fieldReducer: (
  state: FormField[],
  action: FieldActions
) => FormField[] = (state: FormField[], action: FieldActions) => {
  switch (action.type) {
    case "fetchfields":
      return action.current;
  }
};

type ClearQuestion = {
  type: "clearquestion";
};

type SetNextQuiz = {
  type: "nextquiz";
  quiz: FormField[];
  saved: Answer[];
};

type SetPrevQuiz = {
  type: "prevquiz";
  quiz: FormField[];
  saved: Answer[];
};

type UpdateQuizValue = {
  type: "updateValue";
  value: string;
};

type fetchQuizs = {
  type: "FetchQuiz";
  quiz: FormField;
};

type currentQuizAction =
  | ClearQuestion
  | SetNextQuiz
  | SetPrevQuiz
  | UpdateQuizValue
  | fetchQuizs;

type setQuiz = {
  type: "setquiz";
};

type setResult = {
  type: "setresult";
};

type setQuizs = {
  type: "setquizs";
};

type displayAction = setQuiz | setResult | setQuizs;

const currentquizreducer: (
  state: FormField,
  action: currentQuizAction
) => FormField = (state: FormField, action: currentQuizAction) => {
  switch (action.type) {
    case "clearquestion":
      return {
        ...state,
        value: "",
      };

    case "nextquiz":
      const next_quiz = action.quiz.find((form) => form.id === state.id! + 1);
      const savedq = action.saved.find(
        (field) => field.form_field === next_quiz?.id!
      );
      return {
        ...next_quiz!,
        value:
          savedq?.value.length! > 0
            ? savedq?.value!
            : next_quiz?.kind! === "DROPDOWN" || next_quiz?.kind! === "RADIO"
            ? next_quiz?.options!.options.split(",")[0]
            : "",
      };

    case "prevquiz":
      const prev_quiz = action.quiz.find((form) => form.id === state.id! - 1);
      const saved = action.saved.find(
        (field) => field.form_field === prev_quiz?.id!
      );
      return {
        ...prev_quiz!,
        value: saved ? saved.value : "",
      };

    case "updateValue":
      return {
        ...state,
        value: action.value,
      };

    case "FetchQuiz":
      return {
        ...action.quiz,
        value:
          action.quiz?.kind! === "DROPDOWN" || action.quiz?.kind! === "RADIO"
            ? action.quiz.options!.options.split(",")[0]
            : "",
      };
  }
};

const displayReducer = (state: string, action: displayAction) => {
  switch (action.type) {
    case "setquiz":
      return "Quiz";

    case "setresult":
      return "Result";

    case "setquizs":
      return "Quizs";
  }
};

const fetchForms = async (
  setQuizs: (format: FetchFormsAction) => void,
  id: number
) => {
  try {
    const data = await listsubmittedForms(id);
    setQuizs({ data: data.results });
  } catch (error) {
    console.log(error);
  }
};

const fetchFieldsFunction = async (
  fieldsAction: (format: FieldActions) => void,
  currentQuizAction: (format: currentQuizAction) => void,
  dupQuizAction: (format: dupQuizAction) => void,
  formAction: (format: formActions) => void,
  id: number
) => {
  try {
    const fields = await listFormFields(id);
    fieldsAction({
      type: "fetchfields",
      current: fields.results,
    });
    const form = await listFormsID(id);
    formAction({ type: "fetchForm", data: form });
    const duplicateFields = fields.results.map((field: FormField) => {
      return {
        form_field: field.id,
        value:
          field?.kind! === "DROPDOWN" || field?.kind! === "RADIO"
            ? field?.options!.options.split(",")[0]
            : "",
      };
    });
    dupQuizAction({ type: "fetchDupQuiz", data: duplicateFields });
    currentQuizAction({ type: "FetchQuiz", quiz: fields.results[0] });
  } catch (error) {
    console.log(error);
  }
};

type FetchFormsAction = {
  data: Submission[];
};

const quizsReducer: (
  state: Submission[],
  action: FetchFormsAction
) => Submission[] = (state: Submission[], action: FetchFormsAction) => {
  return action.data;
};

type fetchdupQuiz = {
  type: "fetchDupQuiz";
  data: Answer[];
};

type setdupQuiz = {
  type: "setDupQuiz";
  value: string;
  id: number;
};

type dupQuizAction = fetchdupQuiz | setdupQuiz;

const dupQuizReducer: (state: Answer[], action: dupQuizAction) => Answer[] = (
  state: Answer[],
  action: dupQuizAction
) => {
  switch (action.type) {
    case "fetchDupQuiz":
      return action.data;

    case "setDupQuiz":
      return state.map((field) => {
        if (field.form_field === action.id) {
          return {
            form_field: action.id,
            value: action.value,
          };
        } else {
          return field;
        }
      });
  }
};

type formActions = {
  type: "fetchForm";
  data: Form;
};

const formReducer = (state: Form, action: formActions) => {
  switch (action.type) {
    case "fetchForm":
      return action.data;
  }
};

export default function PreviewPage(props: { id: number }) {
  const quizForms: Submission[] = [
    {
      answers: [
        {
          form_field: 1,
          value: "",
        },
      ],
    },
  ];
  const initialFormField: FormField[] = [
    {
      id: 1,
      label: "label",
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
  const [quizs, setQuizs] = useReducer(quizsReducer, quizForms);
  const [quiz, quizAction] = useReducer(quizReducer, quizForms[0]);
  const [fields, fieldsAction] = useReducer(fieldReducer, initialFormField);
  const [form, formAction] = useReducer(formReducer, initialForm);
  const [dupQuiz, dupQuizAction] = useReducer(
    dupQuizReducer,
    quizForms[0].answers
  );
  const [currentQuiz, currentQuizAction] = useReducer(
    currentquizreducer,
    fields[0]
  );

  const [display, displayAction] = useReducer(displayReducer, "Quizs");
  const prevRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getCurrentUser();
    fetchForms(setQuizs, props.id);
    fetchFieldsFunction(
      fieldsAction,
      currentQuizAction,
      dupQuizAction,
      formAction,
      props.id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let nextQuestion: () => void = async () => {
    if (currentQuiz?.value!.length! > 0) {
      const element = document.getElementById(currentQuiz?.id!.toString()!);
      if (element) {
        element.innerHTML = "";
      }
      dupQuizAction({
        type: "setDupQuiz",
        value: currentQuiz.value!,
        id: currentQuiz.id!,
      });
      if (fields[fields?.length! - 1].id! > currentQuiz?.id!) {
        currentQuizAction({ type: "nextquiz", quiz: fields, saved: dupQuiz });
      } else {
        try {
          const savedQuiz = dupQuiz.map((field) => {
            if (field.form_field === currentQuiz.id!) {
              return {
                form_field: currentQuiz.id!,
                value: currentQuiz.value!,
              };
            } else {
              return field;
            }
          });
          console.log(savedQuiz);
          const submitResponse = await submitForm(props.id!, {
            answers: savedQuiz,
          });
          if (submitResponse) {
            setQuizs({ data: [...quizs, submitResponse] });
            quizAction({ type: "fetchquiz", current: submitResponse });
            displayAction({ type: "setresult" });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const element = document.getElementById(currentQuiz?.id!.toString()!);
      if (element) {
        element.innerHTML = "Answer is needed!";
      }
    }
  };

  const render = () => {
    switch (currentQuiz?.kind!) {
      case "DROPDOWN":
        return (
          <select
            name={currentQuiz?.label}
            value={currentQuiz?.value!}
            className="border-2 flex-1 select border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
          >
            {currentQuiz?.options!.options.split(",").map((op, idx) => (
              <option
                tabIndex={idx === 0 ? 0 : undefined}
                key={idx + currentQuiz?.label}
                value={op}
              >
                {op}
              </option>
            ))}
          </select>
        );

      case "RADIO":
        return currentQuiz?.options!.options.split(",").map((form, idx) => (
          <div key={idx + 10} className="mt-2">
            <input
              tabIndex={idx === 0 ? 0 : undefined}
              type="radio"
              name={currentQuiz?.label}
              checked={currentQuiz.value === form}
              id={idx.toString() + "radio"}
              value={form}
              className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
              onChange={(e) => {
                console.log(e.target.value);
                currentQuizAction({
                  type: "updateValue",
                  value: e.target.value,
                });
                dupQuizAction({
                  type: "setDupQuiz",
                  value: e.target.value,
                  id: currentQuiz.id!,
                });
              }}
            />
            <label htmlFor={idx.toString() + "radio"}>{form}</label>
            <br />
          </div>
        ));

      case "TEXT":
        return (
          <input
            tabIndex={0}
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            value={currentQuiz?.value}
            placeholder="Enter Your Answer Here"
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
            type="text"
          />
        );
    }
  };

  if (quizs === undefined) {
    navigate("/QuizNotFound");
    return null;
  } else {
    return (
      <div>
        {display === "Quiz" ? (
          <>
            <div className="flex justify-center">
              <p className="mt-8 mb-2 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
                {form.title}
              </p>
            </div>
            <div>
              <label className="text-slate-600 font-bold py-2 px-4 rounded-lg text-lg">
                Decription:
              </label>
              <p className="text-slate-400 font-bold py-2 px-4 text-md text-center">
                {form.description!}
              </p>
            </div>
            <div className="mb-8">
              <label className="font-semibold ml-2">
                {currentQuiz?.label!}
              </label>
              <div className="flex flex-col gap-2">
                {render()}
                <button
                  accessKey="c"
                  title="ALT + C"
                  onClick={() => currentQuizAction({ type: "clearquestion" })}
                  className="p-2 mt-2 mb-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
                >
                  Clear
                </button>
              </div>
              <span
                className="text-red-800 font-semibold"
                id={currentQuiz?.id!.toString()}
              ></span>
            </div>
            <div className="flex justify-between">
              <button
                accessKey="p"
                title="ALT + P"
                ref={prevRef}
                disabled={fields[0].id === currentQuiz?.id}
                onClick={(_) =>
                  currentQuizAction({
                    type: "prevquiz",
                    quiz: fields,
                    saved: dupQuiz,
                  })
                }
                className="p-2 mt-2 mb-2 mr-2 border-2 disabled:text-slate-500  disabled:bg-slate-50 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
              >
                Previous
              </button>
              <button
                accessKey="n"
                title="ALT + N"
                onClick={(_) => nextQuestion()}
                className="pr-5 pl-5 mt-2 mb-2  border-2 border-white bg-green-500 rounded-xl hover:bg-green-600 text-white font-bold text-base"
              >
                {fields[fields.length - 1].id === currentQuiz.id
                  ? "Submit"
                  : "Next"}
              </button>
            </div>{" "}
          </>
        ) : display === "Quizs" ? (
          <>
            <div className="flex flex-col justify-center">
              <div className="flex flex-col justify-center w-full mb-2 items-center">
                <p className="mt-8 mb-4 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
                  {quizs.length > 0 ? "Submitted Quizs" : "No Quizs Available"}
                </p>
                {quizs.map((ele, indx) => (
                  <div
                    key={indx}
                    className="w-full mt-4 rounded-md flex bg-emerald-500 hover:bg-emerald-600 gap-3 justify-center items-center"
                  >
                    <p className="text-white font-bold flex-1 ml-2">
                      {ele.id!}
                    </p>
                    <p className="text-white font-bold flex-1 ml-2">
                      {ele.created_date!}
                    </p>
                    <button
                      tabIndex={indx}
                      onClick={async () => {
                        quizAction({ type: "fetchquiz", current: ele });
                        displayAction({ type: "setresult" });
                      }}
                      className="p-2 mt-2 mb-2 mr-2 border-2 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
                    >
                      View Quiz
                    </button>
                  </div>
                ))}
                <button
                  accessKey="q"
                  title="ALT + Q"
                  className="w-full p-2 m-2 mt-5 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base text-center"
                  onClick={(_) => {
                    if (fields.length > 0) {
                      displayAction({ type: "setquiz" });
                    } else {
                      alert("No Questions are available!");
                    }
                  }}
                >
                  Attempt New Quiz
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Result
              form={quiz!}
              fields={fields}
              setQuizCB={() => displayAction({ type: "setquizs" })}
            />
          </>
        )}
      </div>
    );
  }
}
