$html = Invoke-WebRequest -Uri "http://localhost:1313/posts" -UseBasicParsing
$content = $html.Content

# 检查 allData 数组是否包含新文章
if ($content -like "*一些代码*" -and $content -like "*2026-02-28*" -and $content -like "*蛇*") {
    Write-Host "✅ 新文章已包含在 allData 数组中"
} else {
    Write-Host "❌ 新文章未包含在 allData 数组中"
    
    # 提取 allData 数组内容
    $allDataMatch = $content | Select-String -Pattern 'var allData = (\[.*?\]);' -AllMatches
    if ($allDataMatch) {
        $allData = $allDataMatch.Matches.Groups[1].Value
        Write-Host "\nallData 数组内容:"
        Write-Host $allData
    } else {
        Write-Host "\n无法提取 allData 数组"
    }
}

# 检查页面中是否有文章标题
if ($content -like "*一些代码*") {
    Write-Host "✅ 页面中包含文章标题"
} else {
    Write-Host "❌ 页面中不包含文章标题"
}
