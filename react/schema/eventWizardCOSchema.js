import * as Yup from 'yup';

const eventWizardValidation = Yup.object().shape({
    name: Yup.string().required('Required'),
    summary: Yup.string().min(5).max(256).required('Required'),
    shortDescription: Yup.mixed().required('Required'),
    imageUrl: Yup.string().min(5).max(256).required('Required'),
    isFree: Yup.bool(),
});

export default eventWizardValidation;
