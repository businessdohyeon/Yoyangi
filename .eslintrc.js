module.exports = {
    root: true,
    extends: [
        '@react-native', 
        'plugin:react-hooks/recommended',
    ],
    plugins: ['unused-imports'],
    rules: {
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
    },
};
