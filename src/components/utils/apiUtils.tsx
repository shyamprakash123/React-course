import { Form, FormField, Submission } from "../../types/FormTypes";
import { PaginationParams } from "../../types/common";

const API_BASE_URL = "https://tsapi.coronasafe.live/api/";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const request = async (
  endpoint: string,
  method: RequestMethod = "GET",
  data: any = {}
) => {
  let url;
  let payload: string;
  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join("&")}`
      : "";
    url = `${API_BASE_URL}${endpoint}${requestParams}`;
    payload = "";
  } else if (method === "DELETE") {
    url = `${API_BASE_URL}${endpoint}`;
    payload = "";
  } else {
    url = `${API_BASE_URL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }
  //   Basic Authentication
  //   const auth = "Basic " + window.btoa("ShyamPrakash22:Shyam@9097");

  //   Token Authentication
  const token = localStorage.getItem("token");
  const auth = token ? "Token " + token : "";

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: method !== "GET" ? payload : null,
  });
  if (method === "DELETE") {
    if (response.status === 204) {
      return true;
    } else {
      return false;
    }
  }
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    const errorJson = await response.json();
    throw Error(errorJson);
  }
};

export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", { username, password });
};

export const me = () => {
  return request("users/me/", "GET", {});
};

export const listFormsP = (PaginationParams: PaginationParams) => {
  return request("forms/", "GET", PaginationParams);
};

export const listForms = () => {
  return request("forms/", "GET");
};

export const listlength = async () => {
  const length = await request("forms/", "GET");
  return length.results.length;
};

export const listFormsQuery = (data: { limit: number; offset: number }) => {
  return request("forms/", "GET", data);
};

export const listFormsID = (id: number) => {
  return request(`forms/${id}/`, "GET");
};

export const listFormFields = (id: number) => {
  return request(`forms/${id}/fields/`, "GET");
};

export const createFormField = (id: number, data: FormField) => {
  return request(`forms/${id}/fields/`, "POST", data);
};

export const submitForm = (id: number, data: Submission) => {
  return request(`forms/${id}/submission/`, "POST", data);
};

export const listsubmittedForms = (id: number) => {
  return request(`forms/${id}/submission/`, "GET");
};

export const deleteFormField = (form_id: number, field_id: number) => {
  return request(`forms/${form_id}/fields/${field_id}/`, "DELETE");
};

export const listFormField = (form_id: number, field_id: number) => {
  return request(`forms/${form_id}/fields/${field_id}/`, "GET");
};

export const updateFormField = (form_id: number, data: FormField) => {
  return request(`forms/${form_id}/fields/${data.id}/`, "PUT", data);
};

export const updateForm = (id: number, data: Form) => {
  return request(`forms/${id}/`, "PUT", data);
};

export const deleteForm = (id: number) => {
  return request(`forms/${id}/`, "DELETE");
};

export const createForm = (form: Form) => {
  return request("forms/", "POST", form);
};
