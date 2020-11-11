export const validIP = (value) => {
  const ipaddress = value;
  const reg = /^(25[0-5]|2[0-4][0-9]|1\d{2}|\d{2}|[1-9])\.(25[0-5]|2[0-4][0-9]|1\d{2}|\d{2}|\d)\.(25[0-5]|2[0-4][0-9]|1\d{2}|\d{2}|\d)\.(25[0-5]|2[0-4][0-9]|1\d{2}|\d{2}|\d)$/;
  const ipIsValid = reg.test(ipaddress);
  return ipIsValid ? true : false;
};

export const validDomain = (value) => {
  const domain = value.toLowerCase();
  const reg = /^(https?:\/\/)?(www)?(\.?[^\b-\W_]([a-z\d-]{2,})){1,}(\.[a-z]{2,3}){1,3}\/?$/;
  const domainIsValid = reg.test(domain);
  return domainIsValid ? true : false;
};

export const VALIDATE_IP = "VALIDATE_IP";
export const VALIDATE_DOMAIN = "VALIDATE_DONAIN";

export const validateIp = () => ({
  type: VALIDATE_IP,
  handler: validIP,
});
export const validateDomain = () => ({
  type: VALIDATE_DOMAIN,
  handler: validDomain,
});

export default function validateOneOf(arrayOfValidators, value, err) {
  let isValid, typeOfField;
  for (let validator of arrayOfValidators) {
    const { type, handler, err } = validator;
    if (type === VALIDATE_IP) {
      isValid = handler(value);
      typeOfField = "ipAddress";
    }
    if (type === VALIDATE_DOMAIN) {
      isValid = handler(value);
      typeOfField = "domain";
    }
    if (isValid) return { isValid, typeOfField };
  }
  return { isValid: false, typeOfField: "none" };
}
