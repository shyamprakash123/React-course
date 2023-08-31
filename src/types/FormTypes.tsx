export interface formData {
  title: string;
  key: number;
  formFields: form[];
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
