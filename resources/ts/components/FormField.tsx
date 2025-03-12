import { Field, useField } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

export interface FormFieldProps {
    name: string;
    label: string;
    as: string;
    options?: { label: string; value: boolean }[];
    min?: number;
    max?: number;
}

const FormField = ({ name, label, as, options }: FormFieldProps) => {
    const [field, meta] = useField(name);

    let Component;
    switch (as) {
        case 'Dropdown':
            Component = Dropdown;
            break;
        case 'InputNumber':
            Component = InputNumber;
            break;
        case 'Calendar':
            Component = Calendar;
            break;
        default:
            Component = InputText;
            break;
    }

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <Field
                name={name}
                as={Component}
                options={options}
                optionLabel="label"
                optionValue="value"
                placeholder="Select"
                className={meta.error && meta.touched ? 'p-invalid' : ''}
            />
            {meta.error && meta.touched && (
                <small className="p-error">{meta.error}</small>
            )}
        </div>
    );
};

export default FormField;
