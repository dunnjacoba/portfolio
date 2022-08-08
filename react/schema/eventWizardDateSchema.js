import * as Yup from 'yup';

const eventWizardValidation = Yup.object().shape({
    dateStart: Yup.date(),
    dateEnd: Yup.date(),
});

export default eventWizardValidation;
