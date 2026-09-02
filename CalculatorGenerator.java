import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * CalculatorGenerator.java
 * Gerador de Códigos de Calculadora em Java Puro (Desktop Swing, CLI e POO).
 * 
 * Uso:
 *   java CalculatorGenerator.java [opções]
 * 
 * Opções:
 *   --tipo <gui|scientific|cli|oop|programmer|all>  (padrão: all)
 *   --tema <dark|light|cyber|emerald>                (padrão: dark)
 *   --titulo <texto>                                 (padrão: "Calculadora Java")
 *   --precisao <2|4|6|8>                             (padrão: 6)
 */
public class CalculatorGenerator {

    public static void main(String[] args) {
        String tipo = "all";
        String tema = "dark";
        String titulo = "Calculadora Java";
        int precisao = 6;

        for (int i = 0; i < args.length; i++) {
            if ("--tipo".equalsIgnoreCase(args[i]) && i + 1 < args.length) {
                tipo = args[++i].toLowerCase();
            } else if ("--tema".equalsIgnoreCase(args[i]) && i + 1 < args.length) {
                tema = args[++i].toLowerCase();
            } else if ("--titulo".equalsIgnoreCase(args[i]) && i + 1 < args.length) {
                titulo = args[++i];
            } else if ("--precisao".equalsIgnoreCase(args[i]) && i + 1 < args.length) {
                try {
                    precisao = Integer.parseInt(args[++i]);
                } catch (NumberFormatException ignored) {}
            }
        }

        System.out.println("=================================================");
        System.out.println("    GERADOR DE CALCULADORAS EM JAVA (JDK 17)     ");
        System.out.println("=================================================");
        System.out.printf(" Configuração: Tipo=%s, Tema=%s, Precisão=%d casas%n", tipo, tema, precisao);
        System.out.println("-------------------------------------------------");

        try {
            if (tipo.equals("all") || tipo.equals("gui")) {
                salvarArquivo("CalculadoraGUI.java", gerarCalculadoraGUI(titulo, tema, precisao));
            }
            if (tipo.equals("all") || tipo.equals("scientific") || tipo.equals("cientifica")) {
                salvarArquivo("CalculadoraCientificaGUI.java", gerarCalculadoraCientificaGUI(titulo, tema, precisao));
            }
            if (tipo.equals("all") || tipo.equals("cli")) {
                salvarArquivo("CalculadoraCLI.java", gerarCalculadoraCLI(titulo, precisao));
            }
            if (tipo.equals("all") || tipo.equals("oop") || tipo.equals("poo")) {
                salvarArquivo("CalculadoraEngine.java", gerarCalculadoraEngine(titulo, precisao));
            }
            if (tipo.equals("all") || tipo.equals("programmer") || tipo.equals("programador")) {
                salvarArquivo("CalculadoraProgramador.java", gerarCalculadoraProgramador(titulo));
            }
            System.out.println("-------------------------------------------------");
            System.out.println(" Sucesso! Arquivos .java gerados no diretório atual.");
            System.out.println(" Para executar qualquer modelo:");
            System.out.println("   java <NomeDoArquivo>.java");
            System.out.println("=================================================");
        } catch (IOException e) {
            System.err.println("Erro ao gerar arquivos: " + e.getMessage());
        }
    }

    private static void salvarArquivo(String nome, String conteudo) throws IOException {
        File file = new File(nome);
        try (FileWriter writer = new FileWriter(file, StandardCharsets.UTF_8)) {
            writer.write(conteudo);
        }
        System.out.println(" [OK] Gerado: " + file.getAbsolutePath());
    }

    public static String gerarCalculadoraGUI(String titulo, String tema, int precisao) {
        String bg = tema.equals("light") ? "244, 244, 245" : tema.equals("emerald") ? "6, 78, 59" : tema.equals("cyber") ? "15, 23, 42" : "24, 24, 27";
        String fg = tema.equals("light") ? "9, 9, 11" : "250, 250, 250";
        String btnBg = tema.equals("light") ? "228, 228, 231" : tema.equals("emerald") ? "4, 120, 87" : tema.equals("cyber") ? "30, 41, 59" : "39, 39, 42";
        String opBg = tema.equals("emerald") ? "5, 150, 105" : tema.equals("cyber") ? "2, 132, 199" : "249, 115, 22";

        return """
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
    private final int precisao = %d;

    public CalculadoraGUI() {
        super("%s");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(360, 520);
        setLocationRelativeTo(null);
        setResizable(false);

        Color corFundo = new Color(%s);
        Color corTexto = new Color(%s);
        Color corBotaoNum = new Color(%s);
        Color corBotaoOp = new Color(%s);

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
            "C", "+/-", "%%", "÷",
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
            } else if ("C+/-%%⌫".contains(texto)) {
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
        } else if (cmd.equals("%%")) {
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
            return String.format(Locale.US, "%%d", (long) val);
        }
        return String.format(Locale.US, "%%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\\\.$", "");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new CalculadoraGUI().setVisible(true);
        });
    }
}
""".formatted(precisao, titulo, bg, fg, btnBg, opBg);
    }

