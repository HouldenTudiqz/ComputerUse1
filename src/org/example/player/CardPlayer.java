package org.example.player;

import org.example.model.Card;

import java.util.ArrayList;
import java.util.List;

public class CardPlayer {
    private final String name;
    protected final List<Card> hand;

    public CardPlayer(String name) {
        this.name = name;
        this.hand = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public List<Card> getHand() {
        return hand;
    }

    public void showCards() {
        for (Card c : hand) {
            System.out.println(c);
        }
    }
}
