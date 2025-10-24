import unittest
from unittest.mock import MagicMock

from src.perception.perception import Perception

class TestPerception(unittest.TestCase):

    def test_perceive_extracts_elements_from_html(self):
        """
        Tests that perceive extracts links, buttons, and inputs from HTML.
        """
        # Arrange
        html_content = """
        <html>
            <head><title>Test Page</title></head>
            <body>
                <a href="/link1">Link 1</a>
                <button id="btn1">Button 1</button>
                <input type="text" name="username" />
            </body>
        </html>
        """
        mock_page = MagicMock()
        mock_page.content.return_value = html_content
        perception = Perception()

        # Act
        result = perception.perceive(mock_page)

        # Assert
        self.assertEqual(result["title"], "Test Page")
        self.assertEqual(len(result["elements"]), 3)
        self.assertEqual(result["elements"][0]["type"], "link")
        self.assertEqual(result["elements"][0]["text"], "Link 1")
        self.assertEqual(result["elements"][1]["type"], "button")
        self.assertEqual(result["elements"][1]["selector"], "#btn1")
        self.assertEqual(result["elements"][2]["type"], "input")
        self.assertEqual(result["elements"][2]["name"], "username")

if __name__ == '__main__':
    unittest.main()
