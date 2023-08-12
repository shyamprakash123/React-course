import React from "react";
import logo from "../logo.svg";

export default function Home(props: { openFormCB: () => void }) {
    return (
        <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center">
                <img className="w-48 h-48" src={logo} alt="" />
                <div className="flex-1 flex justify-center items-center">
                    <p className="font-semibold text-lg">Welcome to the Home Page</p>
                </div>
            </div>
            <button
                onClick={() => {
                    props.openFormCB();
                }}
                className="p-2 m-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base"
            >
                Open Form
            </button>
        </div>
    );
}
