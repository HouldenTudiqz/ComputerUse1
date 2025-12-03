package org.example.ui;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;
import org.example.model.Card;

public class DiscardPileApp extends Application {

    private final ObservableList<Card> discardPile = FXCollections.observableArrayList();

    private Rectangle cardRect;
    private Label cardLabel;

    @Override
    public void start(Stage primaryStage) {
        cardRect = new Rectangle(100, 150);
        cardRect.setArcWidth(15);
        cardRect.setArcHeight(15);
        cardRect.setStroke(Color.BLACK);

        cardLabel = new Label("");

        StackPane cardPane = new StackPane(cardRect, cardLabel);
        cardPane.setPadding(new Insets(10));

        Button pushButton = new Button("Push Random Card");
        pushButton.setOnAction(e -> pushRandomCard());

        Button popButton = new Button("Pop Card");
        popButton.setOnAction(e -> popCard());

        HBox controls = new HBox(10, pushButton, popButton);
        controls.setPadding(new Insets(10));

        BorderPane root = new BorderPane();
        root.setCenter(cardPane);
        root.setBottom(controls);

        updateDisplay();

        Scene scene = new Scene(root, 300, 250);
        primaryStage.setTitle("Discard Pile Visualizer");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void pushRandomCard() {
        // Simple demo: cycle through some colors and symbols
        org.example.model.Color[] colors = {org.example.model.Color.YELLOW, org.example.model.Color.RED, org.example.model.Color.GREEN, org.example.model.Color.LIGHT_BLUE, org.example.model.Color.DARK_BLUE, org.example.model.Color.BLACK};
        String[] symbols = {"1", "5", "9", "12", "S", "W"};
        int idx = (int) (Math.random() * colors.length);
        int sIdx = (int) (Math.random() * symbols.length);
        Card card = new Card(colors[idx], symbols[sIdx]);
        discardPile.add(card);
        updateDisplay();
    }

    private void popCard() {
        if (!discardPile.isEmpty()) {
            discardPile.remove(discardPile.size() - 1);
            updateDisplay();
        }
    }

    private void updateDisplay() {
        if (discardPile.isEmpty()) {
            cardRect.setFill(Color.LIGHTGRAY);
            cardLabel.setText("");
        } else {
            Card top = discardPile.get(discardPile.size() - 1);
            // Map card color to JavaFX color
            Color fxColor;
            switch (top.getColor()) {
                case YELLOW -> fxColor = Color.GOLD;
                case RED -> fxColor = Color.RED;
                case GREEN -> fxColor = Color.LIMEGREEN;
                case LIGHT_BLUE -> fxColor = Color.LIGHTBLUE;
                case DARK_BLUE -> fxColor = Color.DARKBLUE;
                case BLACK -> fxColor = Color.DIMGRAY;
                default -> fxColor = Color.LIGHTGRAY;
            }
            cardRect.setFill(fxColor);
            cardLabel.setText(top.getSymbol());
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
