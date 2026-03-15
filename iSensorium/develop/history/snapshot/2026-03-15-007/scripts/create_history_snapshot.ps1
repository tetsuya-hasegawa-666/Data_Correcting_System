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
        "# 文書スナップショットマニフェスト",
        "",
        ('- 日付: {0}' -f $entryDate),
        '- 対応 summary: `iSensorium/docs/history/docs/summary/summary.md`',
        ('- 対応 entry: {0}' -f $EntryId),
        '- 保存範囲: `iSensorium/docs/` 全体。ただし `docs/history/docs/snapshot/` を除く',
        ('- 理由: {0}' -f $Reason)
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
    '`なし`'
} else {
    ($Files | ForEach-Object { '`iSensorium/' + $_ + '`' }) -join ", "
}

$manifest = @(
    "# 開発スナップショットマニフェスト",
    "",
    ('- 日付: {0}' -f $entryDate),
    '- 対応 summary: `iSensorium/develop/history/summary/summary.md`',
    ('- 対応 entry: {0}' -f $EntryId),
    "- 変更対象文書: $changedDocuments",
    ('- 理由: {0}' -f $Reason)
) -join "`r`n"
Set-Content -LiteralPath (Join-Path $snapshotRoot "manifest.md") -Value $manifest -NoNewline
