/**
 * Recursively checks if all the specified fields exist in the given object.
 * @param object The object to check the fields against.
 * @param fields An array of field paths to check.
 * @returns True if all fields exist, false otherwise.
 */
export function checkFields(object: any, fields: string[]): boolean {
  for (const field of fields) {
    if (!getFieldValue(object, field)) {
      console.log(`Field not found: ${field}`);
      return false;
    }
  }
  return true;
}
/**
 * Retrieves the value of a nested field in an object based on the provided field path.
 * @param object The object to retrieve the field value from.
 * @param field The field path to the desired value.
 * @returns The value of the field if found, otherwise undefined.
 */
function getFieldValue(object: any, field: string): any {
  const fields = field.split('.');
  let value = object;

  for (const field of fields) {
    if (value && field in value) {
      value = value[field];
    } else {
      return undefined;
    }
  }

  return value;
}
