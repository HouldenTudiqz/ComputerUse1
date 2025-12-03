package phaseten;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Stack;

public class EightOfAColorGame {
    private final List<EightOfAColorCardPlayer> players;
    private final Deck deck;
    private final Stack<Card> discardPile = new Stack<>();
    private final List<Color> tabledColors = new ArrayList<>();
    private boolean skipNext = false;

    public EightOfAColorGame(List<EightOfAColorCardPlayer> players) {
        this.players = players;
        this.deck = new Deck();
        this.deck.shuffle();
    }

    public void play() {
        dealInitialHands();
        startDiscardPile();
        int currentIndex = 0;
        while (true) {
            EightOfAColorCardPlayer currentPlayer = players.get(currentIndex);
            if (shouldSkip()) {
                System.out.println(currentPlayer.getName() + " is skipped.");
            } else {
                takeTurn(currentPlayer);
                if (currentPlayer.getHand().isEmpty()) {
                    System.out.println(currentPlayer.getName() + " wins the phase!\n");
                    scoreRemainingPlayers(currentPlayer);
                    break;
                }
            }
            currentIndex = (currentIndex + 1) % players.size();
            if (deck.size() == 0) {
                replenishDeck();
            }
        }
    }

    private void dealInitialHands() {
        for (int i = 0; i < 10; i++) {
            for (EightOfAColorCardPlayer player : players) {
                Card dealt = deck.deal();
                player.addCard(dealt);
            }
        }
        for (EightOfAColorCardPlayer player : players) {
            player.initializePhaseState();
            if (player.hasLaidDown() && !tabledColors.contains(player.getSelectedColor())) {
                tabledColors.add(player.getSelectedColor());
            }
        }
    }

    private void startDiscardPile() {
        Card first = deck.deal();
        if (first != null) {
            discardPile.push(first);
            if ("S".equals(first.getSymbol())) {
                skipNext = true;
            }
        }
    }

    private boolean shouldSkip() {
        if (skipNext) {
            skipNext = false;
            return true;
        }
        return false;
    }

    private void takeTurn(EightOfAColorCardPlayer player) {
        System.out.println("-- " + player.getName() + "'s turn --");
        if (deck.size() == 0) {
            replenishDeck();
        }
        Card drawn = player.chooseCard(discardPile, deck, tabledColors);
        System.out.println(player.getName() + " drew: " + drawn);
        player.checkHandStatus(drawn, tabledColors);
        Card discarded = player.discardDecision();
        if (discarded != null) {
            System.out.println(player.getName() + " discarded: " + discarded);
            discardPile.push(discarded);
            if ("S".equals(discarded.getSymbol())) {
                skipNext = true;
            }
        }
        player.showCards();
        System.out.println();
    }

    private void replenishDeck() {
        if (discardPile.size() <= 1) {
            return;
        }
        Card top = discardPile.pop();
        List<Card> toShuffle = new ArrayList<>();
        while (!discardPile.isEmpty()) {
            toShuffle.add(discardPile.pop());
        }
        Collections.shuffle(toShuffle);
        for (Card card : toShuffle) {
            deck.addToBottom(card);
        }
        discardPile.push(top);
        System.out.println("Deck replenished from discard pile.");
    }

    private void scoreRemainingPlayers(EightOfAColorCardPlayer winner) {
        for (EightOfAColorCardPlayer player : players) {
            if (player == winner) {
                continue;
            }
            int score = player.getHand().stream().mapToInt(Card::getValue).sum();
            System.out.println(player.getName() + " score: " + score);
        }
    }

    public Stack<Card> getDiscardPile() {
        return discardPile;
    }
}
