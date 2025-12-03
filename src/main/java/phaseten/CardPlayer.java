package phaseten;

import java.util.ArrayList;
import java.util.List;

public class CardPlayer {
    private final String name;
    protected final List<Card> hand = new ArrayList<>();

    public CardPlayer(String name) {
        this.name = name;
    }

    public void addCard(Card card) {
        if (card != null) {
            hand.add(card);
        }
    }

    public String getName() {
        return name;
    }

    public List<Card> getHand() {
        return hand;
    }

    public void showCards() {
        System.out.println(name + " has: " + hand);
    }
}
