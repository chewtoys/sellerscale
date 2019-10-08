import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
});

export default function markdown(content, inline) {
  const markup = marked(content)
    .replace(/<a>/g, '<nu-link special target="_blank">')
    .replace(/<a /g, '<nu-link special  target="_blank"')
    .replace(/<\/a>/g, '</nu-link>');

  return inline ? markup.slice(3, -5) : markup;
}
