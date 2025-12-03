package org.example.game;

import org.example.model.Card;
import org.example.model.Color;
import org.example.model.Deck;
import org.example.player.EightOfAColorCardPlayer;

import java.util.*;

public class EightOfAColorGame {

    public static void runSimulation(int playerCount) {
        Deck deck = new Deck();
        deck.shuffle();

        List<EightOfAColorCardPlayer> players = new ArrayList<>();
        for (int i = 0; i < playerCount; i++) {
            players.add(new EightOfAColorCardPlayer("P" + (i + 1)));
        }

        // deal 10 cards to each
        for (int r = 0; r < 10; r++) {
            for (EightOfAColorCardPlayer p : players) {
                Card c = deck.deal();
                if (c != null) {
                    p.getHand().add(c);
                }
            }
        }

        // initialize groups and selected colors
        for (EightOfAColorCardPlayer p : players) {
            p.initializeGroups();
        }

        // discard pile stack
        Stack<Card> discardPile = new Stack<>();
        discardPile.push(deck.deal());
        System.out.println("Starting discard pile with: " + discardPile.peek());

        int currentIndex = 0;
        boolean phaseOver = false;
        EightOfAColorCardPlayer winner = null;
        boolean skipNext = false;

        while (!phaseOver) {
            EightOfAColorCardPlayer current = players.get(currentIndex);
            System.out.println("\n--- " + current.getName() + "'s turn ---");

            if (skipNext) {
                System.out.println(current.getName() + " is skipped due to a Skip card.");
                skipNext = false;
                currentIndex = (currentIndex + 1) % players.size();
                continue;
            }

            // Build set of tabled colors
            Set<Color> tabledColors = new HashSet<>();
            for (EightOfAColorCardPlayer p : players) {
                if (p.hasLaidDown()) {
                    tabledColors.add(p.getSelectedColor());
                }
            }

            // choose card source
            Card drawn;
            Card topDiscard = discardPile.isEmpty() ? null : discardPile.peek();
            if (current.shouldTakeDiscard(topDiscard, tabledColors)) {
                drawn = discardPile.pop();
                System.out.println(current.getName() + " draws from discard: " + drawn);
            } else {
                // if deck empty, replenish from discard (keeping top card)
                if (deck.isEmpty()) {
                    if (discardPile.size() > 1) {
                        Card top = discardPile.pop();
                        List<Card> toRecycle = new ArrayList<>(discardPile);
                        discardPile.clear();
                        discardPile.push(top);
                        for (Card c : toRecycle) {
                            deck.addToBottom(c);
                        }
                        deck.shuffle();
                        System.out.println("Deck was empty; recycled discard pile into deck.");
                    } else {
                        System.out.println("Deck empty and not enough cards to recycle. Ending phase.");
                        break;
                    }
                }
                drawn = deck.deal();
                System.out.println(current.getName() + " draws from deck: " + drawn);
            }

            if (drawn != null) {
                current.checkHandStatusAfterDraw(drawn, players);
            }

            if (current.totalCardsInHand() == 0) {
                phaseOver = true;
                winner = current;
                System.out.println(current.getName() + " has no cards left and wins the phase!");
                break;
            }

            // discard step
            Card toDiscard = current.discardDecision();
            if (toDiscard != null) {
                discardPile.push(toDiscard);
                System.out.println(current.getName() + " discards " + toDiscard + ".");
                if (toDiscard.isSkip()) {
                    skipNext = true;
                }
            }

            if (current.totalCardsInHand() == 0) {
                phaseOver = true;
                winner = current;
                System.out.println(current.getName() + " has no cards left and wins the phase!");
            } else {
                currentIndex = (currentIndex + 1) % players.size();
            }
        }

        // scoring
        System.out.println("\nPhase over. Scoring:");
        for (EightOfAColorCardPlayer p : players) {
            if (p == winner) {
                System.out.println(p.getName() + " (winner) has 0 points.");
            } else {
                int score = p.scoreRemainingCards();
                System.out.println(p.getName() + " has " + score + " points remaining.");
            }
        }
    }
}
