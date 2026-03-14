param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("docs", "develop")]
    [string]$Target,

    [Parameter(Mandatory = $true)]
    [string]$EntryId,

    [Parameter(Mandatory = $true)]
    [string]$Reason,

    [string[]]$Files = @()
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$entryDate = if ($EntryId -match '^(\d{4}-\d{2}-\d{2})-\d+$') { $matches[1] } else { (Get-Date -Format 'yyyy-MM-dd') }

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Copy-RelativeFile {
    param(
        [string]$Root,
        [string]$RelativePath,
        [string]$DestinationRoot
    )

    $sourcePath = Join-Path $Root $RelativePath
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Source file not found: $sourcePath"
    }

    $destinationPath = Join-Path $DestinationRoot $RelativePath
    Ensure-Directory -Path (Split-Path -Parent $destinationPath)
    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
}

if ($Target -eq "docs") {
    $snapshotRoot = Join-Path $repoRoot "docs/history/docs/snapshot/$EntryId"
    $stagingRoot = Join-Path $repoRoot "tmp/history-snapshot-$EntryId-docs"
    if (Test-Path -LiteralPath $snapshotRoot) {
        cmd /c rmdir /s /q "\\?\$snapshotRoot" | Out-Null
    }
    if (Test-Path -LiteralPath $stagingRoot) {
        cmd /c rmdir /s /q "\\?\$stagingRoot" | Out-Null
    }

    Ensure-Directory -Path $stagingRoot

    $sourceDocs = Join-Path $repoRoot "docs"
    & robocopy $sourceDocs $stagingRoot /E /NFL /NDL /NJH /NJS /NP /XD (Join-Path $sourceDocs "history/docs/snapshot") | Out-Null
    if ($LASTEXITCODE -ge 8) {
        throw "robocopy failed with exit code $LASTEXITCODE"
    }

    $manifest = @(
        "# Documentation Snapshot Manifest",
        "",
        ('- date: {0}' -f $entryDate),
        '- paired_summary: `iSensorium/docs/history/docs/summary/summary.md`',
        ('- paired_entry: {0}' -f $EntryId),
        '- scope: `iSensorium/docs/` entire tree excluding `docs/history/docs/snapshot/`',
        ('- reason: {0}' -f $Reason)
    ) -join "`r`n"
    Ensure-Directory -Path (Split-Path -Parent $snapshotRoot)
    Move-Item -LiteralPath $stagingRoot -Destination $snapshotRoot
    Set-Content -LiteralPath (Join-Path $snapshotRoot "manifest.md") -Value $manifest -NoNewline
    return
}

$snapshotRoot = Join-Path $repoRoot "develop/history/snapshot/$EntryId"
if (Test-Path -LiteralPath $snapshotRoot) {
    Remove-Item -LiteralPath $snapshotRoot -Recurse -Force
}

Ensure-Directory -Path $snapshotRoot

foreach ($file in $Files) {
    Copy-RelativeFile -Root $repoRoot -RelativePath $file -DestinationRoot $snapshotRoot
}

$changedDocuments = if ($Files.Count -eq 0) {
    '`none`'
} else {
    ($Files | ForEach-Object { '`iSensorium/' + $_ + '`' }) -join ", "
}

$manifest = @(
    "# Development Snapshot Manifest",
    "",
    ('- date: {0}' -f $entryDate),
    '- paired_summary: `iSensorium/develop/history/summary/summary.md`',
    ('- paired_entry: {0}' -f $EntryId),
    "- changed_documents: $changedDocuments",
    ('- reason: {0}' -f $Reason)
) -join "`r`n"
Set-Content -LiteralPath (Join-Path $snapshotRoot "manifest.md") -Value $manifest -NoNewline
