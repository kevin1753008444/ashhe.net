$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $repoRoot "frontend"
$adminUrl = "http://127.0.0.1:3000/admin"

function Test-PortfolioServer {
    try {
        $response = Invoke-WebRequest -Uri $adminUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    }
    catch {
        return $false
    }
}

if (-not (Test-PortfolioServer)) {
    Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @(
            "-NoExit",
            "-ExecutionPolicy", "Bypass",
            "-Command",
            "Set-Location -LiteralPath '$frontendRoot'; npm run dev"
        ) `
        -WorkingDirectory $frontendRoot `
        -WindowStyle Hidden

    $deadline = (Get-Date).AddSeconds(35)
    while ((Get-Date) -lt $deadline) {
        if (Test-PortfolioServer) {
            break
        }
        Start-Sleep -Milliseconds 600
    }
}

Start-Process $adminUrl
