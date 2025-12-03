package org.example;

import org.example.game.EightOfAColorGame;
import org.example.model.Deck;
import org.example.player.CardPlayer;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("Phase 10 — Part 1 Demo");

        // Part 1: Create deck, shuffle, create 4 players, deal 10 each, display hands
        Deck deck = new Deck();
        deck.shuffle();

        List<CardPlayer> players = new ArrayList<>();
        for (int p = 0; p < 4; p++) {
            players.add(new CardPlayer("Player " + (p + 1)));
        }
        for (int i = 0; i < 10; i++) {
            for (CardPlayer player : players) {
                player.getHand().add(deck.deal());
            }
        }
        for (CardPlayer player : players) {
            System.out.println(player.getName() + " hand:");
            player.showCards();
            System.out.println();
        }

        // Part 2: Run the Eight-Of-A-Color phase simulation
        System.out.println("\nPhase 10 — Part 2 Simulation Start\n");
        EightOfAColorGame.runSimulation(4);

        // Part 3 UI Options (run separately):
        System.out.println("\n=== Part 3 UI Available ===");
        System.out.println("Option 1 (Recommended): Run org.example.ui.DiscardPileSwingApp");
        System.out.println("Option 2 (Graphical Launcher): Run org.example.ui.ProjectLauncher");
        System.out.println("Option 3 (JavaFX - needs config): Run org.example.ui.DiscardPileApp");
    }
}
