# 🔑 Guía Completa: Crear Credenciales de Google Cloud

## 📋 Paso 1: Crear Proyecto en Google Cloud Console

### 1.1 Acceder a Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Si es tu primera vez, acepta los términos de servicio

### 1.2 Crear un Nuevo Proyecto
1. Haz clic en el selector de proyectos (parte superior izquierda)
2. Clic en "NUEVO PROYECTO"
3. Ingresa un nombre para tu proyecto: `calculadora-financiera-analytics`
4. Selecciona tu organización (si tienes una)
5. Haz clic en "CREAR"
6. **¡IMPORTANTE!** Espera a que se cree el proyecto y selecciónalo

---

## 🔌 Paso 2: Habilitar APIs Necesarias

### 2.1 Habilitar Google Sheets API
1. En el menú lateral, ve a "APIs y servicios" → "Biblioteca"
2. Busca "Google Sheets API"
3. Haz clic en "Google Sheets API"
4. Clic en "HABILITAR"
5. Espera a que se habilite (puede tomar unos segundos)

### 2.2 Habilitar Google Drive API
1. En la misma biblioteca, busca "Google Drive API"
2. Haz clic en "Google Drive API"
3. Clic en "HABILITAR"
4. Espera a que se habilite

---

## 🔐 Paso 3: Crear API Key

### 3.1 Generar la API Key
1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "+ CREAR CREDENCIALES"
3. Selecciona "Clave de API"
4. Se generará automáticamente tu API Key
5. **¡COPIA Y GUARDA!** Esta clave en un lugar seguro

### 3.2 Restringir la API Key (Recomendado)
1. Haz clic en el ícono de lápiz (editar) junto a tu API Key
2. En "Restricciones de aplicación":
   - Selecciona "Referentes HTTP (sitios web)"
   - Agrega estos dominios:
     ```
     http://localhost:*
     https://localhost:*
     https://tu-dominio.com/*
     ```
3. En "Restricciones de API":
   - Selecciona "Restringir clave"
   - Marca: "Google Sheets API" y "Google Drive API"
4. Haz clic en "GUARDAR"

---

## 👤 Paso 4: Crear OAuth 2.0 Client ID

### 4.1 Configurar Pantalla de Consentimiento OAuth
1. Ve a "APIs y servicios" → "Pantalla de consentimiento de OAuth"
2. Selecciona "Externo" (a menos que tengas Google Workspace)
3. Haz clic en "CREAR"
4. Completa la información requerida:
   - **Nombre de la aplicación**: `Mi Calculadora Financiera`
   - **Correo electrónico de asistencia**: tu email
   - **Logotipo de la aplicación**: (opcional)
   - **Dominios autorizados**: tu dominio (ej: `mi-calculadora.com`)
   - **Correo electrónico del desarrollador**: tu email
5. Haz clic en "GUARDAR Y CONTINUAR"
6. En "Alcances", haz clic en "GUARDAR Y CONTINUAR" (sin agregar alcances)
7. En "Usuarios de prueba", agrega tu email si es necesario
8. Haz clic en "GUARDAR Y CONTINUAR"

### 4.2 Crear OAuth Client ID
1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "+ CREAR CREDENCIALES"
3. Selecciona "ID de cliente de OAuth 2.0"
4. Selecciona "Aplicación web"
5. Ingresa un nombre: `Calculadora Financiera Web Client`
6. En "Orígenes de JavaScript autorizados", agrega:
   ```
   http://localhost:3000
   http://localhost:5173
   https://tu-dominio.com
   ```
7. En "URI de redirección autorizados", agrega:
   ```
   http://localhost:3000
   http://localhost:5173
   https://tu-dominio.com
   ```
8. Haz clic en "CREAR"
9. **¡COPIA Y GUARDA!** El Client ID que aparece

---

## 📊 Paso 5: Crear Google Sheets para Datos

### 5.1 Opción A: Usar Plantilla (Recomendado)
1. [Haz clic aquí para copiar la plantilla](https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/copy)
2. Renombra la hoja: "Analytics - Mi Calculadora Financiera"
3. Copia el ID de la URL (la parte larga entre `/d/` y `/edit`)

