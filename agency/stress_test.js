/**
 * AGENCIA DE DESARROLLO WEB CON IA - STRESS TEST
 * Simulación de ciclo LangGraph (Developer -> QA -> Fix)
 */

const agents = {
    developer: {
        name: "Full-Stack Dev",
        work: (task) => {
            console.log(`[${new Date().toLocaleTimeString()}] 💻 DEV: Generando lógica para ${task}...`);
            return { code: "function calculateCommission(pts) { return pts * 0.1; }", bug: Math.random() > 0.5 };
        }
    },
    qa: {
        name: "QA Tester",
        test: (result) => {
            console.log(`[${new Date().toLocaleTimeString()}] 🔍 QA: Auditando código...`);
            if (result.bug) {
                console.log("❌ QA: ERROR DETECTADO - La lógica no contempla valores negativos.");
                return false;
            }
            console.log("✅ QA: Código verificado sin errores.");
            return true;
        }
    }
};

async function runStressTest(task, iterations = 5) {
    console.log(`🚀 INICIANDO TEST DE ESTRÉS: ${task}\n`);
    let currentIteration = 1;
    let passed = false;

    while (currentIteration <= iterations && !passed) {
        console.log(`--- ITERACIÓN ${currentIteration} ---`);
        const workResult = agents.developer.work(task);
        passed = agents.qa.test(workResult);
        
        if (!passed) {
            console.log("🔄 Re-enviando a Developer para corrección...");
        }
        currentIteration++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("");
    }

    if (passed) {
        console.log("🏆 TEST COMPLETADO CON ÉXITO.");
    } else {
        console.log("⚠️ TEST FALLIDO: Se alcanzó el límite de iteraciones sin éxito.");
    }
}

runStressTest("Cálculo de Comisiones MLM Nivel 1");
