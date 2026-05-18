import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
    {
        ignores: [".next/**", ".static-build/**", ".static-disabled/**", "out/**"],
    },
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "@next/next/no-img-element": "off",
        },
    },
];

export default eslintConfig;
