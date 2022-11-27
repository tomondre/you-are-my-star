import {Octokit} from "octokit";
import Utils from "./Utils";

export default class Handler {
    private requestCount = 0;
    // @ts-ignore
    private octokit: Octokit;

    public async handle() {
        this.octokit = await this.login();
        this.logRequestCount();
        const publicEvents = await this.getPublicEvents();
        await this.starReposInResponse(publicEvents);
    }

    private async starReposInResponse(responses: OctoResponse[]) {
        console.log(`Repos length> ${responses.length}`)
        for (const response of responses) {
            let repo = this.getRepoFromResponse(response);
            if (!await this.isRepoAlreadyStared(repo)) {
                await this.waitRandom();
                await this.starRepo(repo);
            } else {
                console.log(`Already starred> ${JSON.stringify(repo)}`)
            }
        }
        this.logRequestCount();
    }

    private async isRepoAlreadyStared(repo: Repo): Promise<boolean> {
        try {
            this.increaseRequestCount()
            let result = await this.octokit.rest.activity.checkRepoIsStarredByAuthenticatedUser(repo);
            return result.status === 204;
        } catch (e) {
            return false;
        }
    }

    private getRepoFromResponse(response: OctoResponse): Repo {
        const repoName = response.repo.name;
        const parsedName = repoName.split('/');
        return {
            owner: parsedName[0],
            repo: parsedName[1]
        }
    }

    private async getPublicEvents(): Promise<OctoResponse[]> {
        this.increaseRequestCount();
        return (await this.octokit.rest.activity.listPublicEvents()).data;
    }

    private async login(): Promise<Octokit> {
        const auth = process.env.GITHUB_TOKEN
        let octokit = new Octokit({
            auth
        });
        this.increaseRequestCount();

        const {
            data: {login},
        } = await octokit.rest.users.getAuthenticated();
        this.increaseRequestCount();
        console.log("Log in> Successfully logged in as, %s", login);

        return octokit;
    }

    private increaseRequestCount() {
        this.requestCount++;
    }

    private logRequestCount() {
        console.log(`Request Log Count> ${this.requestCount}`)
    }

    private async starRepo(repo: Repo) {
        try {
            this.increaseRequestCount()
            await this.octokit.rest.activity.starRepoForAuthenticatedUser({...repo, headers: {"Content-Length": "0"}});
            console.log(`Successfully stared> ${JSON.stringify(repo)}`)
        } catch (e) {
            console.log(`Error Starring> ${JSON.stringify(e)}`)
        }
    }

    private async waitRandom(): Promise<void> {
        let randomNumber = Utils.random(1, 1000);
        await Utils.waitUntil(randomNumber);
    }
}
type Repo = { repo: string, owner: string }
type OctoResponse = { id: string; type: string | null; actor: { id: number; login: string; display_login?: string | undefined; gravatar_id: string | null; url: string; avatar_url: string; }; repo: { id: number; name: string; url: string; }; org?: {} | undefined; payload: {}; public: boolean; created_at: string | null; }
