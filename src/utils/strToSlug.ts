import { __ } from "@wordpress/i18n";

/**
 * Converte uma string em um slug
 *
 * @param {string} str
 * @returns {string}
 *
 * @see https://gist.github.com/spyesx/561b1d65d4afb595f295
 */
const stringToSlug = (str: string): string => {
    const accentsMap: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a',
        'è': 'e', 'é': 'e', 'ë': 'e', 'ê': 'e',
        'ì': 'i', 'í': 'i', 'ï': 'i', 'î': 'i',
        'ò': 'o', 'ó': 'o', 'ö': 'o', 'ô': 'o',
        'ù': 'u', 'ú': 'u', 'ü': 'u', 'û': 'u',
        'ñ': 'n', 'ç': 'c',
        'ě': 'e', 'š': 's', 'č': 'c', 'ř': 'r', 'ž': 'z',
        'ý': 'y', 'ů': 'u', 'ď': 'd', 'ť': 't', 'ň': 'n',
        '·': '-', '/': '-', '_': '-', ',': '-', ':': '-',
        ';': '-', '!': '', '?': '', '@': '', '#': '', '$': '', '%': '', '^': '', '&': '', '*': '', '(': '', ')': '', '+': '', '=': '', '{': '', '}': '', '[': '', ']': '', '\\': '', '|': '', '<': '', '>': '', '`': '', '~': '', '\'': '', '\"': '', '‘': '', '’': '', '“': '', '”': '', '«': '', '»': '', '…': '', '•': '', '—': '-', '–': '-', '°': '', '№': '', '½': '', '¼': '', '¾': ''
    };
  
    const removeAccents = (text: string): string => {
      return text
        .split('')
        .map(char => accentsMap[char] || char)
        .join('');
    };
  
    const invalidCharsRegex = /[^a-z0-9-]+/g;
    const whitespaceRegex = /\s+/g;
  
    str = str.trim().toLowerCase();
    str = removeAccents(str);
    str = str.replace(/\./g, '-');
    str = str.replace(invalidCharsRegex, ' ');
    str = str.replace(whitespaceRegex, '-');
    str = str.replace(/-+/g, '-');
    str = str.replace(/\//g, '');

    const slugParts = str.split('-').filter(Boolean);
    if (slugParts.length < 2) {
        throw new Error(__('The generated slug is not consistent. Check the entry and try again.', 'article-gen'));
    }
  
    return str;
};
  
export default stringToSlug;
  