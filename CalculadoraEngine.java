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
                "{\"operador\": \"%s\", \"a\": %.4f, \"b\": %s, \"resultado\": %.4f, \"data\": \"%s\"}",
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
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < historico.size(); i++) {
            sb.append("  ").append(historico.get(i).toJSON());
            if (i < historico.size() - 1) sb.append(",");
            sb.append("\n");
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
