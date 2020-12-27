const Generator = require('yeoman-generator');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('label');
  }
//  async method1() {
//    const answers = await this.prompt([
//      {
//        type: 'input',
//        name: 'name',
//        message: 'Your project name',
//        default: this.appname,
//      },
//      {
//       type: 'confirm',
//       name: 'cool',
//       message: 'Would you like to enable the Cool feature?',
//       default: this.appname,
//     },
//    ])
//    this.log('app name', answers.name);
//    this.log('cool feature', answers.cool);
//   }
  // method2() {
  //   this.log('method2 just run')
  // }

  initPackage() {
    const pkJson = {
      devDependencies: {
        eslint: '^3.15.0',
      },
      dependencies: {
        react: '^16.2.0',
      }
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkJson);
    // this.npmInstall(['lodash'], { 'save-dev': true });
    this.npmInstall();
  }

  async step() {
    this.fs.copyTpl(
      this.templatePath('t.html'),
      this.destinationPath('public/index.html'),
      {
        title: 'Templating with Yeoman',
      }
    );
  }
}