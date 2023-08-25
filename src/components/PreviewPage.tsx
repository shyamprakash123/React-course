import React, { useEffect, useRef, useState } from "react";
import Result from "./Result";

interface formData {
  title?: string;
  key?: number;
  formFields: form[];
}

interface form {
  title: string;
  id: number;
  type: string;
  value: string;
}

const initialState: (id: number) => formData | undefined = (id: number) => {
  const localForms = getLocalForms();
  const updatedForm = localForms.find((form) => form.key === id);
  return updatedForm;
};

const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

export default function PreviewPage(props: { id: number }) {
  const [quiz, setQuizState] = useState(() => initialState(props.id));
  const [currentQuiz, setCurrentQuiz] = useState(quiz?.formFields[0]);
  const [nextBtn, setNextBtn] = useState("Next");
  const [state, setState] = useState("Quiz");
  const prevRef = useRef<HTMLButtonElement>(null);

  let saveQuestion: (current: form) => void = (current: form) => {
    const up: formData = {
      ...quiz,
      formFields: [...quiz?.formFields!].map((field) =>
        field.id === current?.id
          ? {
              ...field,
              value: current?.value,
            }
          : field
      ),
    };
    setQuizState(up);
  };

  let clearQuestion: () => void = () => {
    const up = {
      ...currentQuiz!,
      value: "",
    };

    setCurrentQuiz(up);
  };

  let setQuiz = () => {
    setState("Quiz");
  };

  let nextQuestion: () => void = () => {
    if (quiz?.formFields.length! > currentQuiz?.id!) {
      const getcurrentQuiz = quiz?.formFields.find(
        (form) => form.id === currentQuiz?.id! + 1
      );
      setCurrentQuiz(getcurrentQuiz);
      if (quiz?.formFields.length! - 1 === currentQuiz?.id!) {
        setNextBtn("Submit");
      } else {
        setNextBtn("Next");
      }
      if (prevRef.current) {
        prevRef.current.disabled = false;
      }
    } else {
      setState("Submit");
    }
  };

  let prevQuestion: () => void = () => {
    if (1 < currentQuiz?.id!) {
      const getcurrentQuiz = quiz?.formFields.find(
        (form) => form.id === currentQuiz?.id! - 1
      );
      setCurrentQuiz(getcurrentQuiz);
      setNextBtn("Next");
      if (currentQuiz?.id! - 1 === 1 && prevRef.current) {
        prevRef.current.disabled = true;
      }
    } else {
      if (prevRef.current) {
        prevRef.current.disabled = true;
      }
    }
  };

  useEffect(() => {
    saveQuestion(currentQuiz!);
  }, [currentQuiz!]);
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
            <div className="flex gap-2">
              <input
                className="border-2 flex-1 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
                value={currentQuiz?.value!}
                onChange={(e) => {
                  setCurrentQuiz({
                    ...currentQuiz!,
                    value: e.target.value,
                  });
                }}
                type={currentQuiz?.type}
              />
              <button
                onClick={() => clearQuestion()}
                className="p-2 mt-2 mb-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              ref={prevRef}
              onClick={(_) => prevQuestion()}
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
