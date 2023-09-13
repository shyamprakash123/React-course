import { useEffect, useState } from "react";
import FormsList from "./FormsList";
import { navigate, useQueryParams } from "raviger";
import { Form } from "../types/FormTypes";
import Modal from "./common/Model";
import CreateForm from "./CreateForm";
import { deleteForm, listFormsP, me } from "./utils/apiUtils";
import { User } from "../types/userTypes";

const getLocalForms: () => Form[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

const getCurrentUser = async (setCurrentUser: (currentUser: User) => void) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
};

const fetchForms = async (
  setFieldListCB: (value: Form[]) => void,
  offset: number
) => {
  try {
    const data = await listFormsP({ offset: offset, limit: 3 });
    setFieldListCB(data.results);
  } catch (error) {
    console.log(error);
  }
};

export default function Home(props: { currentUser?: User }) {
  const [fieldList, setFieldList] = useState(getLocalForms());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ search }, setQuery] = useQueryParams();
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const [offset, setOffSet] = useState(0);

  const deleteFieldList = async (id: number) => {
    const res = await deleteForm(id);
    if (res) {
      const forms = fieldList.filter((form) => form.id !== id);
      setFieldList(forms);
    } else {
      console.log("Error while deleting a form");
    }
  };

  useEffect(() => {
    fetchForms(setFieldList, offset);
    getCurrentUser(setCurrentUser);
  }, [offset]);

  const next = () => {
    setOffSet((prevSet) => prevSet + 3);
  };

  const prev = () => {
    setOffSet((prevSet) => prevSet - 3);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center w-full mb-5 items-center">
        <div className="flex items-center">
          <label className="font-semibold text-gray-800">Search</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            <input
              name="search"
              className="border-2 border-gray-200 focus:border-sky-500 focus:outline-none rounded-lg p-2 m-2"
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              type="text"
            />
          </form>
        </div>
        <p className="mt-8 mb-4 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
          {fieldList.length > 0 ? "Available Forms" : "No Forms Available"}
        </p>
        {fieldList
          .filter((form) =>
            form.title
              .toLocaleLowerCase()
              .includes(searchString?.toLocaleLowerCase() || "")
          )
          .map((ele, indx) => (
            <FormsList
              key={indx}
              idx={ele.id!}
              title={ele.title}
              // noq={ele.formFields.length}
              deleteFieldListCB={deleteFieldList}
            />
          ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={prev}
          disabled={offset === 0}
          className="p-2 mt-2 mb-2 mr-2 border-2 disabled:text-slate-500  disabled:bg-slate-50 border-white bg-red-500 rounded-xl hover:bg-red-600 text-white font-bold text-base"
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={fieldList.length < 3}
          className="pr-5 pl-5 mt-2 mb-2  border-2 border-white bg-green-500 rounded-xl  disabled:text-slate-500  disabled:bg-green-100 hover:bg-green-600 text-white font-bold text-base"
        >
          Next
        </button>
      </div>{" "}
      <button
        className="p-2 m-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base text-center"
        onClick={(_) => {
          if (currentUser?.username.length > 0) {
            setNewForm(true);
          } else {
            navigate("/Unauthenticated");
          }
        }}
      >
        Create New Form
      </button>
      <Modal
        open={newForm}
        closeCB={() => {
          setNewForm(false);
        }}
      >
        <CreateForm />
      </Modal>
    </div>
  );
}
