import { useEffect, useState } from "react";
import FormsList from "./FormsList";
import { useQueryParams } from "raviger";
import { Form } from "../types/FormTypes";
import Modal from "./common/Model";
import CreateForm from "./CreateForm";
import { listForms } from "./utils/apiUtils";
import { Pagination } from "../types/common";

const getLocalForms: () => Form[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

// const saveLocalForms = (localForm: formData[]) => {
//   localStorage.setItem("savedForms", JSON.stringify(localForm));
// };

const fetchForms = async (setFieldListCB: (value: Form[]) => void) => {
  try {
    const data: Pagination<Form> = await listForms({ offset: 0, limit: 2 });
    setFieldListCB(data.results);
  } catch (error) {
    console.log(error);
  }
};

export default function Home() {
  const [fieldList, setFieldList] = useState(getLocalForms());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);

  // const deleteFieldList = (id: number) => {
  //   let localForms = getLocalForms();
  //   const updatedForms = localForms.filter((form) => form.key !== id);
  //   setFieldList(updatedForms);
  //   saveLocalForms(updatedForms);
  // };

  useEffect(() => {
    fetchForms(setFieldList);
  }, []);

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
              idx={indx}
              title={ele.title}
              // noq={ele.formFields.length}
              // deleteFieldListCB={deleteFieldList}
            />
          ))}
      </div>
      <button
        className="p-2 m-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-white font-bold text-base text-center"
        onClick={(_) => {
          setNewForm(true);
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
