module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: 'commonjs',
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      development: process.env.NODE_ENV === 'development',
    }],
    ['@babel/preset-typescript', {
      isTSX: true,
      allExtensions: true,
      allowNamespaces: true,
      allowDeclareFields: true,
      onlyRemoveTypeImports: true,
    }],
  ],
}; 