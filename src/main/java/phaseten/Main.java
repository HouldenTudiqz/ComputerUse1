package phaseten;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        runPartOneDemo();
        System.out.println("\nStarting Eight of a Color simulation...\n");
        runEightOfAColorGame();
        System.out.println("\nTo view the discard pile visualization, run DiscardPileVisualizer.main().");
    }

    private static void runPartOneDemo() {
        System.out.println("PART 1 DEMO: dealing 10 cards to 4 players.\n");
        Deck deck = new Deck();
        deck.shuffle();
        List<CardPlayer> players = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            players.add(new CardPlayer("Player " + i));
        }
        for (int i = 0; i < 10; i++) {
            for (CardPlayer player : players) {
                player.addCard(deck.deal());
            }
        }
        for (CardPlayer player : players) {
            player.showCards();
        }
    }

    private static void runEightOfAColorGame() {
        List<EightOfAColorCardPlayer> players = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            players.add(new EightOfAColorCardPlayer("Phase Player " + i));
        }
        EightOfAColorGame game = new EightOfAColorGame(players);
        game.play();
    }
}
