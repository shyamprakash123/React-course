/* eslint-disable jsx-a11y/no-access-key */
import { useEffect, useState } from "react";
import FormsList from "./FormsList";
import { navigate, useQueryParams } from "raviger";
import { Form } from "../types/FormTypes";
import Modal from "./common/Model";
import CreateForm from "./CreateForm";
import { deleteForm, listFormsQuery, listlength, me } from "./utils/apiUtils";
import { User } from "../types/userTypes";
import InfiniteScroll from "react-infinite-scroll-component";

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
  setlistLength: (data: number) => void
) => {
  try {
    const data = await listFormsQuery({ limit: 5, offset: 0 });
    const length = await listlength();
    setlistLength(length);
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
  const [listLength, setlistLength] = useState(0);

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
    fetchForms(setFieldList, setlistLength);
    getCurrentUser(setCurrentUser);
  }, []);

  const fetchMoreData = async () => {
    const data = await listFormsQuery({
      limit: 5,
      offset: fieldList.length,
    });
    setTimeout(() => {
      setFieldList(fieldList.concat(data.results));
    }, 1500);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center w-full mb-5 items-center">
        <div className="flex items-center" title="ALT + S">
          <label className="font-semibold text-gray-800">Search</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            <input
              accessKey="s"
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
        <p className="mt-4 mb-4 text-slate-600 bg-slate-100 font-bold py-2 px-4 rounded-lg text-lg text-center">
          {fieldList.length > 0 ? "Available Forms" : "No Forms Available"}
        </p>
        <div>
          <InfiniteScroll
            dataLength={fieldList.length}
            next={fetchMoreData}
            hasMore={listLength > fieldList.length}
            loader={<h4>Loading...</h4>}
            height={250}
            endMessage={
              fieldList.length > 0 ? (
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              ) : (
                ""
              )
            }
          >
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
          </InfiniteScroll>
        </div>
      </div>
      <button
        accessKey="c"
        title="ALT + C"
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