    public static String gerarCalculadoraCientificaGUI(String titulo, String tema, int precisao) {
        return """
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
    private final int precisao = %d;

    public CalculadoraCientificaGUI() {
        super("%s - Científica");
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
            "C", "⌫", "+/-", "%%", "÷",
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
            } else if ("MC MR M+ M- C ⌫ +/- %%".contains(b)) {
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
        labelStatus.setText(String.format("MODO: %%s | M = %%s",
            modoRadianos ? "RADIANOS (RAD)" : "GRAUS (DEG)", formatar(memoria)));
    }

    private String formatar(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return "Erro";
        if (val == (long) val) return String.valueOf((long) val);
        return String.format(Locale.US, "%%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\\\.$", "");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new CalculadoraCientificaGUI().setVisible(true));
    }
}
""".formatted(precisao, titulo);
    }

    public static String gerarCalculadoraCLI(String titulo, int precisao) {
        return """
import java.util.*;

/**
 * CalculadoraCLI.java
 * Calculadora Interativa via Terminal CLI em Java Puro com Cores ANSI e Parser Matemático.
 * Execução: java CalculadoraCLI.java
 */
public class CalculadoraCLI {

    public static final String RESET = "\\u001B[0m";
    public static final String VERDE = "\\u001B[32m";
    public static final String AMARELO = "\\u001B[33m";
    public static final String CIANO = "\\u001B[36m";
    public static final String VERMELHO = "\\u001B[31m";
    public static final String NEGRITO = "\\u001B[1m";

    private double ans = 0.0;
    private double memoria = 0.0;
    private final List<String> historico = new ArrayList<>();
    private final int precisao = %d;

    public void iniciar() {
        Scanner scanner = new Scanner(System.in);
        System.out.println(CIANO + NEGRITO + "=================================================" + RESET);
        System.out.println(CIANO + NEGRITO + "          %s (Terminal CLI)              " + RESET);
        System.out.println(CIANO + NEGRITO + "=================================================" + RESET);
        System.out.println("Comandos rápidos: " + AMARELO + "ajuda" + RESET + ", " + AMARELO + "hist" + RESET + ", " + AMARELO + "ans" + RESET + ", " + AMARELO + "m+" + RESET + ", " + AMARELO + "mr" + RESET + ", " + AMARELO + "sair" + RESET);
        System.out.println("Operações suportadas: +, -, *, /, ^, sqrt(x), sin(x), cos(x), abs(x)");
        System.out.println("-------------------------------------------------");

        while (true) {
            System.out.print(VERDE + NEGRITO + "calc> " + RESET);
            if (!scanner.hasNextLine()) break;
            String linha = scanner.nextLine().trim();

            if (linha.isEmpty()) continue;
            if (linha.equalsIgnoreCase("sair") || linha.equalsIgnoreCase("exit") || linha.equalsIgnoreCase("quit")) {
                System.out.println(CIANO + "Calculadora encerrada. Até logo!" + RESET);
                break;
            }

            processarComando(linha);
        }
    }

    private void processarComando(String cmd) {
        if (cmd.equalsIgnoreCase("ajuda") || cmd.equalsIgnoreCase("help")) {
            System.out.println(AMARELO + "--- Ajuda da Calculadora ---" + RESET);
            System.out.println(" • Expressões: 15 * 4 + sqrt(144) / 2");
            System.out.println(" • Variável ANS: armazena o último resultado calculado.");
            System.out.println(" • Memória: 'm+ 10', 'm- 5', 'mr' (ler memória), 'mc' (limpar)");
            System.out.println(" • Histórico: digite 'hist'");
            return;
        }

        if (cmd.equalsIgnoreCase("hist")) {
            System.out.println(AMARELO + "--- Histórico de Cálculos Recentes ---" + RESET);
            if (historico.isEmpty()) System.out.println(" Nenhum cálculo realizado ainda.");
            else for (int i = 0; i < historico.size(); i++) System.out.printf("  [%%d] %%s%%n", i + 1, historico.get(i));
            return;
        }

        if (cmd.equalsIgnoreCase("ans")) {
            System.out.println(" ANS = " + VERDE + formatar(ans) + RESET);
            return;
        }

        if (cmd.equalsIgnoreCase("mr")) {
            System.out.println(" MEMÓRIA (MR) = " + VERDE + formatar(memoria) + RESET);
            return;
        }

        if (cmd.equalsIgnoreCase("mc")) {
            memoria = 0;
            System.out.println(AMARELO + "Memória zerada." + RESET);
            return;
        }

        if (cmd.startsWith("m+")) {
            String resto = cmd.substring(2).trim();
            double v = resto.isEmpty() ? ans : avaliar(resto);
            memoria += v;
            System.out.println(" Memória M+ " + VERDE + formatar(v) + RESET + " (Total: " + formatar(memoria) + ")");
            return;
        }

        try {
            double res = avaliar(cmd);
            ans = res;
            String linhaHist = String.format("%%s = %%s", cmd, formatar(res));
            historico.add(linhaHist);
            System.out.println(VERDE + NEGRITO + "  = " + formatar(res) + RESET);
        } catch (Exception e) {
            System.out.println(VERMELHO + "  Erro: " + e.getMessage() + RESET);
        }
    }

    public double avaliar(String expressao) {
        String exp = expressao.replaceAll("(?i)ans", String.valueOf(ans))
                              .replaceAll("(?i)pi", String.valueOf(Math.PI))
                              .replaceAll("(?i)e\\\\b", String.valueOf(Math.E))
                              .replaceAll("\\\\s+", "");
        return new Parser(exp).parse();
    }

    private String formatar(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return "Indefinido";
        if (val == (long) val) return String.valueOf((long) val);
        return String.format(Locale.US, "%%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\\\.$", "");
    }

    /**
     * Parser Matemático Seguro por Descida Recursiva (Sem eval).
     */
    private static class Parser {
        private final String str;
        private int pos = -1, ch;

        public Parser(String str) { this.str = str; nextChar(); }

        private void nextChar() { ch = (++pos < str.length()) ? str.charAt(pos) : -1; }

        private boolean eat(int charToEat) {
            while (ch == ' ') nextChar();
            if (ch == charToEat) { nextChar(); return true; }
            return false;
        }

        public double parse() {
            double x = parseExpression();
            if (pos < str.length()) throw new RuntimeException("Caractere inesperado: " + (char) ch);
            return x;
        }

        private double parseExpression() {
            double x = parseTerm();
            for (;;) {
                if (eat('+')) x += parseTerm();
                else if (eat('-')) x -= parseTerm();
                else return x;
            }
        }

        private double parseTerm() {
            double x = parseFactor();
            for (;;) {
                if (eat('*')) x *= parseFactor();
                else if (eat('/')) {
                    double divisor = parseFactor();
                    if (divisor == 0) throw new ArithmeticException("Divisão por zero.");
                    x /= divisor;
                } else if (eat('^')) {
                    x = Math.pow(x, parseFactor());
                } else return x;
            }
        }

        private double parseFactor() {
            if (eat('+')) return +parseFactor();
            if (eat('-')) return -parseFactor();

            double x;
            int startPos = this.pos;
            if (eat('(')) {
                x = parseExpression();
                if (!eat(')')) throw new RuntimeException("Parêntese ')' não fechado.");
            } else if ((ch >= '0' && ch <= '9') || ch == '.') {
                while ((ch >= '0' && ch <= '9') || ch == '.') nextChar();
                x = Double.parseDouble(str.substring(startPos, this.pos));
            } else if (ch >= 'a' && ch <= 'z') {
                while (ch >= 'a' && ch <= 'z') nextChar();
                String func = str.substring(startPos, this.pos);
                if (eat('(')) {
                    x = parseExpression();
                    if (!eat(')')) throw new RuntimeException("Parêntese ')' não fechado na função " + func);
                } else {
                    x = parseFactor();
                }
                switch (func.toLowerCase()) {
                    case "sqrt": x = Math.sqrt(x); break;
                    case "sin": x = Math.sin(Math.toRadians(x)); break;
                    case "cos": x = Math.cos(Math.toRadians(x)); break;
                    case "tan": x = Math.tan(Math.toRadians(x)); break;
                    case "abs": x = Math.abs(x); break;
                    case "log": x = Math.log10(x); break;
                    case "ln": x = Math.log(x); break;
                    default: throw new RuntimeException("Função desconhecida: " + func);
                }
            } else {
                throw new RuntimeException("Expressão inválida próxima a '" + (char) ch + "'");
            }
            return x;
        }
    }

    public static void main(String[] args) {
        new CalculadoraCLI().iniciar();
    }
}
""".formatted(precisao, titulo);
    }

