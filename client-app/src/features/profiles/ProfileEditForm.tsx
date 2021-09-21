import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import { Profile } from '../../app/models/profile';
import CustomTextInput from '../../app/common/form/CustomTextInput';
import CustomTextArea from '../../app/common/form/CustomTextArea';
import { Button } from 'semantic-ui-react';

interface Props {
	setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({setEditMode}: Props) {
	const {profileStore: {profile, updateProfile}} = useStore();

	const validationSchema = Yup.object({
		displayName: Yup.string().required("Display name is required")
	})

	function handleFormSubmit(profile: Partial<Profile>){
		updateProfile(profile).then(() => setEditMode(false));
	}

	return (
		<Formik 
			initialValues={{displayName: profile?.displayName, bio:
				profile?.bio}}
			validationSchema={validationSchema}
			onSubmit={values => handleFormSubmit(values)}>
			
			{({ handleSubmit, isValid, isSubmitting, dirty }) => (
				<Form className='ui form' onSubmit={handleSubmit}>
					<CustomTextInput placeholder='Display Name' name='displayName'/>
					<CustomTextArea placeholder='Bio' name='bio' rows={3} />
					<Button 
						positive
						type='submit'
						loading={isSubmitting}
						disabled={!isValid || !dirty}
						content='Update profile'
						floated='right'
					/>
				</Form>
			)}

		</Formik>

	)
})