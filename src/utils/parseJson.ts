/**
 * пытается запарсить строку, если передан объект, то вернет его
 * @param value: unknown
 * @param onSuccess: (data: дженерик тип) => void
 */
export const parseJson = <T>(value: unknown, onSuccess: (data: T) => void): void => {
  try {
    const data = typeof value === "object" ? value : JSON.parse(value as string);

    onSuccess(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('"parseJson" не смог запарсить строку, ошибка:\n' + String(error));
  }
};
