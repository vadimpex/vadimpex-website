param([string]$Name = 'directions')

$ErrorActionPreference = 'Stop'
$root  = 'C:\Users\nikol\Projects\vadimpex-website'
$src   = "$root\design\$Name.src.html"
$out   = "$root\design\$Name.html"

$html  = [System.IO.File]::ReadAllText($src)
$fonts = [System.IO.File]::ReadAllText("$root\brand\fonts.css")

function Svg-DataUri([string]$path) {
  'data:image/svg+xml;base64,' + [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($path))
}
$logoLight = Svg-DataUri "$root\brand\logo-horizontal-light.svg"
$logoDark  = Svg-DataUri "$root\brand\logo-horizontal-dark.svg"

$html = $html.Replace('/*FONTS*/', $fonts)
$html = $html.Replace('__LOGO_LIGHT__', $logoLight)
$html = $html.Replace('__LOGO_DARK__', $logoDark)

# Escape every non-ASCII character as a numeric entity, so umlauts, m² and em
# dashes survive regardless of what charset the host declares.
$sb = New-Object System.Text.StringBuilder
$escaped = 0
foreach ($ch in $html.ToCharArray()) {
  if ([int]$ch -gt 127) { [void]$sb.Append('&#' + [int]$ch + ';'); $escaped++ }
  else { [void]$sb.Append($ch) }
}
$html = $sb.ToString()

[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))
"non-ascii chars escaped: $escaped"

"built: $out"
"size:  " + [math]::Round((Get-Item $out).Length / 1MB, 2) + " MB"
"placeholders left: " + ([regex]::Matches($html, '__LOGO_LIGHT__|__LOGO_DARK__|/\*FONTS\*/')).Count
