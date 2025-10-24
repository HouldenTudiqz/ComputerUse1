from playwright.sync_api import sync_playwright

class Navigator:
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = None
        self.page = None

    def start_browser(self, headless=True):
        """Launches the browser."""
        try:
            self.browser = self.playwright.chromium.launch(headless=headless)
            self.page = self.browser.new_page()
            print("Browser started successfully.")
        except Exception as e:
            print(f"Error starting browser: {e}")

    def goto(self, url):
        """Navigates to a specific URL."""
        if self.page:
            try:
                self.page.goto(url)
                print(f"Navigated to {url}")
            except Exception as e:
                print(f"Error navigating to {url}: {e}")
        else:
            print("Browser not started. Call start_browser() first.")

    def click(self, selector):
        """Clicks on an element identified by a selector."""
        if self.page:
            try:
                self.page.click(selector)
                print(f"Clicked on element with selector: {selector}")
            except Exception as e:
                print(f"Error clicking on element with selector {selector}: {e}")
        else:
            print("Browser not started. Call start_browser() first.")

    def close_browser(self):
        """Closes the browser."""
        if self.browser:
            try:
                self.browser.close()
                print("Browser closed successfully.")
            except Exception as e:
                print(f"Error closing browser: {e}")
        self.playwright.stop()
