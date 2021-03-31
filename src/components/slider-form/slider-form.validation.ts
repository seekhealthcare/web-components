import * as Yup from 'yup';

import { RegexpConstants } from '../../constants';

export interface IRequestCallSchema {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  apartment: string;
}

export interface INamesSchema {
  firstName: string;
  lastName: string;
}

export interface IEmailSchema {
  email: string;
}

export interface IAddressSchema {
  address: string;
}

export interface IPhoneNumberSchema {
  phoneNumber: string;
}

const REQUIRED_FIRST_NAME_MESSAGE = 'Please enter a first name.';
const REQUIRED_LAST_NAME_MESSAGE = 'Please enter a last name.';
const REQUIRED_ADRESS_MESSAGE = 'Please enter an address.';
const INCORRECT_FIRST_NAME_MESSAGE = 'Your name must be at least 2 characters long.';
const INCORRECT_LAST_NAME_MESSAGE = 'Your last name must be at least 2 characters long.';
const INCORRECT_EMAIL_MESSAGE = 'Please enter a valid email address.';
const INCORRECT_PHONE_NUMBER_MESSAGE = 'Please provide a 10 digit phone number.';
const INCORRECT_ADRESS_MESSAGE = 'Your address must be at least 5 characters long.';
const INCORRECT_APARTMENT_MESSAGE = 'Apartment number cannot exceeds 10 characters';

const generateRequestCallSchema = (): Yup.ObjectSchema => {
  return Yup.object<IRequestCallSchema>().shape({
    firstName: Yup.string().trim().min(2, INCORRECT_FIRST_NAME_MESSAGE).required(REQUIRED_FIRST_NAME_MESSAGE),
    lastName: Yup.string().trim().min(2, INCORRECT_LAST_NAME_MESSAGE).required(REQUIRED_LAST_NAME_MESSAGE),
    email: Yup.string().trim().matches(RegexpConstants.EMAIL, INCORRECT_EMAIL_MESSAGE),
    phoneNumber: Yup.string()
      .trim()
      .matches(RegexpConstants.TELEPHONE, INCORRECT_PHONE_NUMBER_MESSAGE)
      .required(INCORRECT_PHONE_NUMBER_MESSAGE),
    address: Yup.string().trim().min(5, INCORRECT_ADRESS_MESSAGE).required(REQUIRED_ADRESS_MESSAGE),
    apartment: Yup.string().trim().max(10, INCORRECT_APARTMENT_MESSAGE)
  });
};

export const generateNamesSchema = (): Yup.ObjectSchema => {
  return Yup.object<INamesSchema>().shape({
    firstName: Yup.string().trim().min(2, INCORRECT_FIRST_NAME_MESSAGE).required(REQUIRED_FIRST_NAME_MESSAGE),
    lastName: Yup.string().trim().min(2, INCORRECT_LAST_NAME_MESSAGE).required(REQUIRED_LAST_NAME_MESSAGE)
  });
};

export const validateNames = async (firstName: string, lastName: string): Promise<boolean> => {
  const schema = generateNamesSchema();
  return await schema
    .isValid({
      firstName,
      lastName
    })
    .then((valid: boolean) => {
      return valid;
    });
};

export const generateEmailSchema = (): Yup.ObjectSchema => {
  return Yup.object<IEmailSchema>().shape({
    email: Yup.string().trim().matches(RegexpConstants.EMAIL, INCORRECT_EMAIL_MESSAGE)
  });
};

export const validateEmail = async (email?: string): Promise<boolean> => {
  const schema = generateEmailSchema();
  if (email) {
    return await schema
      .isValid({
        email
      })
      .then((valid: boolean) => {
        return valid;
      });
  } else {
    return true;
  }
};

export const generateAddressSchema = (): Yup.ObjectSchema => {
  return Yup.object<IAddressSchema>().shape({
    address: Yup.string().trim().min(5, INCORRECT_ADRESS_MESSAGE).required(REQUIRED_ADRESS_MESSAGE),
    apartment: Yup.string().trim().max(10, INCORRECT_APARTMENT_MESSAGE)
  });
};

export const validateAddress = async (address: string, apartment?: string): Promise<boolean> => {
  const schema = generateAddressSchema();
  return await schema
    .isValid({
      address,
      apartment
    })
    .then((valid: boolean) => {
      return valid;
    });
};

export const generatePhoneNumberSchema = (): Yup.ObjectSchema => {
  return Yup.object<IPhoneNumberSchema>().shape({
    phoneNumber: Yup.string()
      .trim()
      .matches(RegexpConstants.TELEPHONE, INCORRECT_PHONE_NUMBER_MESSAGE)
      .required(INCORRECT_PHONE_NUMBER_MESSAGE)
  });
};

export const validatPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
  const schema = generatePhoneNumberSchema();
  return await schema
    .isValid({
      phoneNumber
    })
    .then((valid: boolean) => {
      return valid;
    });
};

export default generateRequestCallSchema;
