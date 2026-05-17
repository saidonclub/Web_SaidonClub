"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import {
  ArrowLeft,
  Cpu,
  TrendingUp,
  Terminal as TerminalIcon,
  Play,
  StopCircle,
  RefreshCw,
  DollarSign,
  Activity,
  Shield,
  Zap,
  Wallet,
  Coins,
  ChevronRight,
  TrendingDown,
  Info,
  Scale,
  Flame,
  CheckCircle2,
  Users,
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import styles from "./AITrading.module.css";

interface AITradingClientProps {
  initialBalance: number;
  userEmail: string;
  userRole: string;
  userName: string | null;
}

interface LogEntry {
  id: string;
  time: string;
  prefix: "TECH" | "SENT" | "BULL" | "BEAR" | "RISK" | "CONS" | "SYS";
  agentName: string;
  text: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  winRate: string;
  status: "ACTIVE" | "INACTIVE" | "DEBATING" | "ANALYZING";
  stance: "BULLISH" | "BEARISH" | "NEUTRAL" | "MITIGATING";
  influence: number;
  metricLabel: string;
  metricValue: string;
  color: string;
}

export default function AITradingClient({
  initialBalance,
  userEmail,
  userRole,
  userName
}: AITradingClientProps) {
  // Wallet & Profits
  const [balance, setBalance] = useState(initialBalance);
  const [simulatedProfit, setSimulatedProfit] = useState(0);

  // Automation & State controls
  const [isBotRunning, setIsBotRunning] = useState(true);
  const [activeTradesCount, setActiveTradesCount] = useState(4);
  const [consensusScore, setConsensusScore] = useState(74); // 0 to 100 (Bullish leaning)
  
  // Interactive Debate Phase
  // 'IDLE' | 'INGESTION' | 'DEBATE' | 'MITIGATION' | 'CONSENSUS' | 'SUCCESS'
  const [debatePhase, setDebatePhase] = useState<"IDLE" | "INGESTION" | "DEBATE" | "MITIGATION" | "CONSENSUS" | "SUCCESS">("IDLE");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  // Form parameters
  const [tradeAmount, setTradeAmount] = useState("250");
  const [selectedAsset, setSelectedAsset] = useState("SAIDON");
  const [leverage, setLeverage] = useState("5");
  const [riskFactor, setRiskFactor] = useState("MEDIO");
  const [isSimulatingTrade, setIsSimulatingTrade] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Live Chart & Dynamic Support/Resistance Lines
  const [chartData, setChartData] = useState<number[]>([
    124.5, 126.8, 125.2, 129.4, 128.1, 132.5, 134.8, 133.0, 137.4, 140.2, 138.5, 142.0
  ]);
  const [resistancePrice, setResistancePrice] = useState(145.0);
  const [supportPrice, setSupportPrice] = useState(132.5);

  // Agents Definition (TradingAgents Multi-Agent Debate ecosystem)
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "sentinel",
      name: "Sentinel-V3",
      role: "Analista Técnico",
      description: "Escanea indicadores numéricos, patrones de velas y profundidad del Order Book en múltiples AMMs.",
      winRate: "94.2%",
      status: "ACTIVE",
      stance: "BULLISH",
      influence: 85,
      metricLabel: "RSI / MACD",
      metricValue: "RSI 58 (Fuerte)",
      color: "#00e5ff"
    },
    {
      id: "aether",
      name: "Aether-Alpha",
      role: "Analista de Sentimiento",
      description: "Monitorea redes sociales, Discord, foros de ballenas y noticias para rastrear el volumen psicológico.",
      winRate: "89.7%",
      status: "ACTIVE",
      stance: "BULLISH",
      influence: 75,
      metricLabel: "Social Volume",
      metricValue: "Extremo Optimismo",
      color: "#ffeb3b"
    },
    {
      id: "bull_agent",
      name: "Bull-Agent",
      role: "Argumentador Alcista",
      description: "Identifica y defiende los catalizadores de alza, rupturas de resistencia y anomalías de acumulación.",
      winRate: "91.5%",
      status: "ACTIVE",
      stance: "BULLISH",
      influence: 90,
      metricLabel: "Catalizador",
      metricValue: "Volumen +14% (DEX)",
      color: "#00ff66"
    },
    {
      id: "bear_agent",
      name: "Bear-Agent",
      role: "Argumentador Bajista",
      description: "Alerta sobre zonas de sobrecompra, muros de liquidación, resistencia macro y riesgos sistémicos.",
      winRate: "90.8%",
      status: "ACTIVE",
      stance: "BEARISH",
      influence: 80,
      metricLabel: "Resistencia",
      metricValue: "Muro en $145.00",
      color: "#ff3d00"
    },
    {
      id: "vulcan",
      name: "Vulcan-Risk",
      role: "Gestor de Riesgo",
      description: "Define límites estrictos de Drawdown, gestiona coberturas cruzadas y ajusta el apalancamiento.",
      winRate: "98.9%",
      status: "ACTIVE",
      stance: "MITIGATING",
      influence: 95,
      metricLabel: "Colateral Stop",
      metricValue: "Stop-Loss -3.5%",
      color: "#e040fb"
    },
    {
      id: "portfolio_manager",
      name: "Portfolio-Manager",
      role: "Coordinador Dialéctico",
      description: "Dirige el debate multi-agente, evalúa la síntesis y ejecuta las decisiones consensuadas.",
      winRate: "95.6%",
      status: "ACTIVE",
      stance: "NEUTRAL",
      influence: 100,
      metricLabel: "Decisión",
      metricValue: "Consenso Activo",
      color: "#FF6600"
    }
  ]);

  // Simulated Terminal Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      time: "19:40:12",
      prefix: "SYS",
      agentName: "SISTEMA",
      text: "Kernel cuántico Saidon OS v5.0 inicializado con éxito. Ecosistema de debate dialectal activo."
    },
    {
      id: "2",
      time: "19:40:13",
      prefix: "TECH",
      agentName: "Sentinel-V3",
      text: "Cargando indicadores. Soporte localizado en $132.50. Resistencia fuerte detectada en $145.00."
    },
    {
      id: "3",
      time: "19:40:15",
      prefix: "SENT",
      agentName: "Aether-Alpha",
      text: "Métricas sociales optimistas en Twitter y foros on-chain. FGI (Fear & Greed Index) en 78 [Greed]."
    },
    {
      id: "4",
      time: "19:40:17",
      prefix: "BULL",
      agentName: "Bull-Agent",
      text: "Anomalía alcista en volumen de SaidonCoin. Recomiendo iniciar protocolo de acumulación acelerada."
    },
    {
      id: "5",
      time: "19:40:19",
      prefix: "BEAR",
      agentName: "Bear-Agent",
      text: "Fricción detectada en el order book institucional. Alto riesgo de liquidación en cascada bajo los $130.00."
    },
    {
      id: "6",
      time: "19:40:21",
      prefix: "RISK",
      agentName: "Vulcan-Risk",
      text: "Ajustando cobertura dinámica para colaterales. Apalancamiento máximo restringido a 10x."
    },
    {
      id: "7",
      time: "19:40:23",
      prefix: "CONS",
      agentName: "Portfolio-Manager",
      text: "Consenso dialéctico establecido al 74% alcista. Iniciando monitoreo automático."
    }
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  // Real-time Chart Loop (Every 3 seconds)
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setChartData((prev) => {
        const lastVal = prev[prev.length - 1];
        // General upward trend with slight random noise (-2.5 to +4.5)
        const change = (Math.random() * 7.2) - 2.8;
        const newVal = parseFloat((lastVal + change).toFixed(2));
        
        // Dynamically adjust support and resistance based on simulated price
        if (newVal > resistancePrice - 2) {
          setResistancePrice((r) => parseFloat((r + 1.5).toFixed(2)));
        }
        if (newVal < supportPrice + 2) {
          setSupportPrice((s) => parseFloat((s - 1.2).toFixed(2)));
        }

        const updated = [...prev.slice(1), newVal];
        return updated;
      });
    }, 3000);

    return () => clearInterval(chartInterval);
  }, [resistancePrice, supportPrice]);

  // Real-time Multi-Agent Background Debate Loop (Every 8 seconds)
  useEffect(() => {
    if (!isBotRunning || debatePhase !== "IDLE") return;

    // Define multiple rounds of debates to keep logs fresh and realistic
    const debateDialogs = [
      {
        agentId: "sentinel",
        prefix: "TECH" as const,
        agentName: "Sentinel-V3",
        text: "Sentinel-V3: Par cruzado Saidon/USDT muestra fuerte rechazo en la banda inferior de Bollinger. Rebote inminente.",
        scoreChange: 3
      },
      {
        agentId: "bear_agent",
        prefix: "BEAR" as const,
        agentName: "Bear-Agent",
        text: "Bear-Agent: ¡Pausa! El volumen no acompaña el movimiento. Hay indicios de manipulación por ballenas en exchanges coreanos.",
        scoreChange: -5
      },
      {
        agentId: "bull_agent",
        prefix: "BULL" as const,
        agentName: "Bull-Agent",
        text: "Bull-Agent: El volumen spot de SaidonCoin subió 12%. No se trata de manipulación, es acumulación real de retail.",
        scoreChange: 6
      },
      {
        agentId: "vulcan",
        prefix: "RISK" as const,
        agentName: "Vulcan-Risk",
        text: "Vulcan-Risk: Parámetros dentro de rango seguro. Mantener apalancamiento preventivo bajo 5x por si ocurre mechazo bajista.",
        scoreChange: 0
      },
      {
        agentId: "aether",
        prefix: "SENT" as const,
        agentName: "Aether-Alpha",
        text: "Aether-Alpha: Sentimiento institucional alcista. Escaneo de Discord VIP muestra aumento de compra spot.",
        scoreChange: 4
      },
      {
        agentId: "portfolio_manager",
        prefix: "CONS" as const,
        agentName: "Portfolio-Manager",
        text: "Portfolio-Manager: Re-balanceo cuántico de pools exitoso. Ejecutada cobertura automática en Arbitrum (+0.95%).",
        scoreChange: 2,
        isTrade: true
      }
    ];

    const debateInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * debateDialogs.length);
      const step = debateDialogs[randomIdx];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      // Update active agent for glowing visual feedback
      setActiveAgentId(step.agentId);
      setTimeout(() => setActiveAgentId(null), 2500);

      // Append terminal log
      const newEntry: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        prefix: step.prefix,
        agentName: step.agentName,
        text: step.text
      };

      setLogs((prev) => [...prev, newEntry]);

      // Adjust consensus score slightly
      setConsensusScore((prev) => {
        const next = prev + step.scoreChange;
        return Math.max(10, Math.min(95, next));
      });

      // Update agent stances dynamically in the grid
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.id === step.agentId) {
            return {
              ...agent,
              status: "DEBATING",
              stance: step.prefix === "BULL" || step.prefix === "TECH" ? "BULLISH" : step.prefix === "BEAR" ? "BEARISH" : "NEUTRAL"
            };
          }
          return { ...agent, status: "ACTIVE" };
        })
      );

      // Trigger actual profits on coordinator actions
      if (step.isTrade) {
        const profit = parseFloat((Math.random() * 9 + 1.5).toFixed(2));
        setSimulatedProfit((p) => parseFloat((p + profit).toFixed(2)));
        setBalance((b) => parseFloat((b + profit).toFixed(2)));
        triggerToast(`¡Arbitraje Dialéctico Exitoso! Retorno: +$${profit} USD`);
      }
    }, 8000);

    return () => clearInterval(debateInterval);
  }, [isBotRunning, debatePhase]);

  // Interactive Quantum Swap Sequence (Real-time Dialectical Debate Simulation)
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);

    if (isNaN(amount) || amount <= 0) {
      triggerToast("Por favor ingresa un monto válido.");
      return;
    }

    if (amount > balance) {
      triggerToast("Saldo insuficiente en la wallet para esta simulación.");
      return;
    }

    setIsSimulatingTrade(true);
    setDebatePhase("INGESTION");
    setActiveAgentId("sentinel");
    triggerToast("Fase 1: Sentinel-V3 analizando la red...");

    // Stage 1: Data Ingestion (Sentinel-V3 & Aether-Alpha)
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      const logIngestion: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        prefix: "TECH",
        agentName: "Sentinel-V3",
        text: `[FASE 1: INGESTA] Evaluando pools para ${selectedAsset} con apalancamiento ${leverage}x. RSI en 58, soporte sólido en $${supportPrice}.`
      };

      const logSent: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        prefix: "SENT",
        agentName: "Aether-Alpha",
        text: `[FASE 1: INGESTA] Índice Fear & Greed en 76 (Ambición). Sentimiento en Telegram/Twitter es altamente constructivo.`
      };

      setLogs((prev) => [...prev, logIngestion, logSent]);
      setDebatePhase("DEBATE");
      setActiveAgentId("bull_agent");
      triggerToast("Fase 2: Debate dialéctico alcista vs bajista...");

      // Stage 2: The Core Dialectical Debate (Bull vs Bear Agent)
      setTimeout(() => {
        const timeStr2 = new Date().toTimeString().split(" ")[0];

        const logBull: LogEntry = {
          id: Math.random().toString(),
          time: timeStr2,
          prefix: "BULL",
          agentName: "Bull-Agent",
          text: `[FASE 2: DEBATE] ¡COMPRAR! Patrón de acumulación cuántica detectado en Saidon AMM. Volumen subió ${10 + Math.floor(Math.random() * 8)}% en 15m. Objetivo: $${resistancePrice}.`
        };

        setLogs((prev) => [...prev, logBull]);
        setActiveAgentId("bear_agent");

        setTimeout(() => {
          const timeStr3 = new Date().toTimeString().split(" ")[0];

          const logBear: LogEntry = {
            id: Math.random().toString(),
            time: timeStr3,
            prefix: "BEAR",
            agentName: "Bear-Agent",
            text: `[FASE 2: DEBATE] ¡ATENCIÓN! La resistencia en $${resistancePrice} está fuertemente protegida por bots creadores de mercado. Riesgo de retroceso a $${supportPrice}.`
          };

          setLogs((prev) => [...prev, logBear]);
          setDebatePhase("MITIGATION");
          setActiveAgentId("vulcan");
          triggerToast("Fase 3: Vulcan-Risk aplicando blindaje...");

          // Stage 3: Risk Evaluation & Stop-loss setup (Vulcan-Risk)
          setTimeout(() => {
            const timeStr4 = new Date().toTimeString().split(" ")[0];

            const logRisk: LogEntry = {
              id: Math.random().toString(),
              time: timeStr4,
              prefix: "RISK",
              agentName: "Vulcan-Risk",
              text: `[FASE 3: MITIGACIÓN] Ajustando stop-loss preventivo en -3.5%. Colateral ajustado para apalancamiento ${leverage}x. Matriz de riesgo calificada como [${riskFactor}].`
            };

            setLogs((prev) => [...prev, logRisk]);
            setDebatePhase("CONSENSUS");
            setActiveAgentId("portfolio_manager");
            triggerToast("Fase 4: Consenso y ejecución del Quantum Swap...");

            // Stage 4: Synthesis & Consensus Execution (Portfolio Manager)
            setTimeout(() => {
              const timeStr5 = new Date().toTimeString().split(" ")[0];

              const successRate = riskFactor === "BAJO" ? 0.94 : riskFactor === "MEDIO" ? 0.82 : 0.62;
              const isSuccess = Math.random() < successRate;
              const multiplier = isSuccess ? (parseFloat(leverage) * 0.05) : -(parseFloat(leverage) * 0.045);
              const profitLoss = parseFloat((amount * multiplier).toFixed(2));

              const logExecution: LogEntry = {
                id: Math.random().toString(),
                time: timeStr5,
                prefix: "CONS",
                agentName: "Portfolio-Manager",
                text: isSuccess
                  ? `[FASE 4: SÍNTESIS] Consenso aprobado al 84%. Ejecutando Quantum Swap en Blockchain. Retorno positivo: +$${profitLoss} USD. Bloque firmado.`
                  : `[FASE 4: SÍNTESIS] Consenso inestable (48%). Ejecutada mitigación inmediata por Vulcan-Risk. Retorno neto: -$${Math.abs(profitLoss)} USD.`
              };

              setLogs((prev) => [...prev, logExecution]);
              setBalance((b) => parseFloat((b + profitLoss).toFixed(2)));
              setSimulatedProfit((p) => parseFloat((p + profitLoss).toFixed(2)));
              setDebatePhase("IDLE");
              setActiveAgentId(null);
              setIsSimulatingTrade(false);

              if (isSuccess) {
                triggerToast(`¡Swap Exitoso! Retorno positivo de +$${profitLoss} USD.`);
              } else {
                triggerToast(`Swap finalizado con cobertura: Retorno neto -$${Math.abs(profitLoss)} USD.`);
              }
            }, 2500);

          }, 2000);

        }, 1800);

      }, 1800);

    }, 2000);
  };

  const toggleBot = () => {
    setIsBotRunning(!isBotRunning);
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const log: LogEntry = {
      id: Math.random().toString(),
      time: timeStr,
      prefix: "SYS",
      agentName: "SISTEMA",
      text: isBotRunning
        ? "ALERTA: Automatización de Trading Detenida. Agentes en modo pasivo."
        : "SISTEMA: Reiniciando motores cuánticos. Ecosistema de debate multi-agente en línea."
    };
    setLogs((prev) => [...prev, log]);
    setActiveTradesCount(isBotRunning ? 0 : 4);
    triggerToast(isBotRunning ? "Automatización de agentes en pausa" : "Debate dialectal y automatización en línea");
  };

  // SVG Chart Dimensions & Computations
  const width = 600;
  const height = 260;
  const padding = 25;
  const minVal = Math.min(...chartData) - 3;
  const maxVal = Math.max(...chartData) + 3;

  const getX = (index: number) => padding + (index * (width - padding * 2)) / (chartData.length - 1);
  const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);

  // Generate SVG Path
  const points = chartData.map((val, i) => `${getX(i)},${getY(val)}`);
  const pathD = `M ${points.join(" L ")}`;

  // Prefix colors/labels mapping
  const getPrefixComponent = (prefix: string, name: string) => {
    switch (prefix) {
      case "TECH":
        return <span className={styles.logPrefixTech}>[{name.toUpperCase()}]</span>;
      case "SENT":
        return <span className={styles.logPrefixSent}>[{name.toUpperCase()}]</span>;
      case "BULL":
        return <span className={styles.logPrefixBull}>[{name.toUpperCase()}]</span>;
      case "BEAR":
        return <span className={styles.logPrefixBear}>[{name.toUpperCase()}]</span>;
      case "RISK":
        return <span className={styles.logPrefixRisk}>[{name.toUpperCase()}]</span>;
      case "CONS":
        return <span className={styles.logPrefixCons}>[{name.toUpperCase()}]</span>;
      case "SYS":
      default:
        return <span className={styles.logPrefixSys}>[SISTEMA]</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cyberGrid} />

      <div className={styles.inner}>
        {/* Navigation Back */}
        <NextLink href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={14} /> Volver al Panel Principal
        </NextLink>

        {/* Header Section */}
        <div className={styles.header}>
          <div>
            <span className={styles.roleTag}>
              <Cpu size={12} /> ESCRITORIO MULTI-AGENTE: {userRole}
            </span>
            <h1 className={styles.title}>Saidon AI Financial Desk</h1>
            <p className={styles.subtitle}>
              Estación descentralizada de debate dialéctico en tiempo real. Inspirado en el framework TradingAgents.
            </p>
          </div>
          <div className={styles.statusOnline}>
            SYSTEM DEBATE ACTIVE
          </div>
        </div>

        {/* Quick Metrics & Dialectical Consensus Meter */}
        <div className={styles.quickLayout}>
          <div className={styles.quickMetrics}>
            <div className={styles.quickMetricCard}>
              <div className={styles.quickMetricLabel}>Balance en Wallet</div>
              <div className={styles.quickMetricVal} style={{ color: "#FF6600" }}>
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.quickMetricCard}>
              <div className={styles.quickMetricLabel}>Rendimiento Dialéctico</div>
              <div 
                className={styles.quickMetricVal} 
                style={{ color: simulatedProfit >= 0 ? "#00c853" : "#ff3d00" }}
              >
                {simulatedProfit >= 0 ? "+" : ""}${simulatedProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.quickMetricCard}>
              <div className={styles.quickMetricLabel}>Posiciones de IA Activas</div>
              <div className={styles.quickMetricVal} style={{ color: "#ffffff" }}>
                {activeTradesCount}
              </div>
            </div>
          </div>

          {/* Dialectical Consensus Meter */}
          <div className={styles.consensusPanel}>
            <div className={styles.consensusHeader}>
              <Scale size={16} style={{ color: "#FF6600" }} />
              <span className={styles.consensusTitle}>Consenso Dialéctico Actual</span>
              <span className={styles.consensusBadge} style={{
                color: consensusScore > 70 ? "#00ff66" : consensusScore > 50 ? "#ffeb3b" : "#ff3d00"
              }}>
                {consensusScore}% {consensusScore > 60 ? "ALCISTA" : consensusScore >= 45 ? "NEUTRAL" : "BAJISTA"}
              </span>
            </div>
            <div className={styles.meterContainer}>
              <div className={styles.meterTrack}>
                <div 
                  className={styles.meterFill} 
                  style={{ 
                    width: `${consensusScore}%`,
                    background: `linear-gradient(90deg, #ff3d00 0%, #ffeb3b 50%, #00ff66 100%)`
                  }} 
                />
                <div className={styles.meterIndicator} style={{ left: `${consensusScore}%` }} />
              </div>
              <div className={styles.meterLabels}>
                <span>Bajista Extremo</span>
                <span>Equilibrio</span>
                <span>Alcista Extremo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Debate Progress Bar */}
        {debatePhase !== "IDLE" && (
          <div className={styles.debateProgressWrapper}>
            <div className={styles.progressHeader}>
              <span className={styles.progressText}>Fase de Debate: <strong style={{ color: "#FF6600" }}>{debatePhase}</strong></span>
              <span className={styles.progressPercent}>
                {debatePhase === "INGESTION" ? "25%" : debatePhase === "DEBATE" ? "50%" : debatePhase === "MITIGATION" ? "75%" : "95%"}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: debatePhase === "INGESTION" ? "25%" : debatePhase === "DEBATE" ? "50%" : debatePhase === "MITIGATION" ? "75%" : "100%" 
                }} 
              />
            </div>
          </div>
        )}

        {/* AI Agents Grid (6 specialized agents) */}
        <h2 className={styles.panelTitle} style={{ marginBottom: "16px", marginTop: "24px", letterSpacing: "-0.01em" }}>
          Ecosistema de Agentes de Debate (TradingAgents)
        </h2>
        <div className={styles.agentGrid}>
          {agents.map((agent) => {
            const isActive = activeAgentId === agent.id;
            return (
              <div 
                key={agent.id} 
                className={`${styles.agentCard} ${isActive ? styles.agentCardHighlight : ""}`}
                style={{ borderTop: `3px solid ${agent.color}` }}
              >
                <div className={styles.agentHeader}>
                  <div className={styles.agentIconContainer} style={{ borderColor: agent.color, color: agent.color }}>
                    <Cpu size={22} />
                  </div>
                  <div className={styles.agentMeta}>
                    <div className={styles.agentName}>{agent.name}</div>
                    <div className={styles.agentRole} style={{ color: agent.color }}>{agent.role}</div>
                  </div>
                  <span className={`${styles.agentState} ${isBotRunning ? styles.stateActive : ""}`}>
                    {agent.status}
                  </span>
                </div>
                <p className={styles.agentStatusText}>
                  {agent.description}
                </p>
                <div className={styles.agentMetricGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Precisión (Win)</span>
                    <span className={styles.metricValue} style={{ color: agent.color }}>{agent.winRate}</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>{agent.metricLabel}</span>
                    <span className={styles.metricValue} style={{
                      color: agent.stance === "BULLISH" ? "#00ff66" : agent.stance === "BEARISH" ? "#ff3d00" : "#ffffff"
                    }}>
                      {agent.metricValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desk Split Layout */}
        <div className={styles.deskLayout}>
          {/* Left Column: Chart with support/resistance and logs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Live Chart Panel */}
            <div className={styles.panelBox}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleContainer}>
                  <TrendingUp size={20} className={styles.panelIcon} />
                  <h3 className={styles.panelTitle}>Gráfico Cuántico con Canales de Debate</h3>
                </div>
                <span className={styles.statusOnline} style={{ fontSize: "10px", padding: "4px 8px" }}>
                  Frecuencia: 3s | Saidon Index (USD)
                </span>
              </div>

              {/* Glowing Interactive SVG Line Chart */}
              <div className={styles.chartWrapper}>
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                  <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6600" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#FF6600" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Cyber Grid Lines inside Chart */}
                  <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* Support & Resistance floating horizontal indicator lines mapped by Sentinel-V3 */}
                  {/* Resistance Line (Light Red) */}
                  <line 
                    x1={padding} 
                    y1={getY(resistancePrice)} 
                    x2={width - padding} 
                    y2={getY(resistancePrice)} 
                    stroke="rgba(255, 61, 0, 0.4)" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                  />
                  {/* Support Line (Green) */}
                  <line 
                    x1={padding} 
                    y1={getY(supportPrice)} 
                    x2={width - padding} 
                    y2={getY(supportPrice)} 
                    stroke="rgba(0, 255, 102, 0.4)" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                  />

                  {/* Gradient Fill under Path */}
                  <path
                    d={`${pathD} L ${getX(chartData.length - 1)},${height - padding} L ${getX(0)},${height - padding} Z`}
                    fill="url(#chartGradient)"
                  />

                  {/* Glowing Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#FF6600"
                    strokeWidth="3.5"
                    filter="url(#neonGlow)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pulse Dot at Latest Price Point */}
                  <circle
                    cx={getX(chartData.length - 1)}
                    cy={getY(chartData[chartData.length - 1])}
                    r="6"
                    fill="#ffffff"
                    stroke="#FF6600"
                    strokeWidth="3"
                  />
                </svg>

                {/* Floating Support/Resistance Label Tags */}
                <div style={{
                  position: "absolute",
                  left: "15px",
                  top: "45px",
                  background: "rgba(255, 61, 0, 0.15)",
                  border: "1px solid #ff3d00",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#ff3d00",
                  fontWeight: "bold"
                }}>
                  Resistencia: ${resistancePrice.toFixed(2)}
                </div>

                <div style={{
                  position: "absolute",
                  left: "15px",
                  bottom: "45px",
                  background: "rgba(0, 255, 102, 0.15)",
                  border: "1px solid #00ff66",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#00ff66",
                  fontWeight: "bold"
                }}>
                  Soporte: ${supportPrice.toFixed(2)}
                </div>

                {/* Live Floating Price tag */}
                <div style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "rgba(0,0,0,0.85)",
                  border: "1px solid #FF6600",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#FF6600",
                  fontWeight: "bold",
                  boxShadow: "0 0 15px rgba(255,102,0,0.25)"
                }}>
                  Index Activo: ${chartData[chartData.length - 1]?.toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* Neural Terminal Logs Panel */}
            <div className={styles.terminalContainer}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <div className={`${styles.terminalDot} ${styles.dotRed}`} />
                  <div className={`${styles.terminalDot} ${styles.dotYellow}`} />
                  <div className={`${styles.terminalDot} ${styles.dotGreen}`} />
                </div>
                <div className={styles.terminalTitle}>
                  SAIDON_AI_DEFI_LOGS://DEBATE_DESK.QUANTUM
                </div>
                <div className={styles.terminalDots} />
              </div>

              <div className={styles.terminalBody} ref={terminalBodyRef}>
                {logs.map((log) => (
                  <div key={log.id} className={styles.logLine}>
                    <span className={styles.logPrefixSys}>{log.time} </span>
                    {getPrefixComponent(log.prefix, log.agentName)}
                    {" "}
                    <span style={{ color: log.prefix === "CONS" ? "#00ff66" : "#ffffff" }}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Simulation Control */}
          <div className={styles.actionSidebar}>
            {/* Control Center Box */}
            <div className={styles.panelBox}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleContainer}>
                  <Zap size={20} className={styles.panelIcon} />
                  <h3 className={styles.panelTitle}>Consola de Automatización</h3>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p className={styles.subtitle} style={{ margin: 0 }}>
                  Activa o pausa el protocolo de debate y rebalanceo de red descentralizada en segundo plano.
                </p>

                <button 
                  onClick={toggleBot} 
                  className={styles.actionButton}
                  style={{
                    background: isBotRunning 
                      ? "linear-gradient(135deg, #ff3d00 0%, #a30000 100%)" 
                      : "linear-gradient(135deg, #00c853 0%, #007900 100%)",
                    color: "#ffffff",
                    boxShadow: isBotRunning 
                      ? "0 4px 20px rgba(255, 61, 0, 0.3)" 
                      : "0 4px 20px rgba(0, 200, 83, 0.3)"
                  }}
                >
                  {isBotRunning ? (
                    <>
                      <StopCircle size={16} /> Detener Debate IA
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Reactivar Debate IA
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trading Swap Simulator Box */}
            <div className={styles.panelBox}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleContainer}>
                  <Coins size={20} className={styles.panelIcon} />
                  <h3 className={styles.panelTitle}>Simulador de Quantum Swap</h3>
                </div>
              </div>

              <form onSubmit={handleExecuteTrade} className={styles.simulatorBox}>
                <div className={styles.walletHeader}>
                  <span className={styles.walletLabel}>Tu Saldo Disponible</span>
                  <span className={styles.walletVal}>
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Activo / Smart Contract Target</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    >
                      <option value="SAIDON">SAIDON (SaidonCoin AMM)</option>
                      <option value="USDT">USDT (Ethereum Tether)</option>
                      <option value="ETH">ETH (Arbitrum Layer 2)</option>
                      <option value="BTC">WBTC (Wrapped Bitcoin Core)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Monto de Swap (USD)</label>
                  <div className={styles.inputWrapper}>
                    <DollarSign size={16} className={styles.inputIcon} />
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="Monto"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Apalancamiento Cuántico ({leverage}x)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    style={{
                      accentColor: "#FF6600",
                      width: "100%",
                      marginTop: "6px"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                    <span>1x (Sin apalancamiento)</span>
                    <span>10x (Arbitraje Máximo)</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Ajuste de Mitigación de Riesgo</label>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {["BAJO", "MEDIO", "ALTO"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setRiskFactor(level)}
                        style={{
                          flex: 1,
                          padding: "8px 4px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: riskFactor === level ? "rgba(255, 102, 0, 0.2)" : "rgba(255,255,255,0.02)",
                          border: riskFactor === level ? "1px solid #FF6600" : "1px solid rgba(255,255,255,0.05)",
                          color: riskFactor === level ? "#FF6600" : "rgba(255,255,255,0.6)"
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSimulatingTrade}
                  className={`${styles.actionButton} ${isSimulatingTrade ? styles.actionButtonDisabled : ""}`}
                  style={{ marginTop: "10px" }}
                >
                  {isSimulatingTrade ? (
                    <>
                      <RefreshCw className={styles.spin} size={16} /> Procesando Debate...
                    </>
                  ) : (
                    <>
                      Ejecutar Quantum Swap
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Toast Notification */}
      <div className={`${styles.toast} ${showToast ? styles.toastShow : ""}`}>
        <Activity size={18} style={{ color: "#FF6600" }} />
        <span className={styles.toastText}>{toastMessage}</span>
      </div>
    </div>
  );
}
