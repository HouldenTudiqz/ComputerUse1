from bs4 import BeautifulSoup

class Perception:
    def perceive(self, page):
        """
        Extracts interactable elements from the current page's DOM.
        """
        try:
            html = page.content()
            soup = BeautifulSoup(html, 'lxml')

            interactable_elements = []

            # Extract links
            for link in soup.find_all('a', href=True):
                interactable_elements.append({
                    "type": "link",
                    "text": link.get_text(strip=True),
                    "href": link['href']
                })

            # Extract buttons
            for button in soup.find_all('button'):
                interactable_elements.append({
                    "type": "button",
                    "text": button.get_text(strip=True),
                    "selector": self._get_selector(button)
                })

            # Extract inputs
            for input_tag in soup.find_all('input'):
                interactable_elements.append({
                    "type": "input",
                    "name": input_tag.get('name'),
                    "input_type": input_tag.get('type'),
                    "selector": self._get_selector(input_tag)
                })

            return {
                "title": soup.title.string if soup.title else "No title",
                "elements": interactable_elements
            }
        except Exception as e:
            print(f"Error during perception: {e}")
            return {
                "title": "Error",
                "elements": []
            }

    def _get_selector(self, tag):
        """
        Generates a CSS selector for a given tag.
        """
        if tag.get('id'):
            return f"#{tag.get('id')}"

        # Fallback to a less specific selector if no ID is available
        selector = tag.name
        if tag.get('class'):
            selector += '.' + '.'.join(tag.get('class'))
        return selector
