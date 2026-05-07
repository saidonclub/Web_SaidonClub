# ✅ CONFIGURACION KIMI CODE EN VS CODE CON TU API NVIDIA

Tu extension de Kimi Code ya esta instalada, aqui los pasos exactos para configurarla con tu API Key de Nvidia:

---

## 🔧 PASO 1: Abrir Configuracion de Kimi Code
1. Abre **Settings** en VS Code (Ctrl + ,)
2. Busca: `kimi code`
3. Click en `Edit in settings.json`

---

## 📋 CONFIGURACION QUE DEBES PEGAR:
Pega esto exactamente en tu `settings.json`:

```json
{
  "kimi-code.apiBaseUrl": "https://integrate.api.nvidia.com/v1",
  "kimi-code.apiKey": "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",
  "kimi-code.modelName": "moonshotai/kimi-k2.5",
  "kimi-code.maxTokens": 8192,
  "kimi-code.temperature": 0.2,
  "kimi-code.enableContextWindow": true,
  "kimi-code.useStreaming": true
}
```

---

## ✅ PASO 2: VERIFICAR FUNCIONAMIENTO
1. Cierra y reabre VS Code completamente
2. Abre cualquier archivo de codigo
3. Presiona `Ctrl + Shift + P`
4. Ejecuta el comando: `Kimi Code: Start Chat`
5. Escribe cualquier pregunta, deberia responder inmediatamente

---

## 📌 MODELOS DISPONIBLES PARA USAR EN LA EXTENSION:
Puedes cambiar `modelName` por cualquiera de estos:
| Modelo | Nombre exacto |
|---|---|
| ✅ Kimi K2.5 (recomendado) | `moonshotai/kimi-k2.5` |
| ✅ Kimi K2 Thinking | `moonshotai/kimi-k2-thinking` |
| ✅ DeepSeek V4 Pro | `deepseek-ai/deepseek-v4-pro` |
| ✅ DeepSeek V4 Flash | `deepseek-ai/deepseek-v4-flash` |
| ✅ GLM 5 | `z-ai/glm5` |
| ✅ GLM 5.1 | `z-ai/glm-5.1` |
| ✅ Qwen 3.5 | `qwen/qwen3.5-397b-a17b` |

---

## 🔴 IMPORTANTE:
✅ La extension Kimi Code funciona perfectamente con cualquier endpoint compatible OpenAI, y la API de Nvidia es 100% compatible.

✅ No necesitas nada mas, ya tienes configurado todo. La extension no sabe que estas usando Nvidia, piensa que es el servidor oficial de Kimi.

✅ Todos los comandos, autocompletado, refactorizacion, chat y todas las funcionalidades de Kimi Code funcionaran exactamente igual.