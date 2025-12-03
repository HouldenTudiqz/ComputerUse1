package org.example.player;

import org.example.model.Card;
import org.example.model.Color;

import java.util.*;

public class EightOfAColorCardPlayer extends CardPlayer {

    private Color selectedColor; // chosen for the phase
    private boolean hasLaidDown;

    // Group 1: chosen color + wilds (must use a LinkedList)
    private final LinkedList<Card> group1 = new LinkedList<>();
    // Group 2: Skip cards
    private final List<Card> group2 = new ArrayList<>();
    // Group 3: remaining cards
    private final List<Card> group3 = new ArrayList<>();

    public EightOfAColorCardPlayer(String name) {
        super(name);
    }

    public void initializeGroups() {
        // determine color with most cards (ignoring wilds and skips)
        Map<Color, Integer> counts = new EnumMap<>(Color.class);
        for (Card c : hand) {
            if (c.isSkip() || c.isWild()) continue;
            counts.put(c.getColor(), counts.getOrDefault(c.getColor(), 0) + 1);
        }
        // pick color with max count; if tie, any
        Color bestColor = null;
        int bestCount = -1;
        for (Map.Entry<Color, Integer> e : counts.entrySet()) {
            if (e.getValue() > bestCount) {
                bestCount = e.getValue();
                bestColor = e.getKey();
            }
        }
        // fallback if all cards are wild/skip: arbitrarily choose YELLOW
        if (bestColor == null) {
            bestColor = Color.YELLOW;
        }
        selectedColor = bestColor;

        // distribute cards into groups
        for (Card c : new ArrayList<>(hand)) {
            placeCardInGroup(c);
        }
        hand.clear();
    }

    private void placeCardInGroup(Card card) {
        if (card.isSkip()) {
            group2.add(card);
        } else if (card.isWild() || card.getColor() == selectedColor) {
            group1.add(card);
        } else {
            group3.add(card);
        }
    }

    public Color getSelectedColor() {
        return selectedColor;
    }

    public boolean hasLaidDown() {
        return hasLaidDown;
    }

    public int totalCardsInHand() {
        return group1.size() + group2.size() + group3.size();
    }

    public LinkedList<Card> getGroup1() {
        return group1;
    }

    public List<Card> getGroup2() {
        return group2;
    }

    public List<Card> getGroup3() {
        return group3;
    }

    /**
     * Decide whether to take from discard or deck based on rules.
     */
    public boolean shouldTakeDiscard(Card topDiscard, Set<Color> tabledColors) {
        if (topDiscard == null) return false;
        if (topDiscard.isSkip()) return false; // cannot draw skip from discard
        if (topDiscard.isWild()) return true;
        if (topDiscard.getColor() == selectedColor) return true;
        if (hasLaidDown && tabledColors.contains(topDiscard.getColor())) return true;
        return false;
    }

    /**
     * After drawing a card, update internal groupings and possibly lay down.
     */
    public void checkHandStatusAfterDraw(Card drawnCard, List<EightOfAColorCardPlayer> players) {
        placeCardInGroup(drawnCard);

        if (!hasLaidDown && group1.size() >= 8) {
            hasLaidDown = true;
            // when a player lays down, their group1 is considered tabled, but we keep cards in group1 for scoring
            System.out.println(getName() + " has laid down with 8 of " + selectedColor + ".");
        }

        // if already laid down, we can attempt to play off-color cards (group3) onto others' tabled colors
        if (hasLaidDown) {
            playOnOthers(players);
        }
    }

    private void playOnOthers(List<EightOfAColorCardPlayer> players) {
        Iterator<Card> it = group3.iterator();
        while (it.hasNext()) {
            Card c = it.next();
            for (EightOfAColorCardPlayer other : players) {
                if (other == this) continue;
                if (other.hasLaidDown && c.getColor() == other.selectedColor) {
                    // play this card on their tabled group
                    other.group1.add(c); // extend their laid down cards
                    it.remove();
                    System.out.println(getName() + " plays " + c + " on " + other.getName() + "'s table.");
                    break;
                }
            }
        }
    }

    /**
     * Decide which card to discard at end of turn.
     */
    public Card discardDecision() {
        // 1. If has a skip card, discard it immediately
        if (!group2.isEmpty()) {
            return group2.remove(0);
        }
        // 2. If exactly one card total, discard it and end
        if (totalCardsInHand() == 1) {
            if (!group3.isEmpty()) return group3.remove(0);
            if (!group1.isEmpty()) return group1.remove(0);
        }
        // 3. Otherwise, randomly discard from group3 if possible
        if (!group3.isEmpty()) {
            Random r = new Random();
            return group3.remove(r.nextInt(group3.size()));
        }
        // If group3 empty, discard from group1 (last resort)
        if (!group1.isEmpty()) {
            return group1.removeFirst();
        }
        // If no cards at all (shouldn't happen here), return null
        return null;
    }

    public int scoreRemainingCards() {
        int score = 0;
        for (Card c : group1) score += c.getValue();
        for (Card c : group2) score += c.getValue();
        for (Card c : group3) score += c.getValue();
        return score;
    }
}
