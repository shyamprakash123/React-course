import { Link } from "raviger";
import React from "react";

export default function Unauthenticated() {
  return (
    <div>
      <p className="mt-8 mb-8 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
        unauthenticated user!
      </p>
      <Link
        href={`/login`}
        className="p-2 m-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base text-center"
      >
        Login
      </Link>
    </div>
  );
}