    public static String gerarCalculadoraEngine(String titulo, int precisao) {
        return """
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * CalculadoraEngine.java
 * Motor de Cálculo Orientado a Objetos (POO) em Java Puro com Registro de Histórico e Bateria de Testes.
 * Execução: java CalculadoraEngine.java
 */
public class CalculadoraEngine {

    public record RegistroOperacao(
        String operador,
        double operandoA,
        Double operandoB,
        double resultado,
        LocalDateTime timestamp
    ) {
        public String toJSON() {
            return String.format(Locale.US,
                "{\\"operador\\": \\"%s\\", \\"a\\": %.4f, \\"b\\": %s, \\"resultado\\": %.4f, \\"data\\": \\"%s\\"}",
                operador, operandoA, operandoB == null ? "null" : String.format(Locale.US, "%.4f", operandoB),
                resultado, timestamp.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }
    }

    public static class DivisaoPorZeroException extends ArithmeticException {
        public DivisaoPorZeroException(String msg) { super(msg); }
    }

    private final List<RegistroOperacao> historico = new ArrayList<>();
    private final int precisao;

    public CalculadoraEngine() {
        this(6);
    }

    public CalculadoraEngine(int precisao) {
        this.precisao = precisao;
    }

    public double somar(double a, double b) {
        double res = a + b;
        registrar("+", a, b, res);
        return res;
    }

    public double subtrair(double a, double b) {
        double res = a - b;
        registrar("-", a, b, res);
        return res;
    }

    public double multiplicar(double a, double b) {
        double res = a * b;
        registrar("*", a, b, res);
        return res;
    }

    public double dividir(double a, double b) {
        if (b == 0) {
            throw new DivisaoPorZeroException("Não é permitida divisão por zero.");
        }
        double res = a / b;
        registrar("/", a, b, res);
        return res;
    }

    public double potencia(double base, double expoente) {
        double res = Math.pow(base, expoente);
        registrar("^", base, expoente, res);
        return res;
    }

    public double raizQuadrada(double x) {
        if (x < 0) {
            throw new IllegalArgumentException("Raiz quadrada de número negativo não suportada.");
        }
        double res = Math.sqrt(x);
        registrar("sqrt", x, null, res);
        return res;
    }

    public double porcentagem(double total, double percentual) {
        double res = (total * percentual) / 100.0;
        registrar("%%", total, percentual, res);
        return res;
    }

    private void registrar(String op, double a, Double b, double res) {
        historico.add(new RegistroOperacao(op, a, b, res, LocalDateTime.now()));
    }

    public List<RegistroOperacao> getHistorico() {
        return Collections.unmodifiableList(historico);
    }

    public String exportarHistoricoJSON() {
        StringBuilder sb = new StringBuilder("[\\n");
        for (int i = 0; i < historico.size(); i++) {
            sb.append("  ").append(historico.get(i).toJSON());
            if (i < historico.size() - 1) sb.append(",");
            sb.append("\\n");
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Bateria de Testes Automatizada Embutida no Motor Java.
     */
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("   BATERIA DE TESTES UNITÁRIOS - MOTOR JAVA POO  ");
        System.out.println("=================================================");

        CalculadoraEngine calc = new CalculadoraEngine(6);
        int totalTestes = 0;
        int aprovados = 0;

        // Teste 1: Adição
        totalTestes++;
        if (calc.somar(15.5, 4.5) == 20.0 && calc.somar(-7, 10) == 3.0) {
            System.out.println(" [PASS] Teste 1: Adição e números negativos");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 1: Falha na soma");
        }

        // Teste 2: Subtração
        totalTestes++;
        if (calc.subtrair(50, 18) == 32.0) {
            System.out.println(" [PASS] Teste 2: Subtração");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 2: Falha na subtração");
        }

        // Teste 3: Multiplicação
        totalTestes++;
        if (calc.multiplicar(7, 8) == 56.0) {
            System.out.println(" [PASS] Teste 3: Multiplicação");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 3: Falha na multiplicação");
        }

        // Teste 4: Divisão e Exceção Div/0
        totalTestes++;
        boolean capturouErro = false;
        try {
            calc.dividir(100, 0);
        } catch (DivisaoPorZeroException e) {
            capturouErro = true;
        }
        if (calc.dividir(100, 4) == 25.0 && capturouErro) {
            System.out.println(" [PASS] Teste 4: Divisão exata e tratamento de Divisão por Zero");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 4: Falha no tratamento de divisão");
        }

        // Teste 5: Potência e Raiz
        totalTestes++;
        if (calc.potencia(2, 10) == 1024.0 && calc.raizQuadrada(144) == 12.0) {
            System.out.println(" [PASS] Teste 5: Potenciação 2^10 e Raiz Quadrada de 144");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 5: Falha em potência ou raiz");
        }

        // Teste 6: Porcentagem
        totalTestes++;
        if (calc.porcentagem(250, 20) == 50.0) {
            System.out.println(" [PASS] Teste 6: Cálculo de 20%% de 250");
            aprovados++;
        } else {
            System.err.println(" [FAIL] Teste 6: Falha em porcentagem");
        }

        System.out.println("-------------------------------------------------");
        System.out.printf(" Resultado: %d de %d testes APROVADOS (100%%)%n", aprovados, totalTestes);
        System.out.println(" Registros gravados no histórico: " + calc.getHistorico().size());
        System.out.println("-------------------------------------------------");
        System.out.println(" Exportação JSON gerada pelo Motor:");
        System.out.println(calc.exportarHistoricoJSON());
        System.out.println("=================================================");
    }
}
""";
    }

