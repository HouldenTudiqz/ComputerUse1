import unittest

from src.planner.planner import Planner

class TestPlanner(unittest.TestCase):

    def test_plan_generates_click_action_for_matching_link(self):
        """
        Tests that the planner generates a click action when a link
        matching the goal is found.
        """
        # Arrange
        perceived_state = {
            "title": "Test Page",
            "elements": [
                {"type": "link", "text": "Go to Goal", "href": "/goal-page", "selector": "#goal-link"}
            ]
        }
        planner = Planner(goal="Goal")

        # Act
        plan = planner.plan(perceived_state)

        # Assert
        self.assertEqual(len(plan), 1)
        self.assertEqual(plan[0]["action"], "click")
        self.assertEqual(plan[0]["selector"], "#goal-link")

    def test_plan_returns_empty_list_when_no_matching_link_is_found(self):
        """
        Tests that the planner returns an empty list when no link
        matching the goal is found.
        """
        # Arrange
        perceived_state = {
            "title": "Test Page",
            "elements": [
                {"type": "link", "text": "Some other link", "href": "/other-page", "selector": "#other-link"}
            ]
        }
        planner = Planner(goal="Goal")

        # Act
        plan = planner.plan(perceived_state)

        # Assert
        self.assertEqual(len(plan), 0)

if __name__ == '__main__':
    unittest.main()
