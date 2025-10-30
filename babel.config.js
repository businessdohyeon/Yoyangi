module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'babel-plugin-react-compiler', // must run first!
        'react-native-worklets/plugin',
        '@babel/plugin-transform-export-namespace-from',
    ],
};
