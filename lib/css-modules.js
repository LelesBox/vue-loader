'use strict'
// 使用计数的方式，为每一个匹配的文件分配一个递增的数作为唯一id
var generateKey = (function () {
  var _map = new Map()
  function * _g () {
    var baseStr = '__cm'
    var str = ''
    for (var i = 0; true; i++) {
      var result = yield str
      if (_map.has(result)) {
        str = _map.get(result)
        i--
      } else {
        str = baseStr + i + result
        _map.set(result, str)
      }
    }
  }
  var g = _g()
  g.next()
  return function (map) {
    _map = map || new Map()
    return g
  }
})()

var g, map

module.exports = function (content) {
  map = new Map()
  g = generateKey(map)
  // 找到style中包含css-modules的
  // 替换样式表
  var regx = /<style( |.*? )css\-modules(>| .*?>)\n((.|[\r\n])*?)\n<\/style>/gi
  content = content.replace(regx, (match, str1, str2, str3, str4, index, content) => {
    return match.replace(str3, replace('style', str3))
  })
  // 替换template
  regx = /<template.*\n((.|[\r\n])*?)\n<\/template>/gi
  content = content.replace(regx, (match, str, index, content) => {
    return match.replace(str, replace('template', str))
  })
  // 更改script
  regx = /<script.*\n((.|[\r\n])*?)\n<\/script>/gi
  content = content.replace(regx, (match, str, index, content) => {
    return match.replace(str, replace('script', str))
  })
  return content
  // var callback = this.async()
  //  if(!callback) return content
  //  callback(null, content)
}

function replace (type, str) {
  if (type === 'style') {
    str = replaceStyleClass(str, g)
  }
  if (type === 'template') {
    str = replaceTemplateClass(str, map)
  }
  if (type === 'script') {
    str = replaceScriptClass(str, map)
  }
  return str
}

function replaceStyleClass (cssStr, keygen) {
  var regx = /\.(\S*\w)/gi
  return cssStr.replace(regx, (match, str, index, cssStr) => {
    var matchArr = match.replace(/^\.*/g, '').split('.').join('$$').split(',').join('$$').split('>').join('$$').split('+').join('$$').split('$$')
    // 去重
    var matchSet = new Set(matchArr)
    matchSet.forEach(item => {
      var itemK = keygen.next(item).value
      match = match.replace(item, itemK)
    })
    return match
  })
}

function replaceTemplateClass (template, map) {
  var regx = / class=("|')(.*?)("|')/gi
  return template.replace(regx, (match, str1, str2, str3, index, template) => {
    var newStr = str2.split(' ').map(item => {
      return map.get(item) || item
    }).join(' ')
    return ` class="${newStr}"`
  })
}

function replaceScriptClass (script, map) {
  script = `var cssModules = ${strMapToJson(map)}\n${script}`
  return script
}

function strMapToObj (strMap) {
  const obj = Object.create(null)
  for (const [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}

function strMapToJson (strMap) {
  return JSON.stringify(strMapToObj(strMap))
}

module.exports.cssModuleMap = new Map()
module.exports.contentMap = new Map()
