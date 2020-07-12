import { Ref } from '@vue/composition-api';

export type Validator = string

export type FormFieldBase<T> = {
  label: string;
  validate?: Validator[]
  fieldName?: keyof T;
  params?: {[key: string]: unknown}
};

export type FormFieldText<T> = FormFieldBase<T> & {
  type: 'text'
  counter?: boolean;
}

export type FormFieldNumber<T> = FormFieldBase<T> & {
  type: 'number'
  mask?: string;
}

export type FormFieldDate<T> = FormFieldBase<T> & {
  type: 'date';
  mask?: string;
}

export type FormFieldSelect<T> = FormFieldBase<T> & {
  type: 'select';
  options: string[] | Ref<string[]>;
}

export type FormField<T> = FormFieldText<T> | FormFieldNumber<T> | FormFieldDate<T> | FormFieldSelect<T>


export type FormGroup<T> = {
  header: string,
  icon?: string;
  fields?: FormField<T>[]
}
