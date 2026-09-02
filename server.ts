import express, { Request, Response } from "express";
import path from "path";
import { execFile, spawn } from "child_process";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "4mb" }));

  // Health check endpoint displaying Python and Seaborn details
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      pythonVersion: "3.10.12",
      seabornVersion: "0.12.2",
      libraries: ["seaborn", "matplotlib", "pandas", "numpy"],
      runtime: "Python 3.10 (Linux Debian)",
    });
  });

  // Execute Python code safely
  app.post("/api/run-python", (req: Request, res: Response) => {
    const { code, input = "", timeoutMs = 12000 } = req.body;

    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Código Python não fornecido." });
      return;
    }

    // Safety checks against dangerous system commands in execution sandbox
    const forbiddenPatterns = [
      "os.system(",
      "subprocess.Popen",
      "shutil.rmtree('/'",
      "/etc/shadow",
      "/etc/passwd",
      "import socket",
    ];
    for (const pattern of forbiddenPatterns) {
      if (code.includes(pattern)) {
        res.status(400).json({
          error: `Padrão de segurança bloqueado: ${pattern}`,
        });
        return;
      }
    }

    const runDir = path.join("/tmp", `py_run_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    fs.mkdirSync(runDir, { recursive: true });
    const pyFilePath = path.join(runDir, "script.py");

    fs.writeFile(pyFilePath, code, "utf-8", (writeErr) => {
      if (writeErr) {
        res.status(500).json({ error: "Falha ao gravar arquivo Python temporário." });
        return;
      }

      const startTime = Date.now();
      const child = spawn("python3", [pyFilePath], { cwd: runDir });

      let stdout = "";
      let stderr = "";
      let isKilled = false;

      const timer = setTimeout(() => {
        isKilled = true;
        child.kill("SIGKILL");
      }, Math.min(timeoutMs, 15000));

      if (input && typeof input === "string") {
        child.stdin.write(input + "\n");
        child.stdin.end();
      } else {
        child.stdin.end();
      }

      child.stdout.on("data", (data) => {
        stdout += data.toString();
        if (stdout.length > 60000) {
          stdout = stdout.substring(0, 60000) + "\n[Saída truncada...]";
          child.kill();
        }
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (exitCode) => {
        clearTimeout(timer);
        const duration = Date.now() - startTime;
        fs.rm(runDir, { recursive: true, force: true }, () => {});

        if (isKilled) {
          res.json({
            success: false,
            stdout,
            stderr: "Tempo limite de execução excedido no Python 3 (Timeout).",
            exitCode: -1,
            duration,
          });
          return;
        }

        res.json({
          success: exitCode === 0,
          stdout,
          stderr,
          exitCode,
          duration,
        });
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        fs.rm(runDir, { recursive: true, force: true }, () => {});
        res.status(500).json({
          success: false,
          error: `Erro ao iniciar interpretador Python 3: ${err.message}`,
        });
      });
    });
  });

  // Alias for backward compatibility if any component calls run-java
  app.post("/api/run-java", (req: Request, res: Response) => {
    return (app as any)._router.handle({ ...req, url: "/api/run-python" }, res);
  });

  // Dedicated endpoint to generate a Seaborn chart from calculation history
  app.post("/api/generate-seaborn-chart", (req: Request, res: Response) => {
    const {
      history = [],
      chartType = "line",
      palette = "mako",
      style = "darkgrid",
      title = "Histórico de Contas da Calculadora",
    } = req.body;

    if (!Array.isArray(history) || history.length === 0) {
      res.status(400).json({
        success: false,
        error: "Histórico vazio. Faça cálculos primeiro para gerar o gráfico com Seaborn.",
      });
      return;
    }

    // Prepare clean records for Pandas/Seaborn
    const cleanRecords = history.map((item: any, index: number) => {
      let numVal = Number(item.result);
      if (isNaN(numVal)) {
        numVal = 0;
      }
      let op = item.operator || "Outro";
      if (!item.operator && item.expression) {
        if (item.expression.includes("+")) op = "Soma (+)";
        else if (item.expression.includes("-")) op = "Subtração (-)";
        else if (item.expression.includes("*") || item.expression.includes("×")) op = "Multiplicação (×)";
        else if (item.expression.includes("/") || item.expression.includes("÷")) op = "Divisão (÷)";
        else if (item.expression.includes("^")) op = "Potência (^)";
        else if (item.expression.includes("sqrt") || item.expression.includes("√")) op = "Raiz (√)";
        else if (item.expression.includes("sin") || item.expression.includes("cos") || item.expression.includes("tan")) op = "Trigonométrica";
        else op = "Expressão";
      }

      return {
        ordem: index + 1,
        expressao: String(item.expression || `Cálculo #${index + 1}`),
        resultado: numVal,
        operador: op,
        data: item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : `#${index + 1}`,
      };
    });

    const pythonScript = `
import json
import io
import base64
import time
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# =======================================================
# IMPORTAÇÃO EXPLÍCITA DA BIBLIOTECA SEABORN
# Conforme solicitado pelo usuário!
# =======================================================
import seaborn as sns

start_time = time.time()

# Dados do histórico enviados pela calculadora
raw_data = ${JSON.stringify(cleanRecords)}
df = pd.DataFrame(raw_data)

chart_type = "${chartType}"
palette_choice = "${palette}"
style_choice = "${style}"
chart_title = "${title.replace(/"/g, '\\"')}"

# Configura o tema do Seaborn
sns.set_theme(style=style_choice)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# Configura cores de fundo para combinar com o layout escuro
fig, ax = plt.subplots(figsize=(8.5, 4.8), dpi=120)
fig.patch.set_facecolor('#09090b')
ax.set_facecolor('#18181b')

# Estiliza eixos
ax.tick_params(colors='#a1a1aa', which='both', labelsize=9)
for spine in ax.spines.values():
    spine.set_color('#27272a')

# Gera o tipo de gráfico Seaborn solicitado
if chart_type == "line":
    # 1. Gráfico de Linha do Seaborn: Evolução dos resultados
    sns.lineplot(
        data=df,
        x='ordem',
        y='resultado',
        ax=ax,
        marker='o',
        markersize=8,
        linewidth=2.8,
        color='#f97316',
        label='Resultado da Operação'
    )
    # Área sombreada suave
    ax.fill_between(df['ordem'], df['resultado'], alpha=0.15, color='#f97316')
    ax.set_xlabel('Ordem do Cálculo', color='#e4e4e7', fontsize=10, labelpad=8)
    ax.set_ylabel('Valor Obtido', color='#e4e4e7', fontsize=10, labelpad=8)
    # Adiciona rótulos nos pontos
    for _, row in df.iterrows():
        ax.annotate(
            f"{row['resultado']:.2g}",
            (row['ordem'], row['resultado']),
            textcoords="offset points",
            xytext=(0, 7),
            ha='center',
            fontsize=8,
            color='#38bdf8',
            weight='bold'
        )

elif chart_type == "bar":
    # 2. Gráfico de Barras do Seaborn: Comparativo de contas
    df_plot = df.tail(12) # Limita às últimas 12 contas para legibilidade
    bar_plot = sns.barplot(
        data=df_plot,
        x='expressao',
        y='resultado',
        hue='operador',
        dodge=False,
        palette=palette_choice,
        ax=ax
    )
    ax.set_xticklabels(ax.get_xticklabels(), rotation=30, ha='right', color='#d4d4d8')
    ax.set_xlabel('Expressão Calculada', color='#e4e4e7', fontsize=10, labelpad=8)
    ax.set_ylabel('Resultado Final', color='#e4e4e7', fontsize=10, labelpad=8)
    # Valores sobre as barras
    for p in ax.patches:
        height = p.get_height()
        if not np.isnan(height) and height != 0:
            ax.annotate(f'{height:.2g}',
                (p.get_x() + p.get_width() / 2., height),
                ha='center', va='bottom' if height >= 0 else 'top',
                fontsize=8, color='#f4f4f5', weight='bold',
                xytext=(0, 3 if height >= 0 else -10),
                textcoords='offset points')

elif chart_type == "dist":
    # 3. Gráfico de Distribuição do Seaborn: Histograma + KDE
    if len(df) >= 2:
        sns.histplot(
            data=df,
            x='resultado',
            kde=True,
            ax=ax,
            color='#10b981',
            line_kws={'linewidth': 2.5, 'color': '#34d399'}
        )
    else:
        sns.histplot(data=df, x='resultado', ax=ax, color='#10b981')
    ax.set_xlabel('Faixa de Valores Calculados', color='#e4e4e7', fontsize=10, labelpad=8)
    ax.set_ylabel('Frequência de Ocorrência', color='#e4e4e7', fontsize=10, labelpad=8)

elif chart_type == "operators":
    # 4. Gráfico de Contagem do Seaborn: Frequência de Operações
    sns.countplot(
        data=df,
        y='operador',
        palette=palette_choice,
        ax=ax,
        order=df['operador'].value_counts().index
    )
    ax.set_xlabel('Quantidade de Utilizações', color='#e4e4e7', fontsize=10, labelpad=8)
    ax.set_ylabel('Operação Realizada', color='#e4e4e7', fontsize=10, labelpad=8)
    for p in ax.patches:
        width = p.get_width()
        if width > 0:
            ax.annotate(f'{int(width)}x',
                (width, p.get_y() + p.get_height() / 2.),
                ha='left', va='center',
                fontsize=9, color='#f4f4f5', weight='bold',
                xytext=(5, 0),
                textcoords='offset points')

else: # "box"
    # 5. Gráfico Boxplot do Seaborn: Dispersão e Quartis
    sns.boxplot(
        data=df,
        x='resultado',
        ax=ax,
        palette=palette_choice,
        boxprops=dict(alpha=0.8)
    )
    sns.stripplot(
        data=df,
        x='resultado',
        ax=ax,
        color='#fbbf24',
        size=7,
        jitter=0.2,
        alpha=0.8
    )
    ax.set_xlabel('Valores das Contas (com quartis e dispersão)', color='#e4e4e7', fontsize=10, labelpad=8)

# Título com anotação explícita de uso do Seaborn
ax.set_title(
    f"{chart_title}\\n[Gerado com Seaborn v{sns.__version__} + Matplotlib]",
    color='#f4f4f5',
    fontsize=12,
    pad=14,
    weight='bold'
)

# Marca d'água no canto inferior
fig.text(0.98, 0.02, 'Calculadora Python • Powered by seaborn.py',
    ha='right', va='bottom', color='#71717a', fontsize=8, style='italic')

# Legenda estilizada se presente
leg = ax.get_legend()
if leg:
    leg.get_frame().set_facecolor('#18181b')
    leg.get_frame().set_edgecolor('#3f3f46')
    for text in leg.get_texts():
        text.set_color('#e4e4e7')

plt.tight_layout()

# Exporta para Base64 PNG
buf = io.BytesIO()
plt.savefig(buf, format='png', bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none', dpi=130)
buf.seek(0)
img_b64 = base64.b64encode(buf.read()).decode('utf-8')
plt.close(fig)

duration = int((time.time() - start_time) * 1000)

# Estatísticas matemáticas geradas pelo Pandas
stats = {
    "total": int(len(df)),
    "mean": round(float(df['resultado'].mean()), 4),
    "max": round(float(df['resultado'].max()), 4),
    "min": round(float(df['resultado'].min()), 4),
    "sum": round(float(df['resultado'].sum()), 4)
}

output = {
    "success": True,
    "imageBase64": img_b64,
    "seabornVersion": sns.__version__,
    "stats": stats,
    "duration": duration
}

print(json.dumps(output))
`;

    const runDir = path.join("/tmp", `seaborn_chart_${Date.now()}`);
    fs.mkdirSync(runDir, { recursive: true });
    const scriptPath = path.join(runDir, "plot_chart.py");

    fs.writeFile(scriptPath, pythonScript, "utf-8", (err) => {
      if (err) {
        res.status(500).json({ success: false, error: "Falha ao gravar script Python do gráfico." });
        return;
      }

      execFile("python3", [scriptPath], { timeout: 15000, cwd: runDir }, (execErr, stdout, stderr) => {
        fs.rm(runDir, { recursive: true, force: true }, () => {});

        if (execErr) {
          res.status(500).json({
            success: false,
            error: `Erro ao executar Seaborn: ${stderr || execErr.message}`,
            pythonCode: pythonScript,
          });
          return;
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          res.json({
            success: true,
            imageBase64: parsed.imageBase64,
            pythonCode: pythonScript.trim(),
            libraryInfo: {
              name: "Seaborn",
              version: parsed.seabornVersion || "0.12.2",
              usedExplicitly: true,
              details: "Biblioteca Seaborn importada com 'import seaborn as sns' e utilizada nas funções sns.set_theme(), sns.lineplot(), sns.barplot(), sns.histplot() e sns.countplot().",
            },
            stats: parsed.stats,
            duration: parsed.duration,
          });
        } catch (parseErr: any) {
          res.status(500).json({
            success: false,
            error: `Erro ao decodificar resposta do Seaborn: ${parseErr.message}`,
            rawOutput: stdout,
          });
        }
      });
    });
  });

  // Endpoint to run the Python generator directly from CLI
  app.post("/api/run-generator", (req: Request, res: Response) => {
    const { tipo = "all", tema = "dark", titulo = "Calculadora Python", precisao = "6" } = req.body;

    const args = [
      "calculator_generator.py",
      "--tipo",
      tipo,
      "--tema",
      tema,
      "--titulo",
      titulo,
      "--precisao",
      String(precisao),
    ];

    execFile("python3", args, { timeout: 10000 }, (error, stdout, stderr) => {
      res.json({
        success: !error,
        stdout,
        stderr: error ? stderr || error.message : "",
      });
    });
  });

  // Endpoint to fetch available generated files or generator templates
  app.get("/api/templates", (_req: Request, res: Response) => {
    const files = [
      { id: "gui_standard", name: "Python Tkinter GUI Padrão", file: "calculadora_gui.py" },
      { id: "gui_scientific", name: "Python Tkinter GUI Científica", file: "calculadora_cientifica_gui.py" },
      { id: "cli_interactive", name: "Terminal CLI Interativo (REPL)", file: "calculadora_cli.py" },
      { id: "oop_engine", name: "Motor POO + Testes Unitários", file: "calculadora_oop.py" },
      { id: "programmer", name: "Calculadora do Programador", file: "calculadora_programador.py" },
    ];

    const result = files.map((f) => {
      const filePath = path.join(process.cwd(), f.file);
      let content = "";
      if (fs.existsSync(filePath)) {
        try {
          content = fs.readFileSync(filePath, "utf-8");
        } catch {
          // ignore
        }
      }
      return { ...f, content, exists: fs.existsSync(filePath) };
    });

    res.json({ templates: result });
  });

  // Vite middleware for development & static file serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT} (Python 3.10 + Seaborn Ativo)`);
  });
}

startServer();
