module.exports = [
    {
        files: ['*.js'],
        languageOptions: {
            globals: {
                browser: true,
                es2021: true,
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
        },
    },
    {
        files: ['*.css', '*.html'],
        rules: {
            'no-unused-vars': 'off', // Disable unused vars for CSS and HTML
        },
    },
];
