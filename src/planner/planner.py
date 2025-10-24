class Planner:
    def __init__(self, goal):
        self.goal = goal

    def plan(self, perceived_state):
        """
        Generates a plan of action based on the perceived state and a goal.
        """
        if not perceived_state or not perceived_state["elements"]:
            return []

        # Simple rule-based planner: find the first link that matches the goal.
        for element in perceived_state["elements"]:
            if element["type"] == "link" and self.goal in element["text"]:
                return [{"action": "click", "selector": element["selector"]}]

        # If no matching link is found, the plan is empty.
        return []
