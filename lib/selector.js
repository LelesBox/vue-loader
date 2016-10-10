var path = require('path')
var parse = require('./parser')
var loaderUtils = require('loader-utils')
var vueCssModule = require('./css-modules')
// var fileMap = new Map()
var cssModuleMap = require('./css-modules').cssModuleMap
var contentMap = require('./css-modules').contentMap

module.exports = function (content) {
  this.cacheable()
  var filename = path.basename(this.resourcePath)
  var query = loaderUtils.parseQuery(this.query)
  if (cssModuleMap.has(this.resourcePath) && content === contentMap.get(this.resourcePath)) {
    content = cssModuleMap.get(this.resourcePath)
  } else {
    contentMap.set(this.resourcePath, content)
    content = vueCssModule(content)
    cssModuleMap.set(this.resourcePath, content)
  }
  var parts = parse(content, filename, this.sourceMap)
  var part = parts[query.type]
  if (Array.isArray(part)) {
    part = part[query.index]
  }
  this.callback(null, part.content, part.map)
}
