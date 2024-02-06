import { Octokit, App } from "https://esm.sh/octokit?dts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const { TOKEN, REPO_URL } = Deno.env.toObject();

const octokit = new Octokit({
  auth: TOKEN,
});

const owner = REPO_URL.split("/").shift() ?? "";
const repo = REPO_URL.split("/").pop() ?? "";

const botnet = await octokit.rest.repos.createFork({
  owner,
  repo,
});

console.log("[!] Forked");

const forkOwner = botnet.data.owner.login;
const forkRepo = botnet.data.name;

const { data } = await octokit.rest.repos.createOrUpdateFileContents({
  owner: forkOwner,
  repo: forkRepo,
  path: ".github/workflows/entry.yml",
  message: "setup",
  content: btoa("Hello World"),
  committer: {
    name: `SetupBot`,
    email: "amex@荒らし.com",
  },
  author: {
    name: "SetupBot",
    email: "amex@荒らし.com",
  },
});
