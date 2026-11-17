export function mascararEmail(email) {
  if (!email) return email;
  const arroba = email.indexOf("@");
  if (arroba < 1) return "***";
  return `${email[0]}***${email.slice(arroba)}`;
}
