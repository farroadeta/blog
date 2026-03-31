from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 捕获控制台日志
    console_logs = []
    def log_console(msg):
        console_logs.append(msg)
    
    page.on('console', log_console)
    
    # 导航到本地服务器
    page.goto('http://localhost:8000')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle', timeout=30000)
    
    # 等待额外时间确保所有脚本执行完成
    page.wait_for_timeout(2000)
    
    # 保存截图
    page.screenshot(path='/workspace/screenshot.png', full_page=True)
    
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
    
    # 检查页面内容
    content = page.content()
    print('\nPage content length:', len(content))
    
    browser.close()