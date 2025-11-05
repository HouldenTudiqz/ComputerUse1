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
                <a href="/link1" id="link1">Link 1</a>
                <button id="btn1">Button 1</button>
                <input type="text" name="username" />
            </body>
        </html>
        """
        mock_page = MagicMock()
        mock_page.content.return_value = html_content
        mock_page.url = "http://example.com"
        perception = Perception()

        # Act
        result = perception.perceive(mock_page)

        # Assert
        self.assertEqual(result["title"], "Test Page")
        self.assertEqual(len(result["elements"]), 3)

        link = result["elements"][0]
        self.assertEqual(link["type"], "link")
        self.assertEqual(link["text"], "Link 1")
        self.assertEqual(link["href"], "http://example.com/link1")
        self.assertEqual(link["selector"], "#link1")

        button = result["elements"][1]
        self.assertEqual(button["type"], "button")
        self.assertEqual(button["selector"], "#btn1")

        input_tag = result["elements"][2]
        self.assertEqual(input_tag["type"], "input")
        self.assertEqual(input_tag["name"], "username")

if __name__ == '__main__':
    unittest.main()
