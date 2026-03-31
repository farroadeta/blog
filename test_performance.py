from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 捕获控制台日志
    console_logs = []
    def log_console(msg):
        console_logs.append(msg)
    
    # 捕获网络请求
    network_requests = []
    def log_request(request):
        network_requests.append({
            'url': request.url,
            'method': request.method,
            'status': request.response().status if request.response() else None,
            'duration': request.response().duration if request.response() else None
        })
    
    page.on('console', log_console)
    page.on('request', log_request)
    
    # 导航到本地服务器
    page.goto('http://localhost:8000')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle', timeout=30000)
    
    # 等待额外时间确保所有脚本执行完成
    page.wait_for_timeout(3000)
    
    # 打印页面标题
    print('Page title:', page.title())
    
    # 打印控制台日志
    print('\nConsole logs:')
    for msg in console_logs:
        print(f'{msg.type}: {msg.text}')
    
    # 检查是否有错误
    errors = [msg for msg in console_logs if msg.type == 'error']
    if errors:
        print('\nJavaScript errors found:')
        for error in errors:
            print(f'Error: {error.text}')
    else:
        print('\nNo JavaScript errors found')
    
    # 打印网络请求
    print('\nNetwork requests:')
    for req in network_requests:
        print(f'{req["method"]} {req["url"]} - Status: {req["status"]}, Duration: {req["duration"]}ms')
    
    # 检查长任务
    print('\nChecking for long tasks...')
    performance_entries = page.evaluate('() => performance.getEntriesByType("longtask")')
    if performance_entries:
        print('Long tasks found:')
        for entry in performance_entries:
            print(f'Duration: {entry["duration"]}ms, Name: {entry["name"]}')
    else:
        print('No long tasks found')
    
    # 检查页面性能指标
    print('\nPerformance metrics:')
    metrics = page.evaluate('() => performance.getEntriesByType("navigation")[0]')
    if metrics:
        print(f'Load time: {metrics["loadEventEnd"] - metrics["fetchStart"]}ms')
        print(f'DOMContentLoaded: {metrics["domContentLoadedEventEnd"] - metrics["fetchStart"]}ms')
    
    browser.close()