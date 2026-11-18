// Post bodies are authored as bare <table> elements (the admin editor and the
// MCP create_post tool both write plain HTML). A table with several columns is
// wider than a phone screen, so on a narrow viewport it pushes the whole article
// column — and the page — sideways. Wrap each table in a scroll container so it
// scrolls on its own instead. The .table-container rule in index.css styles it.
export function wrapContentTables(html) {
  if (!html || !/<table[\s>]/i.test(html)) return html;
  return html.replace(
    /<table\b[^>]*>[\s\S]*?<\/table>/gi,
    (table) => `<div class="table-container">${table}</div>`
  );
}
