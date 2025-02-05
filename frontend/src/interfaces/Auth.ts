export interface Login {
  email: string;
  password: string;
}

export interface FormRule {
  (value: string): boolean | string;
}
