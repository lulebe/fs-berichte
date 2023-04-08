const joinPath = require('path').join
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing')

let loader = new TwingLoaderFilesystem('./templates')

module.exports = new TwingEnvironment(loader)