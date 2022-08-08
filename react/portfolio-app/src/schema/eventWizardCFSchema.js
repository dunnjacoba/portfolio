import * as Yup from 'yup';

const eventWizardValidation = Yup.object().shape({
    eventTypeId: Yup.number(1).min(0).max(50).required('Required'),
    venueId: Yup.number().min(1).max(5000).required('Required'),
});

export default eventWizardValidation;
