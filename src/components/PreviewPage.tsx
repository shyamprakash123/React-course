import React, { useReducer, useRef, useState } from "react";
import Result from "./Result";
import Select from "react-select";
import { Link, navigate } from "raviger";

interface formData {
  title: string;
  key: number;
  formFields: form[];
}

type textFieldTypes = "text" | "email" | "date" | "password" | "number" | "tel";

type TextField = {
  kind: "text";
  title: string;
  id: number;
  type: textFieldTypes;
  value: string;
};

type DropDownField = {
  kind: "dropdown";
  title: string;
  id: number;
  options: string[];
  value: string;
};

type TextAreaField = {
  kind: "textarea";
  title: string;
  id: number;
  cols: string;
  rows: string;
  value: string;
};

type MultiDropDownField = {
  kind: "multidropdown";
  title: string;
  id: number;
  options: string[];
  value: string;
};

type RadioInputField = {
  kind: "radio";
  title: string;
  id: number;
  labels: string[];
  value: string;
};

export type FileInputField = {
  kind: "file";
  title: string;
  id: number;
  type: string;
  value: string;
};

type form =
  | TextField
  | DropDownField
  | RadioInputField
  | MultiDropDownField
  | TextAreaField
  | FileInputField;

const initialState: (id: number) => formData = (id: number) => {
  const localForms = getLocalForms();
  const updatedForm = localForms.find((form) => form.key === id);
  return updatedForm!;
};

const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

type saveQuiz = {
  type: "savequiz";
  current: form;
};

type PreviewQuizActions = saveQuiz;

const quizReducer: (state: formData, action: PreviewQuizActions) => formData = (
  state: formData,
  action: PreviewQuizActions
) => {
  switch (action.type) {
    case "savequiz":
      return {
        ...state,
        formFields: [...state?.formFields!].map((field) =>
          field.id === action.current?.id
            ? {
                ...field,
                value: action.current?.value,
              }
            : field
        ),
      };
  }
};

type ClearQuestion = {
  type: "clearquestion";
};

type SetNextQuiz = {
  type: "nextquiz";
  quiz: formData;
};

type SetPrevQuiz = {
  type: "prevquiz";
  quiz: formData;
  nextCB: () => void;
};

type UpdateQuizValue = {
  type: "updateValue";
  value: string;
};

type currentQuizAction =
  | ClearQuestion
  | SetNextQuiz
  | SetPrevQuiz
  | UpdateQuizValue;

const currentquizreducer = (state: form, action: currentQuizAction) => {
  switch (action.type) {
    case "clearquestion":
      return {
        ...state,
        value: "",
      };

    case "nextquiz":
      const next_quiz = action.quiz.formFields.find(
        (form) => form.id === state.id! + 1
      );
      return next_quiz!;

    case "prevquiz":
      const prev_quiz = action.quiz.formFields.find(
        (form) => form.id === state.id! - 1
      );
      action.nextCB();
      return prev_quiz!;

    case "updateValue":
      return {
        ...state,
        value: action.value,
      };
  }
};

