import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, options, className = '', required, rows }) => {
    let FieldComponent;
    switch (type) {
        case 'select':
            FieldComponent = (
                <Select id={id} value={value} onChange={onChange} required={required}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            );
            break;
        case 'textarea':
            FieldComponent = (
                <Textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required} />
            );
            break;
        default:
            FieldComponent = (
                <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
            );
            break;
    }

    return (
        <div className={className}>
            <Label htmlFor={id}>
                {label} {required && <span className="text-error">*</span>}
            </Label>
            {FieldComponent}
        </div>
    );
};

export default FormField;