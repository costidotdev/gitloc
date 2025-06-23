import { serve, $ } from "bun";
import { rm } from "node:fs/promises";

const port = 3000;

serve({
  port: port,
  routes: {
    "/analyze/:user/:repo": async (req) => {
      const { user, repo } = req.params;
      try {
        await $`wget https://github.com/${user}/${repo}/archive/master.zip`
        const clocData = await $`cloc master.zip`.text();
        await rm("./master.zip", { recursive: true, force: true });

        return new Response(JSON.stringify({
          clocData,
          repository: `${user}/${repo}`,
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        try {
          await rm("./master.zip", { force: true });
        } catch { }

        return new Response(JSON.stringify({
          error: `Failed to analyze ${user}/${repo}: ${error.message}`
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    },
  },
});

console.log(`Listening on http://localhost:${port} ...`);
