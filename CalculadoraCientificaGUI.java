import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Locale;

/**
 * CalculadoraCientificaGUI.java
 * Interface Gráfica Científica em Java Swing com Funções Trigonométricas, Logaritmos e Memória.
 * Execução: java CalculadoraCientificaGUI.java
 */
public class CalculadoraCientificaGUI extends JFrame implements ActionListener {

    private final JTextField visor;
    private final JLabel labelStatus;
    private double primeiroNumero = 0;
    private String operador = "";
    private boolean inicioNovo = true;
    private boolean modoRadianos = false;
    private double memoria = 0;
    private final int precisao = 6;

    public CalculadoraCientificaGUI() {
        super("Calculadora Java - Científica");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(480, 560);
        setLocationRelativeTo(null);
        setResizable(false);

        Color corFundo = new Color(24, 24, 27);
        getContentPane().setBackground(corFundo);
        setLayout(new BorderLayout(8, 8));

        // Painel Superior
        JPanel topo = new JPanel(new BorderLayout(4, 4));
        topo.setBackground(corFundo);
        topo.setBorder(BorderFactory.createEmptyBorder(12, 14, 4, 14));

        labelStatus = new JLabel("MODO: GRAUS (DEG) | M = 0", SwingConstants.RIGHT);
        labelStatus.setFont(new Font("SansSerif", Font.PLAIN, 12));
        labelStatus.setForeground(new Color(161, 161, 170));
        topo.add(labelStatus, BorderLayout.NORTH);

        visor = new JTextField("0");
        visor.setEditable(false);
        visor.setHorizontalAlignment(JTextField.RIGHT);
        visor.setFont(new Font("SansSerif", Font.BOLD, 28));
        visor.setBackground(new Color(9, 9, 11));
        visor.setForeground(Color.WHITE);
        visor.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(63, 63, 70)),
            BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));
        topo.add(visor, BorderLayout.CENTER);
        add(topo, BorderLayout.NORTH);

        // Grade de Botões
        JPanel grid = new JPanel(new GridLayout(7, 5, 6, 6));
        grid.setBackground(corFundo);
        grid.setBorder(BorderFactory.createEmptyBorder(4, 14, 14, 14));

        String[] botoes = {
            "DEG/RAD", "MC", "MR", "M+", "M-",
            "sin", "cos", "tan", "π", "e",
            "ln", "log", "x²", "xʸ", "√",
            "C", "⌫", "+/-", "%", "÷",
            "7", "8", "9", "n!", "×",
            "4", "5", "6", "1/x", "-",
            "1", "2", "3", "0", "+",
            ".", "EXP", "(", ")", "="
        };

        for (String b : botoes) {
            JButton btn = new JButton(b);
            btn.setFont(new Font("SansSerif", Font.BOLD, 13));
            btn.setFocusPainted(false);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));

            if ("=÷×-+".contains(b)) {
                btn.setBackground(new Color(249, 115, 22));
                btn.setForeground(Color.WHITE);
            } else if ("sin cos tan ln log x² xʸ √ n! 1/x π e DEG/RAD".contains(b)) {
                btn.setBackground(new Color(30, 41, 59));
                btn.setForeground(new Color(56, 189, 248));
            } else if ("MC MR M+ M- C ⌫ +/- %".contains(b)) {
                btn.setBackground(new Color(63, 63, 70));
                btn.setForeground(Color.WHITE);
            } else {
                btn.setBackground(new Color(39, 39, 42));
                btn.setForeground(Color.WHITE);
            }

            btn.addActionListener(this);
            grid.add(btn);
        }

        add(grid, BorderLayout.CENTER);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String cmd = e.getActionCommand();

        try {
            if (cmd.matches("[0-9]")) {
                if (inicioNovo || visor.getText().equals("0")) {
                    visor.setText(cmd);
                    inicioNovo = false;
                } else {
                    visor.setText(visor.getText() + cmd);
                }
            } else if (cmd.equals(".")) {
                if (inicioNovo) { visor.setText("0."); inicioNovo = false; }
                else if (!visor.getText().contains(".")) visor.setText(visor.getText() + ".");
            } else if (cmd.equals("C")) {
                visor.setText("0");
                primeiroNumero = 0;
                operador = "";
                inicioNovo = true;
            } else if (cmd.equals("⌫")) {
                String t = visor.getText();
                visor.setText(t.length() > 1 && !inicioNovo ? t.substring(0, t.length() - 1) : "0");
            } else if (cmd.equals("DEG/RAD")) {
                modoRadianos = !modoRadianos;
                atualizarStatus();
            } else if (cmd.equals("π")) {
                visor.setText(formatar(Math.PI));
                inicioNovo = true;
            } else if (cmd.equals("e")) {
                visor.setText(formatar(Math.E));
                inicioNovo = true;
            } else if (cmd.equals("M+")) {
                memoria += Double.parseDouble(visor.getText());
                atualizarStatus();
                inicioNovo = true;
            } else if (cmd.equals("M-")) {
                memoria -= Double.parseDouble(visor.getText());
                atualizarStatus();
                inicioNovo = true;
            } else if (cmd.equals("MR")) {
                visor.setText(formatar(memoria));
                inicioNovo = true;
            } else if (cmd.equals("MC")) {
                memoria = 0;
                atualizarStatus();
            } else if (cmd.equals("sin") || cmd.equals("cos") || cmd.equals("tan")) {
                double val = Double.parseDouble(visor.getText());
                double angulo = modoRadianos ? val : Math.toRadians(val);
                double res = cmd.equals("sin") ? Math.sin(angulo) : cmd.equals("cos") ? Math.cos(angulo) : Math.tan(angulo);
                visor.setText(formatar(res));
                inicioNovo = true;
            } else if (cmd.equals("√")) {
                double v = Double.parseDouble(visor.getText());
                if (v < 0) visor.setText("Erro: Raiz < 0");
                else visor.setText(formatar(Math.sqrt(v)));
                inicioNovo = true;
            } else if (cmd.equals("x²")) {
                double v = Double.parseDouble(visor.getText());
                visor.setText(formatar(v * v));
                inicioNovo = true;
            } else if (cmd.equals("ln")) {
                double v = Double.parseDouble(visor.getText());
                if (v <= 0) visor.setText("Erro: ln <= 0");
                else visor.setText(formatar(Math.log(v)));
                inicioNovo = true;
            } else if (cmd.equals("log")) {
                double v = Double.parseDouble(visor.getText());
                if (v <= 0) visor.setText("Erro: log <= 0");
                else visor.setText(formatar(Math.log10(v)));
                inicioNovo = true;
            } else if (cmd.equals("1/x")) {
                double v = Double.parseDouble(visor.getText());
                if (v == 0) visor.setText("Erro: Div/0");
                else visor.setText(formatar(1.0 / v));
                inicioNovo = true;
            } else if (cmd.equals("n!")) {
                double v = Double.parseDouble(visor.getText());
                if (v < 0 || v != (int) v) visor.setText("Erro: Inteiro >= 0");
                else {
                    long f = 1;
                    for (int i = 2; i <= (int) v; i++) f *= i;
                    visor.setText(String.valueOf(f));
                }
                inicioNovo = true;
            } else if ("+-×÷xʸ".contains(cmd)) {
                primeiroNumero = Double.parseDouble(visor.getText());
                operador = cmd;
                inicioNovo = true;
            } else if (cmd.equals("=")) {
                if (!operador.isEmpty()) {
                    double n2 = Double.parseDouble(visor.getText());
                    double r = 0;
                    switch (operador) {
                        case "+": r = primeiroNumero + n2; break;
                        case "-": r = primeiroNumero - n2; break;
                        case "×": r = primeiroNumero * n2; break;
                        case "÷":
                            if (n2 == 0) { visor.setText("Erro: Div/0"); return; }
                            r = primeiroNumero / n2; break;
                        case "xʸ": r = Math.pow(primeiroNumero, n2); break;
                    }
                    visor.setText(formatar(r));
                    operador = "";
                    inicioNovo = true;
                }
            }
        } catch (Exception ex) {
            visor.setText("Erro");
            inicioNovo = true;
        }
    }

    private void atualizarStatus() {
        labelStatus.setText(String.format("MODO: %s | M = %s",
            modoRadianos ? "RADIANOS (RAD)" : "GRAUS (DEG)", formatar(memoria)));
    }

    private String formatar(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return "Erro";
        if (val == (long) val) return String.valueOf((long) val);
        return String.format(Locale.US, "%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\.$", "");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new CalculadoraCientificaGUI().setVisible(true));
    }
}
