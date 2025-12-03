package org.example.model;

import java.util.Objects;

public class Card {
    private Color color;
    private String symbol; // "1"-"12", "S", "W"
    private int value;

    public Card() {
    }

    public Card(Color color, String symbol) {
        this.color = color;
        this.symbol = symbol;
        this.value = computeValue(symbol);
    }

    // Copy constructor
    public Card(Card other) {
        this.color = other.color;
        this.symbol = other.symbol;
        this.value = other.value;
    }

    private int computeValue(String symbol) {
        if (symbol.equals("S") || symbol.equals("W")) {
            return 15;
        }
        int num = Integer.parseInt(symbol);
        if (num >= 1 && num <= 9) {
            return 5;
        } else if (num >= 10 && num <= 12) {
            return 10;
        }
        return 0;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
        this.value = computeValue(symbol);
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public boolean isSkip() {
        return "S".equals(symbol);
    }

    public boolean isWild() {
        return "W".equals(symbol);
    }

    @Override
    public String toString() {
        return color + "-" + symbol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return color == card.color && Objects.equals(symbol, card.symbol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(color, symbol);
    }
}
