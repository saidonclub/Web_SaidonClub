# 🚀 Guía de Configuración: Google Sheets API & Service Account

Para que la automatización de SaidonClub pueda escribir y leer datos de Google Sheets de manera segura y en segundo plano (sin requerir que inicies sesión manualmente cada vez), necesitamos configurar una **Cuenta de Servicio (Service Account)** en Google Cloud.

Sigue estos pasos detalladamente. Tomará aproximadamente 5 minutos.

---

### Paso 1: Habilitar la API de Google Sheets
1. Ingresa a la consola de Google Cloud: [Google Cloud Console](https://console.cloud.google.com/) e inicia sesión con tu cuenta de Google.
2. Crea un **Nuevo Proyecto** (si no tienes uno) desde el menú desplegable en la barra superior. Nómbralo algo como `SaidonClub-Sync`.
3. Ve al menú lateral izquierdo (menú hamburguesa) > **APIs & Services (API y Servicios)** > **Library (Biblioteca)**.
4. En el buscador, escribe **"Google Sheets API"**.
5. Selecciona "Google Sheets API" y haz clic en el botón azul **Activar (Enable)**.

### Paso 2: Crear la Cuenta de Servicio (Service Account)
1. Ve nuevamente al menú lateral izquierdo > **APIs & Services** > **Credentials (Credenciales)**.
2. En la parte superior, haz clic en **+ CREATE CREDENTIALS (+ Crear Credenciales)** y selecciona **Service Account (Cuenta de Servicio)**.
3. Completa los detalles:
   - **Service account name:** `saidonclub-sheets-bot` (o el nombre que prefieras).
   - Haz clic en **Create and Continue (Crear y continuar)**.
   - En el rol (Role), no es estrictamente necesario, pero puedes asignarle `Editor`. Haz clic en **Continue** y luego en **Done (Listo)**.
4. Volverás a la pantalla de Credenciales. En la sección "Service Accounts", verás el correo recién creado (lucirá algo como `saidonclub-sheets-bot@tu-proyecto.iam.gserviceaccount.com`). 
   > 📌 **¡Copia este correo!** Este es tu `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

### Paso 3: Generar la Llave Privada (Private Key)
1. Haz clic en el correo de la cuenta de servicio que acabas de crear para editarla.
2. Ve a la pestaña **KEYS (Claves)** en la parte superior.
3. Haz clic en **Add Key (Agregar clave)** > **Create new key (Crear clave nueva)**.
4. Selecciona el formato **JSON** y haz clic en **Create (Crear)**.
5. Se descargará un archivo `.json` a tu computadora. Ábrelo con el bloc de notas o tu editor de código.
6. Dentro del archivo verás un campo llamado `"private_key"`. Inicia con `-----BEGIN PRIVATE KEY-----\n` y termina con `\n-----END PRIVATE KEY-----\n`.
   > 📌 **¡Copia todo ese texto exacto!** Esta será tu `GOOGLE_PRIVATE_KEY`.

### Paso 4: Configurar tu Hoja de Cálculo (Google Sheets)
1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo en blanco.
2. Llámala `SaidonClub Audit` (o como prefieras).
3. **Paso Crítico:** Haz clic en el botón verde **Compartir (Share)** en la esquina superior derecha.
4. Pega el correo electrónico de tu Service Account (el que copiaste en el Paso 2) y dale permisos de **Editor**. Haz clic en Enviar/Compartir. *(Esto le permite al sistema modificar este documento específico sin acceder al resto de tu Google Drive)*.
5. Mira la URL de tu hoja de cálculo en el navegador. Se verá algo así:
   `https://docs.google.com/spreadsheets/d/1XyZ_abc123XYZ.../edit#gid=0`
   > 📌 **Copia la secuencia de letras y números entre `/d/` y `/edit`**. ¡Ese es tu `GOOGLE_SHEET_ID`!

---

### Paso 5: Insertar en el Proyecto (.env)
Abre tu archivo `.env` en la raíz de tu proyecto (`C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\.env`) y reemplaza las variables vacías por las que acabas de obtener:

```env
GOOGLE_SHEET_ID="1XyZ_abc123XYZ..."
GOOGLE_SERVICE_ACCOUNT_EMAIL="saidonclub-sheets-bot@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...[MUCHAS LETRAS]...\n-----END PRIVATE KEY-----\n"
```

*(Importante: La Private Key debe ir entre comillas dobles y mantener los `\n` literalmente como vienen en el archivo JSON).*

---

### Paso 6: Ejecutar la Prueba
Una vez guardado el archivo `.env`, ejecuta el comando en tu terminal de Visual Studio Code:

```bash
pnpm run test:sheets
```

¡Listo! Si todo está bien, verás un mensaje de éxito en verde.
