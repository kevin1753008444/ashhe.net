import { cp, mkdir, readFile, readdir, rm } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { spawn } from "child_process";

const root = process.cwd();
const buildRoot = path.join(root, ".static-build");
const finalOut = path.join(root, "out");
const copiedPaths = [
    "app",
    "components",
    "data",
    "fonts",
    "public",
    "eslint.config.mjs",
    "next-env.d.ts",
    "next.config.ts",
    "package.json",
    "tsconfig.json",
];

function run(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? root,
            env: { ...process.env, ...options.env },
            stdio: "inherit",
        });

        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
        });
    });
}

async function copySource() {
    await rm(buildRoot, { recursive: true, force: true });
    await mkdir(buildRoot, { recursive: true });

    for (const item of copiedPaths) {
        await cp(path.join(root, item), path.join(buildRoot, item), {
            recursive: true,
            filter: (source) => {
                const normalized = source.replaceAll(path.sep, "/");
                return !normalized.endsWith("/app/admin") && !normalized.endsWith("/app/api");
            },
        });
    }

    await pruneUnusedUploads();
}

async function pruneUnusedUploads() {
    const configPath = path.join(buildRoot, "data", "site-config.json");
    const uploadRoot = path.join(buildRoot, "public", "uploads");

    if (!existsSync(configPath) || !existsSync(uploadRoot)) {
        return;
    }

    const referencedUploads = new Set();
    const config = JSON.parse(await readFile(configPath, "utf8"));
    const collect = (value) => {
        if (typeof value === "string" && value.startsWith("/uploads/")) {
            referencedUploads.add(value.replace("/uploads/", ""));
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(collect);
            return;
        }

        if (value && typeof value === "object") {
            Object.values(value).forEach(collect);
        }
    };

    collect(config);

    for (const fileName of await readdir(uploadRoot)) {
        if (!referencedUploads.has(fileName)) {
            await rm(path.join(uploadRoot, fileName), { force: true });
        }
    }
}

try {
    await copySource();
    await run("node", [path.join(root, "node_modules", "next", "dist", "bin", "next"), "build"], {
        cwd: buildRoot,
        env: {
            NODE_ENV: "production",
            STATIC_EXPORT: "1",
        },
    });
    await rm(finalOut, { recursive: true, force: true });
    await cp(path.join(buildRoot, "out"), finalOut, { recursive: true });
} finally {
    await rm(buildRoot, { recursive: true, force: true });
}