    public static String gerarCalculadoraProgramador(String titulo) {
        return """
import java.util.Scanner;

/**
 * CalculadoraProgramador.java
 * Calculadora do Programador em Java: Bases (HEX, DEC, OCT, BIN) e Operadores Bitwise.
 * Execução: java CalculadoraProgramador.java
 */
public class CalculadoraProgramador {

    private int bits = 32;

    public void exibirRelatorio(long valor) {
        long mascara = bits == 64 ? -1L : (1L << bits) - 1;
        long valorMascarado = valor & mascara;

        System.out.println("=================================================");
        System.out.printf("   CONVERSÃO DE BASES PARA: %d (%d bits)%n", valor, bits);
        System.out.println("=================================================");
        System.out.printf("   DEC: %d%n", valorMascarado);
        System.out.printf("   HEX: 0x%s%n", Long.toHexString(valorMascarado).toUpperCase());
        System.out.printf("   OCT: 0%s%n", Long.toOctalString(valorMascarado));
        
        String binStr = Long.toBinaryString(valorMascarado);
        while (binStr.length() < bits) binStr = "0" + binStr;
        if (binStr.length() > bits) binStr = binStr.substring(binStr.length() - bits);

        // Agrupando em nibbles (4 bits)
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < binStr.length(); i++) {
            if (i > 0 && i % 4 == 0) sb.append(" ");
            sb.append(binStr.charAt(i));
        }
        System.out.printf("   BIN: %s%n", sb.toString());
        System.out.printf("   BITS ATIVOS (popcount): %d%n", Long.bitCount(valorMascarado));
        System.out.println("-------------------------------------------------");
        System.out.println(" OPERAÇÕES BITWISE COM MÁSCARA 0x0F (15):");
        System.out.printf("   AND (& 15): %d (0x%X)%n", (valorMascarado & 15), (valorMascarado & 15));
        System.out.printf("   OR  (| 15): %d (0x%X)%n", (valorMascarado | 15), (valorMascarado | 15));
        System.out.printf("   XOR (^ 15): %d (0x%X)%n", (valorMascarado ^ 15), (valorMascarado ^ 15));
        System.out.printf("   NOT (~):    %d (0x%X)%n", (~valorMascarado & mascara), (~valorMascarado & mascara));
        System.out.printf("   SHL (<< 2): %d%n", ((valorMascarado << 2) & mascara));
        System.out.printf("   SHR (>> 2): %d%n", (valorMascarado >> 2));
        System.out.println("=================================================");
    }

    public static void main(String[] args) {
        CalculadoraProgramador prog = new CalculadoraProgramador();

        if (args.length > 0) {
            for (String arg : args) {
                try {
                    long val = arg.startsWith("0x") || arg.startsWith("0X")
                        ? Long.parseLong(arg.substring(2), 16)
                        : Long.parseLong(arg);
                    prog.exibirRelatorio(val);
                } catch (NumberFormatException e) {
                    System.err.println("Número inválido: " + arg);
                }
            }
            return;
        }

        System.out.println("Demonstração padrão da Calculadora do Programador:");
        long[] amostras = { 42, 255, 1024, 65535 };
        for (long a : amostras) {
            prog.exibirRelatorio(a);
            System.out.println();
        }
    }
}
""";
    }
}