export default function PreviewPage(props: { id: number }) {
  const [quiz, quizAction] = useReducer(quizReducer, null, () =>
    initialState(props.id)
  );
  const [currentQuiz, currentQuizAction] = useReducer(
    currentquizreducer,
    quiz?.formFields[0]
  );

  //useState to handle Submit and Next Button
  const [nextBtn, setNextBtn] = useState(
    quiz?.formFields.length === 1 ? "Submit" : "Next"
  );

  //useState to display result of quiz
  const [state, setState] = useState("Quiz");
  const prevRef = useRef<HTMLButtonElement>(null);

  let setQuiz = () => {
    setState("Quiz");
  };

  let nextQuestion: () => void = () => {
    if (currentQuiz?.value.length! > 0) {
      const element = document.getElementById(currentQuiz?.id.toString()!);
      if (element) {
        element.innerHTML = "";
      }
      quizAction({ type: "savequiz", current: currentQuiz! });
      if (
        quiz?.formFields[quiz?.formFields.length! - 1].id! > currentQuiz?.id!
      ) {
        const getcurrentQuiz = quiz?.formFields.find(
          (form) => form.id === currentQuiz?.id! + 1
        );
        currentQuizAction({ type: "nextquiz", quiz: quiz });
        if (
          quiz?.formFields[quiz?.formFields.length! - 1].id! ===
          getcurrentQuiz?.id!
        ) {
          setNextBtn("Submit");
        } else {
          setNextBtn("Next");
        }
      } else {
        setState("Submit");
      }
    } else {
      const element = document.getElementById(currentQuiz?.id.toString()!);
      if (element) {
        element.innerHTML = "Answer is needed!";
      }
    }
  };

  const render = () => {
    switch (currentQuiz?.kind) {
      case "multidropdown":
        const options = currentQuiz?.options.map((op) => {
          return { value: op, label: op };
        });
        return (
          <Select
            isMulti
            options={options}
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.map((op) => op.value).toString(),
              });
            }}
          />
        );

      case "dropdown":
        return (
          <select
            name={currentQuiz?.title}
            className="border-2 flex-1 select border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
          >
            {currentQuiz?.options.map((op, idx) => (
              <option key={idx} value={op}>
                {op}
              </option>
            ))}
          </select>
        );

      case "radio":
        return currentQuiz?.labels.map((form, idx) => (
          <div key={idx + 10} className="mt-2">
            <input
              type="radio"
              name={currentQuiz?.title}
              id={idx.toString() + "radio"}
              value={form}
              checked={form === currentQuiz?.value}
              className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
              onChange={(e) => {
                // console.log(e.currentTarget.value);
                currentQuizAction({
                  type: "updateValue",
                  value: e.currentTarget.value,
                });
              }}
            />
            <label htmlFor={idx.toString() + "radio"}>{form}</label>
            <br />
          </div>
        ));
      case "textarea":
        return (
          <textarea
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            name={currentQuiz?.title}
            value={currentQuiz?.value!}
            placeholder="Enter Your Answer Here"
            cols={parseInt(currentQuiz?.cols)}
            rows={parseInt(currentQuiz?.rows)}
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
          />
        );
      case "text":
        return (
          <input
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            value={currentQuiz?.value!}
            placeholder="Enter Your Answer Here"
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
            type={currentQuiz?.type}
          />
        );

      case "file":
        return (
          <input
            className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
            type="file"
            onChange={(e) => {
              currentQuizAction({
                type: "updateValue",
                value: e.target.value,
              });
            }}
            accept={currentQuiz?.type}
          />
        );
    }
  };

  if (quiz === undefined) {
    navigate("/QuizNotFound");
    return null;
  } else if (quiz.formFields.length === 0) {
    return (
      <div>
        <p className="mt-8 mb-8 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
          No Questions Available
        </p>
        <Link
          href={`/`}
          className="p-2 m-2 bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base text-center"
        >
          Cancel
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        {state === "Quiz" ? (
          <>
            <div className="flex justify-center">
              <p className="mt-8 mb-8 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
                {quiz?.title}
              </p>
            </div>
            <div className="mb-8">
              <label className="font-semibold ml-2">{currentQuiz?.title}</label>
              <div className="flex flex-col gap-2">
                {render()}
                <button
                  onClick={() => currentQuizAction({ type: "clearquestion" })}
                  className="p-2 mt-2 mb-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
                >
                  Clear
                </button>
              </div>
              <span
                className="text-red-800 font-semibold"
                id={currentQuiz?.id.toString()}
              ></span>
            </div>
            <div className="flex justify-between">
              <button
                ref={prevRef}
                disabled={quiz.formFields[0].id === currentQuiz?.id}
                onClick={(_) =>
                  currentQuizAction({
                    type: "prevquiz",
                    quiz: quiz,
                    nextCB: () => setNextBtn("Next"),
                  })
                }
                className="p-2 mt-2 mb-2 mr-2 border-2 disabled:text-slate-500  disabled:bg-slate-50 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
              >
                Previous
              </button>
              <button
                onClick={(_) => nextQuestion()}
                className="pr-5 pl-5 mt-2 mb-2  border-2 border-white bg-green-500 rounded-xl hover:bg-green-600 text-white font-bold text-base"
              >
                {nextBtn}
              </button>
            </div>{" "}
          </>
        ) : (
          <>
            <Result form={quiz!} setQuizCB={setQuiz} />
          </>
        )}
      </div>
    );
  }
}
