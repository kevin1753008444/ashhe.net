import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);
const FRONTEND_DIR = process.cwd();
const REPO_ROOT = path.dirname(FRONTEND_DIR);

function commandName(command: string) {
    if (process.platform === "win32" && command === "npm") {
        return "npm.cmd";
    }

    return command;
}

async function run(command: string, args: string[], cwd: string) {
    const { stdout, stderr } = await execFileAsync(commandName(command), args, {
        cwd,
        maxBuffer: 1024 * 1024 * 20,
    });

    return `${stdout}${stderr}`.trim();
}

async function hasStagedChanges() {
    try {
        await run("git", ["diff", "--cached", "--quiet"], REPO_ROOT);
        return false;
    } catch {
        return true;
    }
}

export async function POST() {
    const logs: string[] = [];

    try {
        logs.push(await run("npm", ["run", "lint"], FRONTEND_DIR));
        logs.push(await run("npm", ["run", "build:static"], FRONTEND_DIR));
        logs.push(await run("git", ["add", "."], REPO_ROOT));

        if (!(await hasStagedChanges())) {
            return NextResponse.json({
                ok: true,
                published: false,
                message: "当前没有需要发布的新改动。",
                logs,
            });
        }

        logs.push(await run("git", ["commit", "-m", "chore: publish portfolio updates"], REPO_ROOT));
        logs.push(await run("git", ["push", "origin", "main"], REPO_ROOT));

        return NextResponse.json({
            ok: true,
            published: true,
            message: "已推送到 GitHub，GitHub Actions 正在部署公开页面。",
            logs,
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : "Publish failed.",
                logs,
            },
            { status: 500 },
        );
    }
}
