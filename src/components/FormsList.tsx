import { Link } from "raviger";
import React from "react";
interface forms {
  title: string;
  idx: number;
  deleteFieldListCB: (id: number) => void;
}
export default function FormsList(props: forms) {
  return (
    <div className="w-full mt-4 rounded-md flex bg-emerald-500 hover:bg-emerald-600 gap-3 justify-center items-center">
      <p className="text-white font-bold flex-1 ml-2">{props.title}</p>
      <Link
        href={`/preview/${props.idx}`}
        className="p-2 mt-2 mb-2 mr-2 border-2 border-white bg-white rounded-xl hover:bg-purple-100 text-slate-800 font-bold text-base"
      >
        Preview
      </Link>
      <Link
        href={`/forms/${props.idx}`}
        className="p-2 mt-2 mb-2 mr-2 border-2 border-white bg-purple-500 rounded-xl hover:bg-purple-600 text-white font-bold text-base"
      >
        Open Form
      </Link>
      <button
        onClick={() => {
          props.deleteFieldListCB(props.idx);
        }}
        className="p-2 mt-2 mb-2 mr-2 border-2 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
      >
        Delete Form
      </button>
    </div>
  );
}
