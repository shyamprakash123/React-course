export interface formData {
  title: string;
  key: number;
  formFields: form[];
}

export type kindTypes = "TEXT" | "DROPDOWN" | "RADIO";

export type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

export type Answer = {
  form_field: number;
  value: string;
};

export type Submission = {
  id?: number;
  answers: Answer[];
  form?: Form;
  created_date?: string;
};

export type FormField = {
  id?: number;
  label: string;
  kind: kindTypes;
  options?: { options: string };
  value?: string;
  meta?: {};
};

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateForm(form: Form) {
  const errors: Errors<Form> = {};

  if (form.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (form.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  return errors;
}

export type textFieldTypes =
  | "text"
  | "email"
  | "date"
  | "password"
  | "number"
  | "tel";

type TextField = {
  kind: "text";
  title: string;
  id: number;
  type: textFieldTypes;
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

export type DropDownField = {
  kind: "dropdown";
  title: string;
  id: number;
  options: string[];
  value: string;
};

export type MultiDropDownField = {
  kind: "multidropdown";
  title: string;
  id: number;
  options: string[];
  value: string;
};

export type RadioInputField = {
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

export type form =
  | TextField
  | DropDownField
  | RadioInputField
  | MultiDropDownField
  | TextAreaField
  | FileInputField;
