package phaseten;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.util.Arrays;
import java.util.List;
import java.util.Stack;

public class DiscardPileVisualizer extends Application {
    private final Rectangle cardFace = new Rectangle(140, 200);
    private final Text label = new Text();
    private final Stack<Card> stack = new Stack<>();

    @Override
    public void start(Stage stage) {
        cardFace.setStroke(Color.BLACK);
        cardFace.setFill(Color.WHITE);
        label.setStyle("-fx-font-size: 24px; -fx-font-weight: bold;");

        StackPane pane = new StackPane(cardFace, label);
        stage.setScene(new Scene(pane, 200, 260));
        stage.setTitle("Discard Pile");
        stage.show();

        simulateStackChanges();
    }

    private void updateCard(Card card) {
        if (card == null) {
            cardFace.setFill(Color.LIGHTGRAY);
            label.setText("");
            return;
        }
        cardFace.setFill(colorToPaint(card.getColor()));
        label.setText(card.getSymbol());
    }

    private Color colorToPaint(phaseten.Color color) {
        switch (color) {
            case RED:
                return Color.RED;
            case GREEN:
                return Color.GREEN;
            case LIGHT_BLUE:
                return Color.LIGHTBLUE;
            case DARK_BLUE:
                return Color.DARKBLUE;
            case BLACK:
                return Color.BLACK;
            default:
                return Color.GOLD;
        }
    }

    private void simulateStackChanges() {
        List<Card> demo = Arrays.asList(
            new Card(phaseten.Color.YELLOW, "5"),
            new Card(phaseten.Color.RED, "S"),
            new Card(phaseten.Color.GREEN, "9"),
            new Card(phaseten.Color.BLACK, "W")
        );
        Timeline timeline = new Timeline(new KeyFrame(Duration.seconds(2), event -> {
            if (stack.size() < demo.size()) {
                stack.push(demo.get(stack.size()));
            } else if (!stack.isEmpty()) {
                stack.pop();
            }
            updateCard(stack.isEmpty() ? null : stack.peek());
        }));
        timeline.setCycleCount(demo.size() * 2);
        timeline.play();
    }

    public static void main(String[] args) {
        launch();
    }
}
