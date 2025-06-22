import { $ } from "bun";

const repo = "https://github.com/jaz303/git-clone";

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
await $`git clone ${repo}`;
