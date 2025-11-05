from src.perception.perception import Perception
from src.planner.planner import Planner
from src.navigator.navigator import Navigator
from src.verifier.verifier import Verifier

class Orchestrator:
    def __init__(self, goal):
        self.perception = Perception()
        self.planner = Planner(goal=goal)
        self.navigator = Navigator()
        self.verifier = Verifier()

    def run(self):
        """
        Runs the main loop of the AI-Assisted Browser.
        """
        print(f"Starting the Orchestrator loop with goal: {self.planner.goal}")
        self.navigator.start_browser()

        try:
            # Start at a known URL
            self.navigator.goto("http://books.toscrape.com/")

            # Wait for the page to be fully loaded
            self.navigator.page.wait_for_load_state('domcontentloaded')

            # 1. Perceive
            current_state = self.perception.perceive(self.navigator.page)
            print(f"Perceived {len(current_state['elements'])} elements.")

            # 2. Plan
            action_plan = self.planner.plan(current_state)

            # 3. Execute
            if action_plan:
                print(f"Planner generated a plan with {len(action_plan)} steps.")
                for action in action_plan:
                    if action["action"] == "click":
                        self.navigator.click(action["selector"])

                # Wait for the page to be fully loaded after the click
                self.navigator.page.wait_for_load_state('domcontentloaded')

                # After executing the plan, perceive the new state
                final_state = self.perception.perceive(self.navigator.page)

                # 4. Verify
                success = self.verifier.verify(final_state)

                if success:
                    print("Orchestrator loop finished successfully.")
                else:
                    print("Orchestrator loop finished with verification failure.")
            else:
                print("Planner did not generate a plan. Nothing to execute.")

        finally:
            self.navigator.close_browser()
