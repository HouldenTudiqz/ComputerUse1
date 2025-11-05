from src.orchestrator.orchestrator import Orchestrator

if __name__ == "__main__":
    goal = "A Light in the"
    orchestrator = Orchestrator(goal=goal)
    orchestrator.run()
