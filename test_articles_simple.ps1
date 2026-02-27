$html = Invoke-WebRequest -Uri "http://localhost:1313/posts" -UseBasicParsing
$content = $html.Content

Write-Host "Checking if new article is present..."
if ($content -like "*一些代码*") {
    Write-Host "New article found: '一些代码'"
} else {
    Write-Host "New article NOT found"
}

Write-Host "\nChecking if article data is in allData array..."
if ($content -like "*allData = *") {
    Write-Host "allData array found"
    # Get first 500 characters of allData
    $startIndex = $content.IndexOf('var allData = ')
    if ($startIndex -gt 0) {
        $endIndex = $content.IndexOf(';', $startIndex + 10)
        if ($endIndex -gt $startIndex) {
            $allData = $content.Substring($startIndex, [Math]::Min(500, $endIndex - $startIndex))
            Write-Host "\nFirst 500 chars of allData:"
            Write-Host $allData
        }
    }
} else {
    Write-Host "allData array NOT found"
}
