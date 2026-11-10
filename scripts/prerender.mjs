import { readFile, writeFile } from "node:fs/promises";

const htmlPath = new URL("../dist/index.html", import.meta.url);
const serverEntry = new URL(
  "../node_modules/.cache/creatorkit-ssr/entry-server.js",
  import.meta.url,
);

const [{ render }, html] = await Promise.all([
  import(serverEntry.href),
  readFile(htmlPath, "utf8"),
]);

const renderedApp = render();
const shell = '<div id="root"></div>';

if (!html.includes(shell)) {
  throw new Error("Could not find the application root in dist/index.html");
}

await writeFile(htmlPath, html.replace(shell, `<div id="root">${renderedApp}</div>`));
