import unittest
from unittest.mock import patch, MagicMock

from src.navigator.navigator import Navigator

class TestNavigator(unittest.TestCase):

    @patch('src.navigator.navigator.sync_playwright')
    def test_start_browser_launches_chromium_and_creates_page(self, mock_sync_playwright):
        """
        Tests that start_browser launches Chromium and creates a new page.
        """
        # Arrange
        mock_playwright = mock_sync_playwright.return_value.start.return_value
        mock_browser = mock_playwright.chromium.launch.return_value
        navigator = Navigator()

        # Act
        navigator.start_browser()

        # Assert
        mock_playwright.chromium.launch.assert_called_once_with(headless=True)
        mock_browser.new_page.assert_called_once()
        self.assertIsNotNone(navigator.browser)
        self.assertIsNotNone(navigator.page)

    @patch('src.navigator.navigator.sync_playwright')
    def test_goto_navigates_to_url(self, mock_sync_playwright):
        """
        Tests that goto navigates to the specified URL.
        """
        # Arrange
        navigator = Navigator()
        navigator.page = MagicMock()

        # Act
        navigator.goto("http://example.com")

        # Assert
        navigator.page.goto.assert_called_once_with("http://example.com")

    @patch('src.navigator.navigator.sync_playwright')
    def test_click_clicks_on_selector(self, mock_sync_playwright):
        """
        Tests that click clicks on the specified selector.
        """
        # Arrange
        navigator = Navigator()
        navigator.page = MagicMock()

        # Act
        navigator.click("#button")

        # Assert
        navigator.page.click.assert_called_once_with("#button")

    @patch('src.navigator.navigator.sync_playwright')
    def test_close_browser_closes_browser_and_stops_playwright(self, mock_sync_playwright):
        """
        Tests that close_browser closes the browser and stops Playwright.
        """
        # Arrange
        mock_playwright = mock_sync_playwright.return_value.start.return_value
        navigator = Navigator()
        navigator.browser = MagicMock()

        # Act
        navigator.close_browser()

        # Assert
        navigator.browser.close.assert_called_once()
        mock_playwright.stop.assert_called_once()

if __name__ == '__main__':
    unittest.main()
