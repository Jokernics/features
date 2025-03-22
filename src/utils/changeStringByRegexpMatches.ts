/**
 * Проход интервально по обычному и замаченному тексту
 * @param str строка
 * @param pattern регулярка для поиска замены
 * @param onMatch функция для замаченного по регулярке текста
 * @param onSpace функция для обычного текста
 * @returns void
 */
// eslint-disable-next-line max-params
export function regexWalk(
  str: string,
  pattern: RegExp,
  onMatch: (match: RegExpMatchArray) => unknown,
  onSpace?: (str: string, pos: number) => unknown
): void {
  let lastIndex = 0;

  for (const m of str.matchAll(pattern)) {
    if (m.index === undefined) {
      return;
    }

    if (m.index > lastIndex) {
      if (onSpace?.(str.slice(lastIndex, m.index), lastIndex) === true) {
        return;
      }
    }
    if (onMatch(m) === true) {
      return;
    }
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < str.length) {
    onSpace?.(str.slice(lastIndex, str.length), lastIndex);
  }
}

/**
 * Заменяет в строке замаченные по регулярке участки
 * @param str строка
 * @param pattern регулярка для поиска участков для замены
 * @param renderFunc функция для замены замаченного текста
 * @returns массив со строками и замененными элементами
 */
export function changeStringByRegexpMatches<T>(
  str: string,
  pattern: RegExp,
  renderFunc: (match: RegExpMatchArray) => T
): Array<string | T> {
  const arr: Array<string | T> = [];

  regexWalk(
    str,
    pattern,
    (m) => {
      arr.push(renderFunc(m));
    },
    (str) => {
      arr.push(str);
    }
  );

  return arr;
}
