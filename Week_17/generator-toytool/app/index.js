const Generator = require('yeoman-generator');
module.exports = class extends (
  Generator
) {
  constructor(args, opts) {
    super(args, opts);
    this.option('label');
  }

  async initPackage () {
    let answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      },
    ]);
    const pkJson = {
      name: answer.name,
      version: '1.0.0',
      description: '学习笔记',
      main: 'generator/app/index.js',
      scripts: {
        build: 'webpack',
        test: 'mocha --require @babel/register',
        coverage: 'nyc mocha --require @babel/register',
      },
      author: '',
      license: 'ISC',
      devDependencies: {
        eslint: '^3.15.0',
      },
      dependencies: {},
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkJson);
    // this.npmInstall(['lodash'], { 'save-dev': true });
    this.npmInstall(['vue'], { 'save-dev': false });
    this.npmInstall(
      [
        'webpack',
        'webpack-cli',
        'vue-loader',
        'vue-style-loader',
        'babel-loader',
        'mocha',
        'nyc',
        '@istanbuljs/nyc-config-babel',
        'babel-plugin-istanbul',
        '@babel/core',
        '@babel/preset-env',
        '@babel/register',
        'css-loader',
        'vue-template-compiler',
        'copy-webpack-plugin',
      ],
      { 'save-dev': true }
    );

    this.fs.copyTpl(
      this.templatePath('sample-test.js'),
      this.destinationPath('test/sample-test.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('src/webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {
        title: answer.name,
      }
    );
  }
};
