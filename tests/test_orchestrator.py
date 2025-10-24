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

        mock_perception.perceive.return_value = {"state": "initial"}
        mock_planner.plan.return_value = {"action": "test_action"}
        mock_verifier.verify.return_value = True

        orchestrator = Orchestrator()

        # Act
        orchestrator.run()

        # Assert
        mock_perception.perceive.assert_called_once()
        mock_planner.plan.assert_called_once_with({"state": "initial"})
        mock_navigator.execute.assert_called_once_with({"action": "test_action"})
        mock_verifier.verify.assert_called_once()

if __name__ == '__main__':
    unittest.main()