### 5.2 Opción B: Crear Manualmente
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Renombra las pestañas y crea estas hojas:

#### Hoja "UserSessions"
```
A1: sessionId
B1: startTime  
C1: lastActivity
D1: pageViews
E1: calculationsPerformed
F1: timeSpent
G1: deviceInfo
H1: createdAt
```

#### Hoja "CalculatorUsage"
```
A1: sessionId
B1: calculatorType
C1: inputs
D1: results
E1: timeSpent
F1: completedCalculation
G1: timestamp
H1: errors
I1: createdAt
```

#### Hoja "UserBehaviors"
```
A1: sessionId
B1: action
C1: element
D1: timestamp
E1: metadata
F1: createdAt
```

#### Hoja "UserFeedback"
```
A1: sessionId
B1: calculatorType
C1: rating
D1: feedback
E1: category
F1: timestamp
G1: userAgent
H1: createdAt
```

#### Hoja "SessionUpdates"
```
A1: sessionId
B1: lastActivity
C1: pageViews
D1: calculationsPerformed
E1: timeSpent
F1: createdAt
```

4. Copia el ID de la hoja de cálculo desde la URL

---

## ⚙️ Paso 6: Configurar en tu Aplicación

### 6.1 Crear archivo .env
Crea un archivo `.env` en la raíz de tu proyecto:

```env
# Google Drive Analytics Configuration
VITE_GOOGLE_API_KEY=tu_api_key_aqui
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
VITE_GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id_aqui
```

### 6.2 Ejemplo de Credenciales
```env
# Ejemplo (NO uses estos valores reales)
VITE_GOOGLE_API_KEY=AIzaSyC4XYZ123abc456def789ghi012jkl345mno
VITE_GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com
VITE_GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

---

## ✅ Paso 7: Probar la Configuración

### 7.1 Verificar Credenciales
1. Reinicia tu servidor de desarrollo
2. Ve a la sección de configuración en tu app
3. Ingresa las credenciales
4. Haz clic en "Probar Conexión"

### 7.2 Verificar Permisos
1. La primera vez te pedirá autorización
2. Acepta los permisos para Google Sheets
3. Verifica que los datos se guarden correctamente

---

## 🔧 Solución de Problemas Comunes

### Error: "API key not valid"
- ✅ Verifica que la API key esté correcta
- ✅ Asegúrate de que las APIs estén habilitadas
- ✅ Revisa las restricciones de la API key

### Error: "Invalid client ID"
- ✅ Verifica que el Client ID esté completo
- ✅ Asegúrate de que los dominios estén autorizados
- ✅ Revisa que la pantalla de consentimiento esté configurada

### Error: "Insufficient permissions"
- ✅ Verifica que hayas aceptado los permisos
- ✅ Asegúrate de que la hoja de cálculo sea accesible
- ✅ Revisa que las APIs tengan los alcances correctos

### Los datos no se guardan
- ✅ Verifica la conexión a internet
- ✅ Revisa la consola del navegador para errores
- ✅ Asegúrate de que el ID de la hoja sea correcto

---

## 🎯 Resumen de lo que Necesitas

Al final de este proceso tendrás:

1. **API Key**: `AIzaSyC...` (para acceso a las APIs)
2. **Client ID**: `123456789...apps.googleusercontent.com` (para autenticación)
3. **Spreadsheet ID**: `1BxiMVs0XRA5...` (ID de tu hoja de cálculo)

---

## 🚀 ¡Listo para Usar!

Una vez que tengas estas tres credenciales:

1. Configúralas en tu archivo `.env`
2. Reinicia tu aplicación
3. Ve a la sección de configuración
4. Prueba la conexión
5. ¡Empieza a recopilar datos!

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa cada paso cuidadosamente
2. Verifica que todas las APIs estén habilitadas
3. Asegúrate de que los dominios estén autorizados
4. Consulta la consola del navegador para errores específicos

¡Tu sistema de analytics gratuito con Google Drive estará listo en minutos! 🎉