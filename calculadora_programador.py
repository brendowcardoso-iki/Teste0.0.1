#!/usr/bin/env python3
"""
Calculadora do Programador (Bases & Bitwise)
Conversão simultânea entre Decimal, Hexadecimal, Binário e Octal,
mais operações lógicas bit a bit (AND, OR, XOR, NOT, Shift).
Execução: python calculadora_programador.py
"""

import sys


class CalculadoraProgramador:
    def __init__(self, bits: int = 32):
        self.bits = bits
        self.mascara = (1 << bits) - 1

    def converter(self, valor: int) -> dict:
        v_trunc = valor & self.mascara
        return {
            "dec": str(valor),
            "hex": hex(v_trunc).upper().replace("X", "x"),
            "bin": bin(v_trunc)[2:].zfill(self.bits),
            "oct": oct(v_trunc),
        }

    def operacao_bitwise(self, op: str, a: int, b: int = 0) -> int:
        if op == "AND":
            return (a & b) & self.mascara
        elif op == "OR":
            return (a | b) & self.mascara
        elif op == "XOR":
            return (a ^ b) & self.mascara
        elif op == "NOT":
            return (~a) & self.mascara
        elif op == "SHL":
            return (a << b) & self.mascara
        elif op == "SHR":
            return (a >> b) & self.mascara
        else:
            raise ValueError(f"Operador bitwise '{op}' desconhecido")


def main():
    calc = CalculadoraProgramador(bits=32)
    print("=" * 50)
    print("   CALCULADORA DO PROGRAMADOR (BASES & BITS)   ")
    print("=" * 50)
    print("Exemplos de entrada de valor:")
    print("  Decimal: 255  |  Hex: 0xFF  |  Bin: 0b11111111\n")

    while True:
        try:
            entrada = input("Digite um número ou expressão (ou 'sair'): ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if not entrada or entrada.lower() in ["sair", "exit"]:
            break

        try:
            # Reconhece prefixos 0x, 0b, 0o ou int comum
            num = int(entrada, 0)
            res = calc.converter(num)
            print(f"\n--- Representação em Múltiplas Bases ({calc.bits} bits) ---")
            print(f"  DEC: {res['dec']}")
            print(f"  HEX: {res['hex']}")
            print(f"  OCT: {res['oct']}")
            # Agrupa binário em nibbles de 4 bits para legibilidade
            bin_fmt = " ".join(res["bin"][i:i+4] for i in range(0, len(res["bin"]), 4))
            print(f"  BIN: {bin_fmt}\n")
        except Exception as err:
            print(f"Erro: {err}\n")


if __name__ == "__main__":
    main()
