from src.perception.perception import Perception
from src.planner.planner import Planner
from src.navigator.navigator import Navigator
from src.verifier.verifier import Verifier


class Orchestrator:
    def __init__(self):
        self.perception = Perception()
        self.planner = Planner()
        self.navigator = Navigator()
        self.verifier = Verifier()

    def run(self):
        """
        Runs the main loop of the AI-Assisted Browser.
        """
        print("Starting the Orchestrator loop...")

        # 1. Perceive
        current_state = self.perception.perceive()

        # 2. Plan
        action_plan = self.planner.plan(current_state)

        # 3. Execute
        self.navigator.execute(action_plan)

        # 4. Verify
        success = self.verifier.verify(current_state)

        if success:
            print("Orchestrator loop finished successfully.")
        else:
            print("Orchestrator loop finished with verification failure.")
