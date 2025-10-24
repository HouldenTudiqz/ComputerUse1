import unittest
from unittest.mock import patch, MagicMock

from src.orchestrator.orchestrator import Orchestrator

class TestOrchestrator(unittest.TestCase):
    @patch('src.orchestrator.orchestrator.Perception')
    @patch('src.orchestrator.orchestrator.Planner')
    @patch('src.orchestrator.orchestrator.Navigator')
    @patch('src.orchestrator.orchestrator.Verifier')
    def test_run_loop_calls_modules_in_order(self, MockVerifier, MockNavigator, MockPlanner, MockPerception):
        """
        Tests that the run loop calls the core modules in the correct order.
        """
        # Arrange
        mock_perception = MockPerception.return_value
        mock_planner = MockPlanner.return_value
        mock_navigator = MockNavigator.return_value
        mock_verifier = MockVerifier.return_value

        mock_perception.perceive.return_value = {"elements": [{"type": "link", "text": "Goal", "href": "/goal"}]}
        mock_planner.plan.return_value = [{"action": "click", "selector": "a[href='/goal']"}]
        mock_verifier.verify.return_value = True

        orchestrator = Orchestrator(goal="Goal")

        # Act
        orchestrator.run()

        # Assert
        mock_navigator.start_browser.assert_called_once()
        mock_navigator.goto.assert_called_once_with("http://toscrape.com/")
        self.assertEqual(mock_perception.perceive.call_count, 2)
        mock_planner.plan.assert_called_once()
        mock_navigator.click.assert_called_once_with("a[href='/goal']")
        mock_verifier.verify.assert_called_once()
        mock_navigator.close_browser.assert_called_once()

if __name__ == '__main__':
    unittest.main()
