package org.example.ui;

import org.example.game.EightOfAColorGame;
import org.example.model.Deck;
import org.example.player.CardPlayer;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Simple launcher UI for Phase 10 Project demos
 */
public class ProjectLauncher extends JFrame {

    public ProjectLauncher() {
        setTitle("Phase 10 Project - Launcher");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Title
        JLabel titleLabel = new JLabel("Phase 10 Project Demonstrations", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 18));
        titleLabel.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(titleLabel, BorderLayout.NORTH);

        // Button panel
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(5, 1, 10, 10));
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(10, 40, 20, 40));

        // Part 1 Demo Button
        JButton part1Button = new JButton("Run Part 1 Demo (Console)");
        part1Button.addActionListener(e -> runPart1Demo());
        buttonPanel.add(part1Button);

        // Part 2 Demo Button
        JButton part2Button = new JButton("Run Part 2 Game Simulation (Console)");
        part2Button.addActionListener(e -> runPart2Demo());
        buttonPanel.add(part2Button);

        // Part 3 Swing UI Button
        JButton part3SwingButton = new JButton("Open Part 3 UI - Discard Pile (Swing)");
        part3SwingButton.addActionListener(e -> openSwingUI());
        buttonPanel.add(part3SwingButton);

        // Part 3 JavaFX UI Button
        JButton part3JavaFXButton = new JButton("Open Part 3 UI - Discard Pile (JavaFX)");
        part3JavaFXButton.addActionListener(e -> openJavaFXUI());
        buttonPanel.add(part3JavaFXButton);

        // Exit button
        JButton exitButton = new JButton("Exit");
        exitButton.addActionListener(e -> System.exit(0));
        buttonPanel.add(exitButton);

        add(buttonPanel, BorderLayout.CENTER);

        // Info label
        JLabel infoLabel = new JLabel("Console output will appear in the terminal/console", SwingConstants.CENTER);
        infoLabel.setFont(new Font("Arial", Font.ITALIC, 11));
        add(infoLabel, BorderLayout.SOUTH);
    }

    private void runPart1Demo() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Phase 10 — Part 1 Demo");
        System.out.println("=".repeat(50));

        // Create deck, shuffle, create 4 players, deal 10 each, display hands
        Deck deck = new Deck();
        deck.shuffle();

        List<CardPlayer> players = new ArrayList<>();
        for (int p = 0; p < 4; p++) {
            players.add(new CardPlayer("Player " + (p + 1)));
        }
        for (int i = 0; i < 10; i++) {
            for (CardPlayer player : players) {
                player.getHand().add(deck.deal());
            }
        }
        for (CardPlayer player : players) {
            System.out.println(player.getName() + " hand:");
            player.showCards();
            System.out.println();
        }

        System.out.println("Part 1 Demo Complete!");
        System.out.println("=".repeat(50) + "\n");

        JOptionPane.showMessageDialog(this,
            "Part 1 Demo completed!\nCheck the console for output.",
            "Part 1 Complete",
            JOptionPane.INFORMATION_MESSAGE);
    }

    private void runPart2Demo() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Phase 10 — Part 2 Simulation Start");
        System.out.println("=".repeat(50) + "\n");

        new Thread(() -> {
            EightOfAColorGame.runSimulation(4);
            System.out.println("\n" + "=".repeat(50));
            System.out.println("Part 2 Simulation Complete!");
            System.out.println("=".repeat(50) + "\n");

            SwingUtilities.invokeLater(() -> {
                JOptionPane.showMessageDialog(this,
                    "Part 2 Simulation completed!\nCheck the console for game output.",
                    "Part 2 Complete",
                    JOptionPane.INFORMATION_MESSAGE);
            });
        }).start();
    }

    private void openSwingUI() {
        SwingUtilities.invokeLater(() -> {
            DiscardPileSwingApp swingUI = new DiscardPileSwingApp();
            swingUI.setVisible(true);
        });
    }

    private void openJavaFXUI() {
        JOptionPane.showMessageDialog(this,
            "JavaFX is not supported in this environment.\nPlease use the Swing UI instead.",
            "JavaFX Not Available",
            JOptionPane.WARNING_MESSAGE);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ProjectLauncher launcher = new ProjectLauncher();
            launcher.setVisible(true);
        });
    }
}
