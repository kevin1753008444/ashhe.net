import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FRONTEND_DIR = process.cwd();
const REPO_ROOT = path.dirname(FRONTEND_DIR);
const MAX_LOG_LENGTH = 1024 * 1024 * 20;

type RunResult = {
    code: number;
    output: string;
};

type RunOptions = {
    allowedExitCodes?: number[];
    env?: NodeJS.ProcessEnv;
};

function run(command: string, args: string[], cwd: string, options: RunOptions = {}): Promise<RunResult> {
    const allowedExitCodes = options.allowedExitCodes ?? [0];

    return new Promise((resolve, reject) => {
        let output = "";
        const child = spawn(command, args, {
            cwd,
            shell: process.platform === "win32" && command === "npm",
            windowsHide: true,
            env: {
                ...process.env,
                ...options.env,
                npm_config_color: "false",
                FORCE_COLOR: "0",
            },
        });

        child.stdout?.on("data", (chunk: Buffer) => {
            output += chunk.toString();
            if (output.length > MAX_LOG_LENGTH) {
                output = output.slice(-MAX_LOG_LENGTH);
            }
        });

        child.stderr?.on("data", (chunk: Buffer) => {
            output += chunk.toString();
            if (output.length > MAX_LOG_LENGTH) {
                output = output.slice(-MAX_LOG_LENGTH);
            }
        });

        child.on("error", (error) => {
            reject(new Error(`无法启动命令 ${command}: ${error.message}`));
        });

        child.on("close", (code) => {
            const exitCode = code ?? 1;
            const trimmedOutput = output.trim();

            if (allowedExitCodes.includes(exitCode)) {
                resolve({ code: exitCode, output: trimmedOutput });
                return;
            }

            reject(new Error(`命令失败：${command} ${args.join(" ")}\n${trimmedOutput}`));
        });
    });
}

async function hasStagedChanges() {
    const result = await run("git", ["diff", "--cached", "--quiet"], REPO_ROOT, { allowedExitCodes: [0, 1] });
    return result.code === 1;
}

async function hasUnpushedCommits() {
    const result = await run("git", ["status", "--porcelain=v1", "--branch"], REPO_ROOT);
    return result.output.split("\n")[0]?.includes("[ahead ");
}

export async function POST() {
    const logs: string[] = [];

    try {
        logs.push((await run("npm", ["run", "lint"], FRONTEND_DIR)).output);
        logs.push((await run("npm", ["run", "build:static"], FRONTEND_DIR, { env: { NODE_ENV: "production" } })).output);
        logs.push((await run("git", ["add", "."], REPO_ROOT)).output);

        if (await hasStagedChanges()) {
            logs.push((await run("git", ["commit", "-m", "chore: publish portfolio updates"], REPO_ROOT)).output);
        } else if (!(await hasUnpushedCommits())) {
            return NextResponse.json({
                ok: true,
                published: false,
                message: "当前没有需要发布的新改动。",
                logs,
            });
        }

        logs.push((await run("git", ["push", "origin", "main"], REPO_ROOT)).output);

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
                error: error instanceof Error ? error.message : "发布失败。",
                logs,
            },
            { status: 500 },
        );
    }
}
