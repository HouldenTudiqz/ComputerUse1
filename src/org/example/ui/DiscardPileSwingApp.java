package org.example.ui;

import org.example.model.Card;

import javax.swing.*;
import java.awt.*;

/**
 * Swing-based Discard Pile Visualizer (Part 3)
 * This is a simpler alternative to JavaFX that works without module configuration.
 *
 * Shows a card-sized rectangle representing the top of the discard pile stack.
 * Displays correct color and symbol/value.
 * Demonstrates stack push/pop behavior.
 */
public class DiscardPileSwingApp extends JFrame {

    private java.util.Stack<Card> discardPile = new java.util.Stack<>();
    private CardPanel cardPanel;

    public DiscardPileSwingApp() {
        setTitle("Phase 10 - Discard Pile Visualizer");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(300, 250);
        setResizable(false);
        setLocationRelativeTo(null);

        // Main layout
        setLayout(new BorderLayout());

        // Card display panel
        cardPanel = new CardPanel();
        add(cardPanel, BorderLayout.CENTER);

        // Control panel with buttons
        JPanel controlPanel = new JPanel();
        controlPanel.setLayout(new FlowLayout());

        JButton pushButton = new JButton("Push Random Card");
        pushButton.addActionListener(e -> pushRandomCard());

        JButton popButton = new JButton("Pop Card");
        popButton.addActionListener(e -> popCard());

        controlPanel.add(pushButton);
        controlPanel.add(popButton);

        add(controlPanel, BorderLayout.SOUTH);
    }

    private void pushRandomCard() {
        // Create a random card
        org.example.model.Color[] colors = {
            org.example.model.Color.YELLOW,
            org.example.model.Color.RED,
            org.example.model.Color.GREEN,
            org.example.model.Color.LIGHT_BLUE,
            org.example.model.Color.DARK_BLUE,
            org.example.model.Color.BLACK
        };
        String[] symbols = {"1", "5", "9", "12", "S", "W"};

        int colorIdx = (int) (Math.random() * colors.length);
        int symbolIdx = (int) (Math.random() * symbols.length);

        Card card = new Card(colors[colorIdx], symbols[symbolIdx]);
        discardPile.push(card);
        cardPanel.updateDisplay(discardPile.isEmpty() ? null : discardPile.peek());

        System.out.println("Pushed: " + card + " (Stack size: " + discardPile.size() + ")");
    }

    private void popCard() {
        if (!discardPile.isEmpty()) {
            Card popped = discardPile.pop();
            cardPanel.updateDisplay(discardPile.isEmpty() ? null : discardPile.peek());
            System.out.println("Popped: " + popped + " (Stack size: " + discardPile.size() + ")");
        } else {
            System.out.println("Stack is empty - nothing to pop");
        }
    }

    /**
     * Inner class to display the card as a colored rectangle with symbol
     */
    private class CardPanel extends JPanel {
        private Card currentCard = null;

        public CardPanel() {
            setPreferredSize(new Dimension(300, 200));
            setBackground(Color.WHITE);
        }

        public void updateDisplay(Card card) {
            this.currentCard = card;
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Card dimensions
            int cardWidth = 100;
            int cardHeight = 150;
            int x = (getWidth() - cardWidth) / 2;
            int y = (getHeight() - cardHeight) / 2;

            if (currentCard == null) {
                // Empty stack - show gray blank rectangle
                g2d.setColor(Color.LIGHT_GRAY);
                g2d.fillRoundRect(x, y, cardWidth, cardHeight, 15, 15);
                g2d.setColor(Color.BLACK);
                g2d.drawRoundRect(x, y, cardWidth, cardHeight, 15, 15);
            } else {
                // Show card with correct color
                Color cardColor = getCardColor(currentCard.getColor());
                g2d.setColor(cardColor);
                g2d.fillRoundRect(x, y, cardWidth, cardHeight, 15, 15);
                g2d.setColor(Color.BLACK);
                g2d.drawRoundRect(x, y, cardWidth, cardHeight, 15, 15);

                // Draw symbol in center
                g2d.setColor(Color.BLACK);
                g2d.setFont(new Font("Arial", Font.BOLD, 24));
                FontMetrics fm = g2d.getFontMetrics();
                String symbol = currentCard.getSymbol();
                int symbolX = x + (cardWidth - fm.stringWidth(symbol)) / 2;
                int symbolY = y + (cardHeight + fm.getAscent()) / 2;
                g2d.drawString(symbol, symbolX, symbolY);
            }
        }

        /**
         * Maps our Color enum to Java AWT Color
         */
        private Color getCardColor(org.example.model.Color cardColor) {
            return switch (cardColor) {
                case YELLOW -> Color.YELLOW;
                case RED -> Color.RED;
                case GREEN -> Color.GREEN;
                case LIGHT_BLUE -> new Color(173, 216, 230); // Light blue
                case DARK_BLUE -> new Color(0, 0, 139); // Dark blue
                case BLACK -> Color.DARK_GRAY;
            };
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            DiscardPileSwingApp app = new DiscardPileSwingApp();
            app.setVisible(true);
            System.out.println("=== Phase 10 Discard Pile Visualizer (Swing) ===");
            System.out.println("Use the buttons to push/pop cards from the stack.");
            System.out.println("The colored rectangle shows the top card of the discard pile.");
        });
    }
}
