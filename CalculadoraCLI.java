import java.util.*;

/**
 * CalculadoraCLI.java
 * Calculadora Interativa via Terminal CLI em Java Puro com Cores ANSI e Parser Matemático.
 * Execução: java CalculadoraCLI.java
 */
public class CalculadoraCLI {

    public static final String RESET = "\u001B[0m";
    public static final String VERDE = "\u001B[32m";
    public static final String AMARELO = "\u001B[33m";
    public static final String CIANO = "\u001B[36m";
    public static final String VERMELHO = "\u001B[31m";
    public static final String NEGRITO = "\u001B[1m";

    private double ans = 0.0;
    private double memoria = 0.0;
    private final List<String> historico = new ArrayList<>();
    private final int precisao = 6;

    public void iniciar() {
        Scanner scanner = new Scanner(System.in);
        System.out.println(CIANO + NEGRITO + "=================================================" + RESET);
        System.out.println(CIANO + NEGRITO + "          Calculadora Java (Terminal CLI)              " + RESET);
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
            else for (int i = 0; i < historico.size(); i++) System.out.printf("  [%d] %s%n", i + 1, historico.get(i));
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
            String linhaHist = String.format("%s = %s", cmd, formatar(res));
            historico.add(linhaHist);
            System.out.println(VERDE + NEGRITO + "  = " + formatar(res) + RESET);
        } catch (Exception e) {
            System.out.println(VERMELHO + "  Erro: " + e.getMessage() + RESET);
        }
    }

    public double avaliar(String expressao) {
        String exp = expressao.replaceAll("(?i)ans", String.valueOf(ans))
                              .replaceAll("(?i)pi", String.valueOf(Math.PI))
                              .replaceAll("(?i)e\\b", String.valueOf(Math.E))
                              .replaceAll("\\s+", "");
        return new Parser(exp).parse();
    }

    private String formatar(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return "Indefinido";
        if (val == (long) val) return String.valueOf((long) val);
        return String.format(Locale.US, "%." + precisao + "f", val).replaceAll("0+$", "").replaceAll("\\.$", "");
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
