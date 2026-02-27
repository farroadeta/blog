$html = Invoke-WebRequest -Uri "http://localhost:1313/" -UseBasicParsing
$content = $html.Content

Write-Host "Checking homepage for new article..."
if ($content -like "*一些代码*") {
    Write-Host "New article found: '一些代码'"
} else {
    Write-Host "New article NOT found"
    Write-Host "Page contains:"
    Write-Host $content.Substring(0, [Math]::Min(500, $content.Length))
}
