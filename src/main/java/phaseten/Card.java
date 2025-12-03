package phaseten;

import java.util.Objects;

public class Card {
    private Color color;
    private String symbol;
    private int value;

    public Card() {
        this(Color.YELLOW, "1");
    }

    public Card(Color color, String symbol) {
        this.color = color;
        this.symbol = symbol;
        this.value = calculateValue(symbol);
    }

    public Card(Card other) {
        this.color = other.color;
        this.symbol = other.symbol;
        this.value = other.value;
    }

    private int calculateValue(String symbol) {
        switch (symbol) {
            case "10":
            case "11":
            case "12":
                return 10;
            case "S":
            case "W":
                return 15;
            default:
                return 5;
        }
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
        this.value = calculateValue(symbol);
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return color + " " + symbol + "(" + value + ")";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Card)) {
            return false;
        }
        Card other = (Card) obj;
        return color == other.color && Objects.equals(symbol, other.symbol) && value == other.value;
    }

    @Override
    public int hashCode() {
        return Objects.hash(color, symbol, value);
    }
}
