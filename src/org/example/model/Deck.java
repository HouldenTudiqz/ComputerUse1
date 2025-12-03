package org.example.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private final List<Card> cards = new ArrayList<>();

    public Deck() {
        // 2 copies of numbers 1-12 in yellow, red, green, light blue
        Color[] numberColors = {Color.YELLOW, Color.RED, Color.GREEN, Color.LIGHT_BLUE};
        for (Color color : numberColors) {
            for (int copy = 0; copy < 2; copy++) {
                for (int n = 1; n <= 12; n++) {
                    cards.add(new Card(color, String.valueOf(n)));
                }
            }
        }
        // 4 dark blue Skip cards
        for (int i = 0; i < 4; i++) {
            cards.add(new Card(Color.DARK_BLUE, "S"));
        }
        // 8 black Wild cards
        for (int i = 0; i < 8; i++) {
            cards.add(new Card(Color.BLACK, "W"));
        }
    }

    public void shuffle() {
        Collections.shuffle(cards);
    }

    public Card deal() {
        if (cards.isEmpty()) return null;
        return cards.remove(0);
    }

    public int size() {
        return cards.size();
    }

    public boolean isEmpty() {
        return cards.isEmpty();
    }

    public void addToBottom(Card card) {
        cards.add(card);
    }

    public List<Card> getCards() {
        return cards;
    }
}
