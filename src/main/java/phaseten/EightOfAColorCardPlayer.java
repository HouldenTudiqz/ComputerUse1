package phaseten;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;
import java.util.Stack;

public class EightOfAColorCardPlayer extends CardPlayer {
    private Color selectedColor;
    private boolean hasLaidDown = false;
    private final LinkedList<Card> groupOne = new LinkedList<>();
    private final List<Card> groupTwo = new ArrayList<>();
    private final List<Card> groupThree = new ArrayList<>();
    private final Random random = new Random();

    public EightOfAColorCardPlayer(String name) {
        super(name);
    }

    public void initializePhaseState() {
        determineColorPreference();
        regroupHand();
    }

    private void determineColorPreference() {
        int bestCount = -1;
        Color bestColor = Color.YELLOW;
        Color[] candidates = {Color.YELLOW, Color.RED, Color.GREEN, Color.LIGHT_BLUE};
        for (Color color : candidates) {
            int count = 0;
            for (Card card : hand) {
                if (card.getColor() == color) {
                    count++;
                }
            }
            if (count > bestCount) {
                bestCount = count;
                bestColor = color;
            }
        }
        selectedColor = bestColor;
    }

    private void regroupHand() {
        groupOne.clear();
        groupTwo.clear();
        groupThree.clear();
        for (Card card : hand) {
            addToGroup(card);
        }
        if (groupOne.size() >= 8) {
            hasLaidDown = true;
        }
    }

    private void addToGroup(Card card) {
        if (card == null) {
            return;
        }
        if (card.getSymbol().equals("W") || card.getColor() == selectedColor) {
            groupOne.add(card);
        } else if (card.getSymbol().equals("S")) {
            groupTwo.add(card);
        } else {
            groupThree.add(card);
        }
    }

    public Color getSelectedColor() {
        return selectedColor;
    }

    public boolean hasLaidDown() {
        return hasLaidDown;
    }

    @Override
    public List<Card> getHand() {
        List<Card> combined = new ArrayList<>();
        combined.addAll(groupOne);
        combined.addAll(groupTwo);
        combined.addAll(groupThree);
        return combined;
    }

    @Override
    public void showCards() {
        System.out.println(getName() + " chosen color: " + selectedColor);
        System.out.println("  Group 1 (phase cards): " + groupOne);
        System.out.println("  Group 2 (skips): " + groupTwo);
        System.out.println("  Group 3 (others): " + groupThree);
    }

    public Card chooseCard(Stack<Card> discardPile, Deck deck, List<Color> tabledColors) {
        Card topCard = discardPile.isEmpty() ? null : discardPile.peek();
        boolean canDrawDiscard = topCard != null
            && !"S".equals(topCard.getSymbol())
            && ("W".equals(topCard.getSymbol())
                || topCard.getColor() == selectedColor
                || (hasLaidDown && tabledColors.contains(topCard.getColor())));
        if (canDrawDiscard) {
            return discardPile.pop();
        }
        return deck.deal();
    }

    public void checkHandStatus(Card drawnCard, List<Color> tabledColors) {
        if (drawnCard != null) {
            hand.add(drawnCard);
            addToGroup(drawnCard);
        }
        if (!hasLaidDown && groupOne.size() >= 8) {
            hasLaidDown = true;
            if (!tabledColors.contains(selectedColor)) {
                tabledColors.add(selectedColor);
            }
        }
        if (hasLaidDown) {
            playAdditionalCards(tabledColors);
        }
    }

    private void playAdditionalCards(List<Color> tabledColors) {
        List<Card> playable = new ArrayList<>();
        for (Card card : groupThree) {
            if ("W".equals(card.getSymbol()) || tabledColors.contains(card.getColor())) {
                playable.add(card);
            }
        }
        groupThree.removeAll(playable);
        hand.removeAll(playable);
    }

    public Card discardDecision() {
        if (!groupTwo.isEmpty()) {
            Card skip = groupTwo.remove(0);
            hand.remove(skip);
            return skip;
        }
        if (getHand().size() == 1) {
            Card last = getHand().get(0);
            removeFromGroups(last);
            hand.remove(last);
            return last;
        }
        if (!groupThree.isEmpty()) {
            Card discard = groupThree.remove(random.nextInt(groupThree.size()));
            hand.remove(discard);
            return discard;
        }
        if (!groupOne.isEmpty()) {
            Card discard = groupOne.removeFirst();
            hand.remove(discard);
            return discard;
        }
        return null;
    }

    private void removeFromGroups(Card card) {
        groupOne.remove(card);
        groupTwo.remove(card);
        groupThree.remove(card);
    }
}
