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
        self.navigator.start_browser()

        try:
            # 1. Perceive
            current_state = self.perception.perceive()

            # 2. Plan
            # For now, we'll use a hardcoded plan.
            # In the future, this will come from the planner.
            action_plan = [
                {"action": "goto", "url": "http://toscrape.com/"},
                {"action": "click", "selector": "a[href*='books.toscrape.com']"}
            ]

            # 3. Execute
            for action in action_plan:
                if action["action"] == "goto":
                    self.navigator.goto(action["url"])
                elif action["action"] == "click":
                    self.navigator.click(action["selector"])

            # 4. Verify
            success = self.verifier.verify(current_state)

            if success:
                print("Orchestrator loop finished successfully.")
            else:
                print("Orchestrator loop finished with verification failure.")
        finally:
            self.navigator.close_browser()
