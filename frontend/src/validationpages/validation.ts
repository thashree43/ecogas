import { emailregex, mobileregex, passwordRegex, otpRegex } from "../constant/regex";

export const validateInput = (name: string, value: string | File | undefined): string => {
  let error = '';

  const allowedImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];

  switch (name) {
    case 'username':
      if (!value) {
        error = 'Username is required';
      } else if ((value as string).length < 3) {
        error = 'Username must be at least 3 characters long';
      }
      break;
    case 'email':
      if (!value) {
        error = 'Email is required';
      } else if (!emailregex.test(value as string)) {
        error = 'Please enter a valid email';
      }
      break;
    case 'mobile':
      if (!value) {
        error = 'Mobile number is required';
      } else if (!mobileregex.test(value as string)) {
        error = 'Please enter a valid mobile number';
      }
      break;
    case 'password':
      if (!value) {
        error = 'Password is required';
      } else if (!passwordRegex.test(value as string)) {
        error = 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character';
      }
      break;
    case 'profileImage':
      const file = value as File | undefined;
      if (!file) {
        error = 'Profile image is required';
      } else if (!allowedImageTypes.includes(file.type)) {
        error = 'Only PNG, JPG, JPEG, WEBP, and AVIF images are allowed';
      }
      break;
    default:
      break;
  }

  return error;
};



export interface FormErrors {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  otp?: string;
  global?: string;
}

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some((error) => error !== "");
};

export const isFormEmpty = (formData: Record<string, string>): boolean => {
  return Object.values(formData).some((field) => field === "");
};
