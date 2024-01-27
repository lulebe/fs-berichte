const md = require('markdown-it')({
  breaks: true,
  quotes: '„“‚‘'
})

//links target blank
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank')
  return defaultRender(tokens, idx, options, env, self)
}

module.exports = x => md.render(x)