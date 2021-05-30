import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
	placeholder: string;
	name: string;
	label?: string;
}

export default function CustomTextInput(props: Props){
	const [field, meta] = useField(props.name)
	return (
		// double exclamation mark converts to boolean whether
		// its null or undefined.
		<Form.Field error ={meta.touched && !!meta.error}>
			<label>{props.label}</label>
			<input {...field}{...props}/>
			{meta.touched && meta.error ? (
				<Label pointing basic color='red'>{meta.error} </Label>
			) : null}
		</Form.Field>
	)
}