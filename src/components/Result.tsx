import React from "react";

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

export default function Result(props: {
  form: formData;
  setQuizCB: () => void;
}) {
  return (
    <div>
      <div className="flex justify-center">
        <p className="mt-8 mb-8 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
          {props.form.title}
        </p>
      </div>
      <div className="flex flex-col w-full text-left content-start mb-8">
        {props.form.formFields.map((form, idx) => (
          <p className="mt-2 text-slate-600 font-bold py-2 px-4 rounded-lg text-lg text-left">
            {`${idx + 1}. ${form.title} `} <br />
            {`Answer : ${form.value}`}
          </p>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={(_) => {
            props.setQuizCB();
          }}
          className="p-2 pr-3 pl-3 mt-2 mb-2  border-2 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Back
        </button>
      </div>
    </div>
  );
}
