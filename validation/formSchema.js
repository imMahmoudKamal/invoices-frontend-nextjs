import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  billFrom: yup.object().shape({
    street: yup.string().required('street address is a required field'),
    city: yup.string().required('city is a required field'),
    post: yup
      .string()
      .matches(/^[0-9]+$/, 'must be an integer')
      .required('post code is a required field'),
    country: yup.string().required('country is a required field'),
  }),

  clientDetails: yup.object().shape({
    name: yup
      .string()
      .matches(/^[a-zA-Z ]+$/, 'Name must be only letters')
      .required('name is a required field')
      .min(3),
    email: yup.string().required('name is a required field').email(),

    address: yup.object().shape({
      street: yup.string().required('street address is a required field'),
      city: yup.string().required('city is a required field'),
      post: yup
        .string()
        .matches(/^[0-9]+$/, 'must be an integer')
        .required('post code is a required field'),
      country: yup.string().required('country is a required field'),
    }),
  }),

  invoiceDetails: yup.object().shape({
    description: yup.string().required('description is a required field'),

    itemList: yup.array().of(
      yup.object().shape({
        name: yup.string().required('item name is a required field'),
        qty: yup.number().integer('must be an integer').min(1, 'min value 1').required('required'),
        price: yup.number().integer('must be an integer').required('required'),
      })
    ),
  }),
});
