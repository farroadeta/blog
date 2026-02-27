$html = Invoke-WebRequest -Uri "http://localhost:1313/" -UseBasicParsing
$content = $html.Content

Write-Host "Checking if new article is present on homepage..."
if ($content -like "*一些代码*") {
    Write-Host "✅ New article found on homepage: '一些代码'"
} else {
    Write-Host "❌ New article NOT found on homepage"
    
    # 检查页面中是否有文章列表
    if ($content -like "*最近*") {
        Write-Host "✅ Recent posts section found"
        # 提取文章标题
        $titleMatches = $content | Select-String -Pattern '<h3 class="icity-card-title"><a href="[^"]+">([^<]+)</a></h3>' -AllMatches
        if ($titleMatches) {
            Write-Host "\nFound article titles:"
            $titleMatches.Matches | ForEach-Object {
                Write-Host "- $($_.Groups[1].Value)"
            }
        } else {
            Write-Host "\nNo article titles found"
        }
    } else {
        Write-Host "❌ Recent posts section NOT found"
    }
}
