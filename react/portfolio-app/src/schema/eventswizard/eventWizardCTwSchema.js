import * as Yup from 'yup';

const eventWizardValidation = Yup.object().shape({
    venueId: Yup.number().min(1).max(500000).required('Required'),
    externalSiteUrl: Yup.string().min(5).max(256).required('Required'),
});

export default eventWizardValidation;
