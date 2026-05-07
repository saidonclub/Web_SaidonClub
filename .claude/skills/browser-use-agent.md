# Browser Use Agent Skill

Este skill permite controlar un navegador web usando inteligencia artificial con capacidades de evasión de detección.

## Cuándo usar este skill

Usa este skill cuando el usuario quiere:
- Automatizar tareas en el navegador
- Extraer datos de sitios web
- Rellenar formularios automáticamente
- Realizar pruebas de scraping
- Navegar y completar flujos complejos
- Usar un agente de IA para controlar el navegador

## Comandos disponibles

### 1. Ejecutar tarea en navegador

```bash
python browser_agent.py --task "tu tarea aquí" --url "https://sitio.com"
```

### 2. Con opciones avanzadas

```bash
python browser_agent.py --task "Buscar información" --url "https://google.com" --provider anthropic --model claude-3-sonnet-20240229 --headless
```

### 3. Guardar resultado

```bash
python browser_agent.py --task "Extraer precios" --url "https://ejemplo.com" --output resultado.json --screenshot captura.png
```

## Variables de entorno requeridas

Para usar OpenAI:
```bash
export OPENAI_API_KEY="sk-..."
```

Para usar Anthropic:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Parámetros

| Parámetro | Descripción | Valores |
|-----------|-------------|---------|
| `--task` | Tarea a ejecutar (requerido) | Texto con descripción |
| `--url` | URL inicial (opcional) | URL válida |
| `--provider` | Proveedor de LLM | `openai` (default) o `anthropic` |
| `--model` | Modelo a usar | `gpt-4o`, `claude-3-sonnet`, etc. |
| `--headless` | Sin interfaz gráfica | flag (opcional) |
| `--output` | Archivo de salida JSON | ruta |
| `--screenshot` | Guardar captura | ruta.png |

## Ejemplos de tareas

- "Buscar precios de productos en esta página"
- "Encontrar todos los enlaces de contacto"
- "Rellenar el formulario de registro"
- "Navegar a la sección de precios"
- "Extraer todas las reseñas de clientes"
- "Hacer clic en el botón de compra"

## Verificar instalación

Para verificar que todo funciona:

```bash
python browser_use_test.py
```

## Notas

- El agente usa visión por computadora para entender la página
- No depende de selectores CSS rígidos
- Soporta flujo de trabajo complejos
- Incluye técnicas de stealth para evitar detección básica
- Compatible con cualquier LLM (OpenAI, Anthropic, Google, etc.)

## Archivo principal

El script principal está en: `browser_agent.py`
El script de prueba está en: `browser_use_test.py`