import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Locale;

/**
 * CalculadoraGUI.java
 * Interface Gráfica Desktop Padrão em Java Swing.
 * Execução: java CalculadoraGUI.java
 */
public class CalculadoraGUI extends JFrame implements ActionListener {

    private final JTextField visor;
    private final JLabel labelHistorico;
    private double primeiroNumero = 0;
    private String operador = "";
    private boolean inicioNovoNumero = true;
    private final int precisao = 6;

    public CalculadoraGUI() {
        super("Calculadora Java");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(360, 520);
        setLocationRelativeTo(null);
        setResizable(false);

        Color corFundo = new Color(24, 24, 27);
        Color corTexto = new Color(250, 250, 250);
        Color corBotaoNum = new Color(39, 39, 42);
        Color corBotaoOp = new Color(249, 115, 22);

        getContentPane().setBackground(corFundo);
        setLayout(new BorderLayout(10, 10));

        // Painel Superior com Visor
        JPanel painelVisor = new JPanel(new BorderLayout(5, 5));
        painelVisor.setBackground(corFundo);
        painelVisor.setBorder(BorderFactory.createEmptyBorder(16, 16, 8, 16));

        labelHistorico = new JLabel(" ", SwingConstants.RIGHT);
        labelHistorico.setForeground(new Color(161, 161, 170));
        labelHistorico.setFont(new Font("SansSerif", Font.PLAIN, 13));
        painelVisor.add(labelHistorico, BorderLayout.NORTH);

        visor = new JTextField("0");
        visor.setEditable(false);
        visor.setHorizontalAlignment(JTextField.RIGHT);
        visor.setFont(new Font("SansSerif", Font.BOLD, 32));
        visor.setBackground(tema.equals("light") ? Color.WHITE : new Color(9, 9, 11));
        visor.setForeground(corTexto);
        visor.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(63, 63, 70), 1),
            BorderFactory.createEmptyBorder(10, 12, 10, 12)
        ));
        painelVisor.add(visor, BorderLayout.CENTER);
        add(painelVisor, BorderLayout.NORTH);

        // Grid de Botões
        JPanel painelBotoes = new JPanel(new GridLayout(5, 4, 8, 8));
        painelBotoes.setBackground(corFundo);
        painelBotoes.setBorder(BorderFactory.createEmptyBorder(0, 16, 16, 16));

        String[] botoes = {
            "C", "+/-", "%", "÷",
            "7", "8", "9", "×",
            "4", "5", "6", "-",
            "1", "2", "3", "+",
            "0", ".", "⌫", "="
        };

        for (String texto : botoes) {
            JButton btn = new JButton(texto);
            btn.setFont(new Font("SansSerif", Font.BOLD, 18));
            btn.setFocusPainted(false);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));

            if ("÷×-+=".contains(texto)) {
                btn.setBackground(corBotaoOp);
                btn.setForeground(Color.WHITE);
            } else if ("C+/-%⌫".contains(texto)) {
                btn.setBackground(new Color(82, 82, 91));
                btn.setForeground(Color.WHITE);
            } else {
                btn.setBackground(corBotaoNum);
                btn.setForeground(corTexto);
            }

            btn.addActionListener(this);
            painelBotoes.add(btn);
        }

        add(painelBotoes, BorderLayout.CENTER);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String cmd = e.getActionCommand();

        if (cmd.matches("[0-9]")) {
            if (inicioNovoNumero || visor.getText().equals("0")) {
                visor.setText(cmd);
                inicioNovoNumero = false;
            } else {
                visor.setText(visor.getText() + cmd);
            }
        } else if (cmd.equals(".")) {
            if (inicioNovoNumero) {
                visor.setText("0.");
                inicioNovoNumero = false;
            } else if (!visor.getText().contains(".")) {
                visor.setText(visor.getText() + ".");
            }
        } else if (cmd.equals("C")) {
            visor.setText("0");
            labelHistorico.setText(" ");
            primeiroNumero = 0;
            operador = "";
            inicioNovoNumero = true;
        } else if (cmd.equals("⌫")) {
            String txt = visor.getText();
            if (txt.length() > 1 && !inicioNovoNumero) {
                visor.setText(txt.substring(0, txt.length() - 1));
            } else {
                visor.setText("0");
                inicioNovoNumero = true;
            }
        } else if (cmd.equals("+/-")) {
            double val = Double.parseDouble(visor.getText());
            visor.setText(formatarResultado(-val));
        } else if (cmd.equals("%")) {
            double val = Double.parseDouble(visor.getText());
            visor.setText(formatarResultado(val / 100.0));
        } else if ("+-×÷".contains(cmd)) {
            primeiroNumero = Double.parseDouble(visor.getText());
            operador = cmd;
            labelHistorico.setText(formatarResultado(primeiroNumero) + " " + operador);
            inicioNovoNumero = true;
        } else if (cmd.equals("=")) {
            if (!operador.isEmpty()) {
                double segundoNumero = Double.parseDouble(visor.getText());
                double resultado = 0;
                boolean erro = false;

                switch (operador) {
                    case "+": resultado = primeiroNumero + segundoNumero; break;
                    case "-": resultado = primeiroNumero - segundoNumero; break;
                    case "×": resultado = primeiroNumero * segundoNumero; break;
                    case "÷":
                        if (segundoNumero == 0) {
                            visor.setText("Erro: Div/0");
                            erro = true;
                        } else {
                            resultado = primeiroNumero / segundoNumero;
                        }
                        break;
                }

                if (!erro) {
                    labelHistorico.setText(formatarResultado(primeiroNumero) + " " + operador + " " + formatarResultado(segundoNumero) + " =");
                    visor.setText(formatarResultado(resultado));
                }
                operador = "";
                inicioNovoNumero = true;
            }
        }
    }

    private String formatarResultado(double val) {
        if (Double.isInfinite(val) || Double.isNaN(val)) return "Erro";
        if (val == (long) val) {
            return String.format(Locale.US, "%d", (long) val);
        }
        return String.format(Locale.US, "%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\.$", "");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new CalculadoraGUI().setVisible(true);
        });
    }
}
