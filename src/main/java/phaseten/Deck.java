package phaseten;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private final List<Card> cards = new ArrayList<>();

    public Deck() {
        buildDeck();
    }

    private void buildDeck() {
        cards.clear();
        Color[] standardColors = {Color.YELLOW, Color.RED, Color.GREEN, Color.LIGHT_BLUE};
        for (Color color : standardColors) {
            for (int copy = 0; copy < 2; copy++) {
                for (int number = 1; number <= 12; number++) {
                    cards.add(new Card(color, String.valueOf(number)));
                }
            }
        }
        for (int i = 0; i < 4; i++) {
            cards.add(new Card(Color.DARK_BLUE, "S"));
        }
        for (int i = 0; i < 8; i++) {
            cards.add(new Card(Color.BLACK, "W"));
        }
    }

    public void shuffle() {
        Collections.shuffle(cards);
    }

    public Card deal() {
        if (cards.isEmpty()) {
            return null;
        }
        return cards.remove(0);
    }

    public int size() {
        return cards.size();
    }

    public void addToBottom(Card card) {
        cards.add(card);
    }

    public List<Card> getCards() {
        return cards;
    }
}
