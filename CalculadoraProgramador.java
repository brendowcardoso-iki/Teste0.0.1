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
