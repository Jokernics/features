/**
 * Аналог Typescript Omit
 * @param объект со свойствами
 * @param массив свойств, которые надо из объекта удалить
 * @returns объект с удаленными свойствами
 */
export const omitObjectProperties = <T extends object, P extends keyof T>(
  obj: T,
  properties: P[]
): Omit<T, P> => {
  const newObj = { ...obj } as T;

  [...properties].forEach((property) => {
    delete newObj[property];
  });

  return newObj;
};
