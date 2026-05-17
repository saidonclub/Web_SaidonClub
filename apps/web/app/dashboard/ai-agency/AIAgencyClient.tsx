"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Terminal as TerminalIcon,
  Play,
  StopCircle,
  RefreshCw,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  MessageSquare,
  ShieldAlert,
  Download,
  Copy,
  Sliders,
  FileText,
  Check,
  AlertTriangle,
  PlayCircle
} from "lucide-react";
import styles from "./AIAgency.module.css";

interface AIAgencyClientProps {
  userEmail: string;
  userRole: string;
  userName: string | null;
}

interface LogEntry {
  id: string;
  time: string;
  prefix: "SYS" | "DESIGN" | "CODE" | "QA" | "MARKET" | "SUCCESS";
  agentName: string;
  text: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: "IDLE" | "RUNNING" | "WAITING" | "COMPLETED";
  avatarColor: string;
}

export default function AIAgencyClient({
  userEmail,
  userRole,
  userName
}: AIAgencyClientProps) {
  // Inputs
  const [requirements, setRequirements] = useState("");
  const [taskType, setTaskType] = useState<"code" | "audit" | "market">("code");
  const [speed, setSpeed] = useState<"fast" | "normal" | "immersive">("normal");

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [flowPhase, setFlowPhase] = useState<"IDLE" | "STEP1" | "STEP2" | "STEP3" | "SUCCESS">("IDLE");
  
  // Output state
  const [showOutput, setShowOutput] = useState(false);
  const [outputText, setOutputText] = useState("");
  const [outputTitle, setOutputTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Agents Definition
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "sentinel",
      name: "Sentinel-V3",
      role: "UX/UI Designer",
      description: "Genera requerimientos visuales, diagramas, paletas y esquemas de interacción del sistema.",
      status: "IDLE",
      avatarColor: "#00e5ff"
    },
    {
      id: "aether",
      name: "Aether-Alpha",
      role: "Full-Stack Developer",
      description: "Convierte especificaciones en código estructurado, componentes modulares de React y endpoints de backend.",
      status: "IDLE",
      avatarColor: "#ffeb3b"
    },
    {
      id: "vulcan",
      name: "Vulcan-Risk",
      role: "QA & Security Auditor",
      description: "Audita código fuente, localiza fugas de seguridad, corrige dependencias y otorga certificados.",
      status: "IDLE",
      avatarColor: "#e91e63"
    }
  ]);

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Speed Delays mapping (ms)
  const speedDelays = {
    fast: 500,
    normal: 1300,
    immersive: 2600
  };

  // Custom log adder
  const addLog = (prefix: LogEntry["prefix"], agentName: string, text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        time,
        prefix,
        agentName,
        text
      }
    ]);
  };

  // Update Agent Status locally
  const updateAgentStatus = (id: string, status: Agent["status"]) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Reset agent statuses to IDLE
  const resetAgents = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: "IDLE" })));
    setActiveAgentId(null);
  };

  // Copy output to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    triggerToast("Contenido copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download output file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const ext = taskType === "code" ? "tsx" : "md";
    element.download = `saidon-agency-output-${Date.now()}.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Descarga iniciada exitosamente");
  };

  // ABORT SIMULATION
  const handleAbort = () => {
    if (simulationTimerRef.current) {
      clearTimeout(simulationTimerRef.current);
    }
    setIsRunning(false);
    resetAgents();
    addLog("SYS", "SISTEMA", "❌ Ejecución abortada manualmente por el Operador.");
  };

  // LAUNCH SIMULATION
  const handleLaunch = () => {
    if (isRunning) return;

    const query = requirements.trim() || "Dashboard premium de e-commerce con estilo Obsidian y Safety Orange";
    
    setIsRunning(true);
    setShowOutput(false);
    setLogs([]);
    resetAgents();
    setCurrentStep(0);
    setFlowPhase("STEP1");

    addLog("SYS", "SISTEMA", `🚀 Inicializando agente de orquestación. Requerimiento: "${query}"`);
    addLog("SYS", "SISTEMA", `⚙️ Cargando configuración de velocidad: [${speed.toUpperCase()} Mode].`);

    // Let's launch the custom multi-agent sequence
    if (taskType === "code") {
      runCodeSequence(query);
    } else if (taskType === "audit") {
      runAuditSequence(query);
    } else {
      runMarketSequence(query);
    }
  };

  // 1. CODE SEQUENCE (CrewAI Sequential UX -> Dev -> QA)
  const runCodeSequence = (query: string) => {
    const delay = speedDelays[speed];
    let step = 0;

    const executeNext = () => {
      step++;
      setCurrentStep(step);

      switch (step) {
        case 1:
          setFlowPhase("STEP1");
          setActiveAgentId("sentinel");
          updateAgentStatus("sentinel", "RUNNING");
          addLog("DESIGN", "Sentinel-V3", `🎨 Analizando requerimientos UX/UI para: "${query}".`);
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 2:
          addLog("DESIGN", "Sentinel-V3", "📐 Estructurando diseño Glassmorphic premium. Paleta cromática corporativa: Obsidian (#030303) y Safety Orange (#FF6600).");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 3:
          addLog("DESIGN", "Sentinel-V3", "📱 Definiendo arquitectura responsive de componentes. Grid CSS con máscara radial e interactividad de micro-animaciones.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 4:
          addLog("DESIGN", "Sentinel-V3", "✨ Guía de estilos y mockup listos. Enviando especificaciones de diseño a Aether-Alpha.");
          updateAgentStatus("sentinel", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 5:
          setFlowPhase("STEP2");
          setActiveAgentId("aether");
          updateAgentStatus("aether", "RUNNING");
          addLog("SYS", "SISTEMA", "🔗 Pasando contexto y variables de diseño CSS a Aether-Alpha (Desarrollador Full-Stack).");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 6:
          addLog("CODE", "Aether-Alpha", `💻 Recibida guía UX. Creando plantilla de código React en apps/web/app/components/${query.toLowerCase().replace(/[^a-z0-9]/g, "-")}.`);
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 7:
          addLog("CODE", "Aether-Alpha", "📦 Integrando hooks interactivos (useState, useEffect) y animaciones CSS variables para el color Safety Orange.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 8:
          addLog("CODE", "Aether-Alpha", "🛠️ Ensamblando interfaces semánticas e importes válidos desde Lucide-React. Compilación local inicial exitosa (0 errores).");
          updateAgentStatus("aether", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 9:
          setFlowPhase("STEP3");
          setActiveAgentId("vulcan");
          updateAgentStatus("vulcan", "RUNNING");
          addLog("SYS", "SISTEMA", "🔗 Transfiriendo bundle de código a Vulcan-Risk (QA Auditor) para revisión estática.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 10:
          addLog("QA", "Vulcan-Risk", "🛡️ Escaneando código fuente. Buscando fugas de memoria, loops infinitos e importaciones redundantes.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 11:
          addLog("QA", "Vulcan-Risk", "✅ Cero fallas estructurales detectadas. Rendimiento del bundle optimizado en un 18%. Emitiendo certificado de producción.");
          updateAgentStatus("vulcan", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 12:
          setFlowPhase("SUCCESS");
          setActiveAgentId(null);
          addLog("SUCCESS", "SISTEMA", "🏆 ¡PROCESO FINALIZADO CON ÉXITO! Código de producción compilado y empaquetado.");
          
          // Generate final code output
          const generatedCode = `"use client";\n\nimport React, { useState } from "react";\nimport { Cpu, Zap, Shield, ArrowRight } from "lucide-react";\nimport styles from "./PremiumComponent.module.css";\n\n// Componente Premium generado por Saidon AI Agency\n// Requerimiento: ${query}\n// Paleta: Obsidian & Safety Orange\n\nexport default function PremiumComponent() {\n  const [active, setActive] = useState(false);\n\n  return (\n    <div className={styles.premiumContainer}>\n      <div className={styles.cyberGrid} />\n      <div className={styles.glowEffect} />\n      \n      <div className={styles.header}>\n        <div className={styles.badge}>\n          <Zap size={12} />\n          <span>SAIDON OS V9.5 AI</span>\n        </div>\n        <h2 className={styles.title}>Panel Cuántico</h2>\n        <p className={styles.description}>\n          Módulo inteligente configurado bajo demanda: "${query}"\n        </p>\n      </div>\n\n      <div className={styles.features}>\n        <div className={styles.featureCard}>\n          <Cpu className={styles.orangeIcon} size={24} />\n          <h3>Alto Rendimiento</h3>\n          <p>Optimizaciones estáticas de Vulcan-Risk aprobadas al 100%.</p>\n        </div>\n        <div className={styles.featureCard}>\n          <Shield className={styles.orangeIcon} size={24} />\n          <h3>Seguridad Hardened</h3>\n          <p>Auditoría de dependencias limpia y sin vulnerabilidades.</p>\n        </div>\n      </div>\n\n      <button \n        onClick={() => setActive(!active)} \n        className={styles.actionButton}\n      >\n        <span>{active ? "SISTEMA ACTIVO" : "INICIALIZAR SISTEMA"}</span>\n        <ArrowRight size={16} />\n      </button>\n    </div>\n  );\n}`;
          
          setOutputText(generatedCode);
          setOutputTitle("PremiumComponent.tsx (React + CSS Modules)");
          setShowOutput(true);
          setIsRunning(false);
          triggerToast("¡Entregable de código generado con éxito!");
          break;
        default:
          break;
      }
    };

    simulationTimerRef.current = setTimeout(executeNext, 400);
  };

  // 2. AUDIT SEQUENCE (LangGraph Iterative Smart Contracts & MLM Math)
  const runAuditSequence = (query: string) => {
    const delay = speedDelays[speed];
    let step = 0;

    const executeNext = () => {
      step++;
      setCurrentStep(step);

      switch (step) {
        case 1:
          setFlowPhase("STEP1");
          setActiveAgentId("aether");
          updateAgentStatus("aether", "RUNNING");
          addLog("CODE", "Aether-Alpha", `📄 Estructurando borrador de Contrato Inteligente MLM Solidity para: "${query}".`);
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 2:
          addLog("CODE", "Aether-Alpha", "🔏 Definiendo variables de estado: balances de afiliados, cálculo recursivo de puntos por volumen de red.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 3:
          addLog("CODE", "Aether-Alpha", "✏️ Borrador 1 completado. Transfiriendo código a Vulcan-Risk en el grafo LangGraph para Auditoría Formal.");
          updateAgentStatus("aether", "WAITING");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 4:
          setFlowPhase("STEP2");
          setActiveAgentId("vulcan");
          updateAgentStatus("vulcan", "RUNNING");
          addLog("QA", "Vulcan-Risk", "🔍 Ejecutando suite de análisis estático en Solidity (Mythril / Slither). Escaneando llamadas recursivas...");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 5:
          addLog("QA", "Vulcan-Risk", "⚠️ ¡ADVERTENCIA DE SEGURIDAD! Detectada vulnerabilidad de Reentrada (Reentrancy) en el cobro de comisiones de red.");
          addLog("QA", "Vulcan-Risk", "🚨 ERROR CRÍTICO: El cálculo recursivo de MLM no tiene límite de profundidad; superará el límite de gas si hay más de 20 niveles.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 6:
          addLog("QA", "Vulcan-Risk", "❌ Rechazado. Generando reporte de fallos y retornando control a Aether-Alpha para corrección (Iteración 1).");
          updateAgentStatus("vulcan", "WAITING");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 7:
          setFlowPhase("STEP3");
          setActiveAgentId("aether");
          updateAgentStatus("aether", "RUNNING");
          addLog("CODE", "Aether-Alpha", "🔧 Recibido reporte de fallos. Aplicando patrón de Chequeos-Efectos-Interacciones para mitigar Reentrada.");
          addLog("CODE", "Aether-Alpha", "📈 Limitando la recursión recursiva del árbol MLM estrictamente a un máximo de 10 niveles y añadiendo modificador nonReentrant.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 8:
          addLog("CODE", "Aether-Alpha", "📝 Contrato corregido. Re-enviando al nodo de Auditoría en el grafo recursivo.");
          updateAgentStatus("aether", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 9:
          setFlowPhase("STEP3"); // Iteration 2
          setActiveAgentId("vulcan");
          updateAgentStatus("vulcan", "RUNNING");
          addLog("QA", "Vulcan-Risk", "🔍 Re-escaneando contrato con parches aplicados. Validando límites aritméticos con SafeMath.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 10:
          addLog("QA", "Vulcan-Risk", "✅ Verificación exitosa. Parche de Reentrada verificado. Gas MLM optimizado y acotado. Todo seguro.");
          updateAgentStatus("vulcan", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 11:
          setFlowPhase("SUCCESS");
          setActiveAgentId(null);
          addLog("SUCCESS", "SISTEMA", "🏆 ¡PROCESO COMPLETADO! Auditoría formal aprobada. El contrato es 100% inmune a ataques conocidos.");
          
          const auditReport = `# REPORTE DE AUDITORÍA FORMAL DE SEGURIDAD\n\n## 1. RESUMEN EJECUTIVO\n* **Proyecto:** Contrato de Comisión MLM SaidonClub\n* **Configuración:** ${query}\n* **Auditor Principal:** Vulcan-Risk QA Agent\n* **Desarrollador:** Aether-Alpha Dev Agent\n* **Estado:** APROBADO (Producción Listo)\n\n## 2. ANÁLISIS DE VULNERABILIDADES (MATRIZ LANGGRAPH)\n\n| ID | Vulnerabilidad | Gravedad | Estado Inicial | Estado Parcheado |\n|---|---|---|---|---|\n| VR-01 | Reentrada (Reentrancy) | ALTA | 🔴 Vulnerable | 🟢 Mitigado (nonReentrant) |\n| VR-02 | Agotamiento de Gas MLM | MEDIA | 🔴 Desbordamiento | 🟢 Acotado (Max 10 Niveles) |\n| VR-03 | Aritmética Insegura | BAJA | 🟡 Advertencia | 🟢 SafeMath Implementado |\n\n## 3. SOLUCIONES TÉCNICAS APLICADAS\n1. **Modificador de Reentrada:** Se añadió el patrón de protección contra reentradas previniendo que los retiros simultáneos manipulen balances intermedios.\n2. **Pila MLM Acotada:** Se configuró un límite de profundidad máximo a 10 niveles, evitando que la red de afiliados sufra de fallos de gas en la blockchain virtual.\n\n## 4. CERTIFICACIÓN DE INMUNIDAD\n*El Vulcan-Risk Agent certifica formalmente que el código auditado ha pasado todas las pruebas dinámicas y es apto para despliegue en mainnet.*`;
          
          setOutputText(auditReport);
          setOutputTitle("Reporte_Auditoria_MLM.md (Markdown)");
          setShowOutput(true);
          setIsRunning(false);
          triggerToast("¡Auditoría de seguridad completada!");
          break;
        default:
          break;
      }
    };

    simulationTimerRef.current = setTimeout(executeNext, 400);
  };

  // 3. MARKET SEQUENCE (CrewAI Parallel Competition Intelligence)
  const runMarketSequence = (query: string) => {
    const delay = speedDelays[speed];
    let step = 0;

    const executeNext = () => {
      step++;
      setCurrentStep(step);

      switch (step) {
        case 1:
          setFlowPhase("STEP1");
          setActiveAgentId("sentinel");
          updateAgentStatus("sentinel", "RUNNING");
          addLog("MARKET", "Sentinel-V3", `📊 Escaneando mercado de competidores directos para: "${query}".`);
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 2:
          addLog("MARKET", "Sentinel-V3", "📈 Extrayendo volúmenes de búsqueda en Google, tendencias en Twitter y menciones en redes de inversión.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 3:
          addLog("MARKET", "Sentinel-V3", "📋 Identificados 3 competidores clave. Fortalezas: Integraciones automáticas. Debilidades: Comisiones altas.");
          updateAgentStatus("sentinel", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 4:
          setFlowPhase("STEP2");
          setActiveAgentId("aether");
          updateAgentStatus("aether", "RUNNING");
          addLog("SYS", "SISTEMA", "🔗 Pasando datos de volumen a Aether-Alpha para análisis técnico de precios y costos.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 5:
          addLog("MARKET", "Aether-Alpha", "💰 Evaluando matrices de precios y costos operativos de servidores de la competencia.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 6:
          addLog("MARKET", "Aether-Alpha", "📉 El costo promedio de adquisición de clientes en el sector es de $12.50. Costo de infraestructura estimado: $0.08 por usuario/mes.");
          updateAgentStatus("aether", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay / 2);
          break;
        case 7:
          setFlowPhase("STEP3");
          setActiveAgentId("vulcan");
          updateAgentStatus("vulcan", "RUNNING");
          addLog("SYS", "SISTEMA", "🔗 Transfiriendo matriz financiera a Vulcan-Risk para evaluar riesgos regulatorios y de modelo.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 8:
          addLog("MARKET", "Vulcan-Risk", "⚖️ Evaluando riesgos normativos (GDPR, CCPA) y barreras de entrada financieras en mercados hispanos.");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 9:
          addLog("MARKET", "Vulcan-Risk", "🏆 Matriz FODA corporativa completada. Conclusiones estratégicas listas para empaquetado.");
          updateAgentStatus("vulcan", "COMPLETED");
          simulationTimerRef.current = setTimeout(executeNext, delay);
          break;
        case 10:
          setFlowPhase("SUCCESS");
          setActiveAgentId(null);
          addLog("SUCCESS", "SISTEMA", "🏆 ¡INVESTIGACIÓN DE MERCADO FINALIZADA! Síntesis estratégica generada para exportación.");
          
          const marketReport = `# INFORME DE INTELIGENCIA DE MERCADO IA\n\n## 1. ANÁLISIS DE LA COMPETENCIA ("${query}")\n* **Nicho de Mercado:** ${query}\n* **Volumen de Búsqueda:** Alto (+45% de crecimiento mensual)\n* **Competidor Clave A:** Plataforma SaaS internacional (Planes desde $49/mes)\n* **Competidor Clave B:** Red descentralizada de afiliados (Poca transparencia en cobros)\n\n## 2. ANÁLISIS FODA ESTRATÉGICO\n\n* **Fortalezas:** Integración directa con el ecosistema de SaidonClub OS, costo de servidores de bajo impacto.\n* **Oportunidades:** Capturar al público insatisfecho de habla hispana que exige velocidad y comisiones bajas.\n* **Debilidades:** Necesidad de fuerte branding inicial para competir con marcas consolidadas.\n* **Amenazas:** Cambios rápidos en regulaciones criptográficas locales.\n\n## 3. PROYECCIÓN FINANCIERA ESTIMADA\n* **Margen de Ganancia Neto:** 82%\n* **Costo Operativo Estimado:** $0.05 por transacción simulada\n* **Precio Recomendado:** Plan básico a $19.99/mes (Sub-cotizando la competencia en un 60%)\n\n## 4. RECOMENDACIONES DE DESPLIEGUE\n*Desplegar una campaña piloto enfocada en el ahorro de comisiones y transparencia automatizada por IA.*`;
          
          setOutputText(marketReport);
          setOutputTitle("Reporte_Inteligencia_Mercado.md (Markdown)");
          setShowOutput(true);
          setIsRunning(false);
          triggerToast("¡Investigación de mercado completada con éxito!");
          break;
        default:
          break;
      }
    };

    simulationTimerRef.current = setTimeout(executeNext, 400);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cyberGrid} />
      
      <div className={styles.inner}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>Volver al Centro de Comando</span>
          </Link>
          <div className={styles.titleWrapper}>
            <div>
              <h1 className={styles.title}>Saidon AI Development & Research Agency</h1>
              <p className={styles.subtitle}>
                Simulador interactivo multi-agente de CrewAI y LangGraph para despliegues de alto rendimiento.
              </p>
            </div>
            <div className={styles.roleTag}>
              <Cpu size={14} />
              <span>{userRole} Agent Console</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          
          {/* Side Controls Card */}
          <div className={styles.panelCard}>
            <h3 className={styles.panelTitle}>
              <Sliders size={18} className={styles.orangeIcon} />
              <span>Configuración de Tarea</span>
            </h3>

            {/* Selector de tipo de tarea */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipo de Proceso IA</label>
              <div className={styles.taskSelectors}>
                <div 
                  className={`${styles.taskSelectorItem} ${taskType === "code" ? styles.taskSelectorActive : ""}`}
                  onClick={() => !isRunning && setTaskType("code")}
                >
                  <input 
                    type="radio" 
                    checked={taskType === "code"} 
                    onChange={() => {}}
                    disabled={isRunning} 
                    className={styles.taskRadio}
                  />
                  <div className={styles.taskMeta}>
                    <span className={styles.taskName}>Diseño de Código (CrewAI Sequential)</span>
                    <span className={styles.taskDesc}>Flujo lineal ordenado: UX/UI (Sentinel) ➔ Dev (Aether) ➔ QA (Vulcan).</span>
                  </div>
                </div>

                <div 
                  className={`${styles.taskSelectorItem} ${taskType === "audit" ? styles.taskSelectorActive : ""}`}
                  onClick={() => !isRunning && setTaskType("audit")}
                >
                  <input 
                    type="radio" 
                    checked={taskType === "audit"} 
                    onChange={() => {}}
                    disabled={isRunning} 
                    className={styles.taskRadio}
                  />
                  <div className={styles.taskMeta}>
                    <span className={styles.taskName}>Auditoría de Contratos (LangGraph)</span>
                    <span className={styles.taskDesc}>Ciclo recursivo de corrección y auditoría entre Dev y QA hasta lograr consenso seguro.</span>
                  </div>
                </div>

                <div 
                  className={`${styles.taskSelectorItem} ${taskType === "market" ? styles.taskSelectorActive : ""}`}
                  onClick={() => !isRunning && setTaskType("market")}
                >
                  <input 
                    type="radio" 
                    checked={taskType === "market"} 
                    onChange={() => {}}
                    disabled={isRunning} 
                    className={styles.taskRadio}
                  />
                  <div className={styles.taskMeta}>
                    <span className={styles.taskName}>Inteligencia de Mercado (CrewAI Parallel)</span>
                    <span className={styles.taskDesc}>Investigación en paralelo de competidores, precios y riesgos con síntesis unificada.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom inputs */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Requerimientos del Negocio</label>
              <textarea 
                className={styles.formTextarea}
                placeholder="Escribe qué deseas que diseñen, auditen o investiguen los agentes... (Ej: Dashboard de e-commerce glassmorphic, Contrato de comisiones MLM, etc.)"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                disabled={isRunning}
              />
            </div>

            {/* Speed selection */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tuning de Velocidad de los Agentes</label>
              <div className={styles.speedSelector}>
                <button 
                  className={`${styles.speedOption} ${speed === "fast" ? styles.speedOptionActive : ""}`}
                  onClick={() => setSpeed("fast")}
                  disabled={isRunning}
                >
                  Rápido
                </button>
                <button 
                  className={`${styles.speedOption} ${speed === "normal" ? styles.speedOptionActive : ""}`}
                  onClick={() => setSpeed("normal")}
                  disabled={isRunning}
                >
                  Normal
                </button>
                <button 
                  className={`${styles.speedOption} ${speed === "immersive" ? styles.speedOptionActive : ""}`}
                  onClick={() => setSpeed("immersive")}
                  disabled={isRunning}
                >
                  Inmersivo
                </button>
              </div>
            </div>

            {/* Action buttons */}
            {!isRunning ? (
              <button 
                onClick={handleLaunch} 
                className={styles.launchButton}
              >
                <Play size={16} />
                <span>Iniciar Simulación</span>
              </button>
            ) : (
              <button 
                onClick={handleAbort} 
                className={styles.abortButton}
              >
                <StopCircle size={16} />
                <span>Detener Ejecución</span>
              </button>
            )}

            {/* Crew Status Indicator */}
            <h4 className={styles.agentTitle}>Tripulación de Agentes</h4>
            <div className={styles.agentSidebarList}>
              {agents.map(agent => (
                <div 
                  key={agent.id} 
                  className={`${styles.sidebarAgentCard} ${activeAgentId === agent.id ? styles.sidebarAgentCardActive : ""}`}
                >
                  <div 
                    className={styles.agentMiniAvatar}
                    style={{ backgroundColor: `${agent.avatarColor}15`, color: agent.avatarColor, borderColor: `${agent.avatarColor}40` }}
                  >
                    {agent.name.substring(0, 2)}
                  </div>
                  <div className={styles.agentMiniMeta}>
                    <div className={styles.agentMiniName}>{agent.name}</div>
                    <div className={styles.agentMiniRole}>{agent.role}</div>
                  </div>
                  <div 
                    className={`${styles.agentMiniState} ${activeAgentId === agent.id ? styles.agentMiniStateActive : ""}`} 
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Immersive Obsidian Terminal Panel */}
          <div className={styles.terminalCard}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalControls}>
                <div className={`${styles.terminalDot} ${styles.dotRed}`} />
                <div className={`${styles.terminalDot} ${styles.dotYellow}`} />
                <div className={`${styles.terminalDot} ${styles.dotGreen}`} />
              </div>
              <div className={styles.terminalTitle}>
                <TerminalIcon size={14} className={styles.orangeIcon} />
                <span>saidon-agency-kernel:~</span>
              </div>
              <div className={styles.terminalIndicator}>
                {isRunning ? (
                  <span className={styles.indRunning}>● Procesando</span>
                ) : (
                  <span className={styles.indIdle}>● Inactivo</span>
                )}
              </div>
            </div>

            {/* Live diagram of process flow */}
            <div className={styles.flowDiagram}>
              <div className={styles.flowStep}>
                <div className={`${styles.flowStepCircle} ${flowPhase !== "IDLE" ? styles.flowStepCircleActive : ""} ${flowPhase !== "IDLE" && flowPhase !== "STEP1" ? styles.flowStepCircleSuccess : ""}`}>
                  1
                </div>
                <span className={`${styles.flowStepLabel} ${flowPhase !== "IDLE" ? styles.flowStepLabelActive : ""} ${flowPhase !== "IDLE" && flowPhase !== "STEP1" ? styles.flowStepLabelSuccess : ""}`}>
                  {taskType === "audit" ? "Borrador" : "Diseño UX"}
                </span>
              </div>
              
              <div className={`${styles.flowConnector} ${flowPhase !== "IDLE" && flowPhase !== "STEP1" ? styles.flowConnectorSuccess : ""} ${flowPhase === "STEP1" ? styles.flowConnectorActive : ""}`} />

              <div className={styles.flowStep}>
                <div className={`${styles.flowStepCircle} ${flowPhase === "STEP2" || flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepCircleActive : ""} ${flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepCircleSuccess : ""}`}>
                  2
                </div>
                <span className={`${styles.flowStepLabel} ${flowPhase === "STEP2" || flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepLabelActive : ""} ${flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepLabelSuccess : ""}`}>
                  {taskType === "audit" ? "Auditoría 1" : "Desarrollo"}
                </span>
              </div>

              <div className={`${styles.flowConnector} ${flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowConnectorSuccess : ""} ${flowPhase === "STEP2" ? styles.flowConnectorActive : ""}`} />

              <div className={styles.flowStep}>
                <div className={`${styles.flowStepCircle} ${flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepCircleActive : ""} ${flowPhase === "SUCCESS" ? styles.flowStepCircleSuccess : ""}`}>
                  3
                </div>
                <span className={`${styles.flowStepLabel} ${flowPhase === "STEP3" || flowPhase === "SUCCESS" ? styles.flowStepLabelActive : ""} ${flowPhase === "SUCCESS" ? styles.flowStepLabelSuccess : ""}`}>
                  {taskType === "audit" ? "Parche & QA" : "Revisión QA"}
                </span>
              </div>

              <div className={`${styles.flowConnector} ${flowPhase === "SUCCESS" ? styles.flowConnectorSuccess : ""} ${flowPhase === "STEP3" ? styles.flowConnectorActive : ""}`} />

              <div className={styles.flowStep}>
                <div className={`${styles.flowStepCircle} ${flowPhase === "SUCCESS" ? styles.flowStepCircleSuccess : ""}`}>
                  ✓
                </div>
                <span className={`${styles.flowStepLabel} ${flowPhase === "SUCCESS" ? styles.flowStepLabelSuccess : ""}`}>
                  Éxito
                </span>
              </div>
            </div>

            <div className={styles.terminalBody}>
              {logs.length === 0 && (
                <div className={styles.systemText}>
                  Espíritu cuántico Saidon listo. Configura la tarea y pulsa &quot;Iniciar Simulación&quot; para desplegar la tripulación de agentes autónomos de desarrollo.
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className={styles.terminalLine}>
                  <span className={styles.time}>[{log.time}]</span>
                  <span className={`${styles.prefix} ${styles["prefix" + log.prefix]}`}>
                    {log.prefix}
                  </span>
                  <span className={styles.lineText}>
                    {log.agentName !== "SISTEMA" && (
                      <span className={styles.agentNameTag}>{log.agentName}: </span>
                    )}
                    {log.text}
                  </span>
                </div>
              ))}
              
              {isRunning && (
                <div className={styles.promptLine}>
                  <span>$ running-agent-crew-thread --active</span>
                  <span className={styles.promptCursor} />
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

          </div>

        </div>

        {/* Output Showcase Panel */}
        {showOutput && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <div className={styles.outputTitleWrapper}>
                <CheckCircle2 size={24} style={{ color: "#00e676" }} />
                <h3 className={styles.outputTitle}>{outputTitle}</h3>
                <span className={styles.outputBadge}>Listo para Exportación</span>
              </div>
              <div className={styles.outputActions}>
                <button onClick={handleCopy} className={styles.actionButton}>
                  <Copy size={14} />
                  <span>{copied ? "Copiado" : "Copiar"}</span>
                </button>
                <button onClick={handleDownload} className={`${styles.actionButton} ${styles.downloadButton}`}>
                  <Download size={14} />
                  <span>Descargar Entregable</span>
                </button>
              </div>
            </div>

            <div className={styles.outputDisplay}>
              {taskType === "code" ? (
                <pre className={styles.codeBlock}>
                  <code>{outputText}</code>
                </pre>
              ) : (
                <div className={styles.textBlock}>
                  {outputText.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("## ")) {
                      return <h4 key={pIdx} className={styles.textSectionTitle}>{para.replace("## ", "")}</h4>;
                    } else if (para.startsWith("* ")) {
                      return (
                        <ul key={pIdx}>
                          {para.split("\n").map((li, lIdx) => (
                            <li key={lIdx} style={{ listStyleType: "square", marginLeft: "20px", color: "rgba(255,255,255,0.85)" }}>
                              {li.replace("* ", "")}
                            </li>
                          ))}
                        </ul>
                      );
                    } else if (para.startsWith("|")) {
                      // Render Markdown tables nicely
                      const rows = para.split("\n").filter(r => r.trim() !== "");
                      return (
                        <table key={pIdx} style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                          <thead>
                            <tr style={{ borderBottom: "2px solid #FF6600", textAlign: "left" }}>
                              {rows[0].split("|").filter(c => c.trim() !== "").map((th, thIdx) => (
                                <th key={thIdx} style={{ padding: "8px", color: "#FF6600", fontSize: "12px", textTransform: "uppercase" }}>{th.trim()}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.slice(2).map((row, rIdx) => (
                              <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                {row.split("|").filter(c => c.trim() !== "").map((td, tdIdx) => (
                                  <td key={tdIdx} style={{ padding: "8px", fontSize: "13px", color: td.includes("🔴") ? "#ff5f56" : td.includes("🟢") ? "#00e676" : "rgba(255,255,255,0.85)" }}>{td.trim()}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    }
                    return <p key={pIdx} style={{ lineHeight: "1.6" }}>{para}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Toast Messages */}
      {showToast && (
        <div className={styles.toast}>
          <CheckCircle2 size={16} style={{ color: "#FF6600" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
