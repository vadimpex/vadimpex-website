# Downloads the two open-source typefaces used by the site as real .woff2 files,
# writes the @font-face stylesheet that points at them, and fetches each licence.
# Both families are SIL Open Font License 1.1, which permits commercial use and
# web embedding. Re-run only if a font needs replacing.

$ErrorActionPreference = 'Stop'
$root = 'C:\Users\nikol\Projects\vadimpex-website'
$ua   = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

$fontDir = "$root\assets\fonts"
$licDir  = "$root\assets\fonts\licenses"
New-Item -ItemType Directory -Force -Path $fontDir, $licDir | Out-Null

$sources = @(
  @{ css = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400..900&display=swap';        slug = 'archivo' },
  @{ css = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap'; slug = 'plex-sans' },
  @{ css = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap';     slug = 'plex-mono' }
)

$rules = New-Object System.Text.StringBuilder
[void]$rules.AppendLine('/* Archivo and IBM Plex — SIL Open Font License 1.1. See licenses/. */')

foreach ($s in $sources) {
  $css = (Invoke-WebRequest -Uri $s.css -Headers @{ 'User-Agent' = $ua } -UseBasicParsing).Content
  foreach ($b in [regex]::Matches($css, '@font-face\s*\{[^}]*\}')) {
    $block = $b.Value
    # keep only the basic latin subset: it covers German umlauts and eszett
    if ($block -notmatch 'unicode-range:[^;]*U\+0000-00FF') { continue }
    $m = [regex]::Match($block, "url\((https://[^)]+\.woff2)\)")
    if (-not $m.Success) { continue }

    $fam = [regex]::Match($block, "font-family:\s*'([^']+)'").Groups[1].Value
    $wgt = [regex]::Match($block, 'font-weight:\s*([^;]+);').Groups[1].Value.Trim()
    $sty = [regex]::Match($block, 'font-style:\s*([^;]+);').Groups[1].Value.Trim()

    $name = ($s.slug + '-' + ($wgt -replace '\s+', '-') + '.woff2')
    $path = Join-Path $fontDir $name
    Invoke-WebRequest -Uri $m.Groups[1].Value -Headers @{ 'User-Agent' = $ua } -OutFile $path -UseBasicParsing

    [void]$rules.AppendLine("@font-face{font-family:'$fam';font-style:$sty;font-weight:$wgt;font-display:swap;src:url('../fonts/$name') format('woff2');}")
    '{0,-26} {1,6} KB' -f $name, [math]::Round((Get-Item $path).Length / 1KB, 1)
  }
}

[System.IO.File]::WriteAllText("$root\assets\css\fonts.css", $rules.ToString(), (New-Object System.Text.UTF8Encoding($false)))

# licences
$licences = @{
  'Archivo-OFL.txt'  = 'https://raw.githubusercontent.com/Omnibus-Type/Archivo/master/OFL.txt'
  'IBM-Plex-OFL.txt' = 'https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt'
}
foreach ($k in $licences.Keys) {
  try {
    Invoke-WebRequest -Uri $licences[$k] -OutFile (Join-Path $licDir $k) -UseBasicParsing
    "licence saved: $k"
  } catch { "licence FAILED: $k  ($($_.Exception.Message))" }
}
