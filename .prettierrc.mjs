/**
 * @type {import("prettier").Config}
 */
export default {
  singleQuote: true,
  bracketSameLine: true,
  singleAttributePerLine: true,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-organize-imports',
    'prettier-plugin-css-order',
  ],
};
