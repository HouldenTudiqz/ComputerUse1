from src.orchestrator.orchestrator import Orchestrator

if __name__ == "__main__":
    goal = "bookstore"
    orchestrator = Orchestrator(goal=goal)
    orchestrator.run()
