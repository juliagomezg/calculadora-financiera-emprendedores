# 📊 Configuración de Google Drive Analytics

Esta guía te ayudará a configurar el sistema de analytics usando Google Drive y Google Sheets en lugar de Supabase.

## 🚀 Ventajas de usar Google Drive

- **💰 Gratis**: No hay costos de base de datos
- **📱 Accesible**: Desde cualquier dispositivo
- **👥 Colaborativo**: Comparte con tu equipo fácilmente
- **📈 Flexible**: Crea gráficas y reportes personalizados
- **🔒 Seguro**: Datos almacenados en Google Cloud

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Google Sheets API
   - Google Drive API

### 2. Crear Credenciales

#### API Key:
1. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
2. Copia la API Key generada

#### OAuth 2.0 Client ID:
1. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
2. Selecciona "Aplicación web"
3. Añade tu dominio a "Orígenes autorizados de JavaScript":
   - `http://localhost:5173` (para desarrollo)
   - `https://tu-dominio.com` (para producción)
4. Copia el Client ID generado

### 3. Crear Hoja de Cálculo de Google Sheets

#### Opción A: Usar plantilla (Recomendado)
1. [Haz clic aquí para copiar la plantilla](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy)
2. Copia el ID de la hoja de cálculo desde la URL

#### Opción B: Crear manualmente
1. Crea una nueva hoja de cálculo en Google Sheets
2. Crea las siguientes hojas (pestañas):
   - `UserSessions`
   - `CalculatorUsage`
   - `UserBehaviors`
   - `UserFeedback`
   - `SessionUpdates`
3. Copia el ID de la hoja de cálculo desde la URL

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_API_KEY=tu_api_key_aqui
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id_aqui
```

### 5. Configurar en la Aplicación

1. Ve a la sección de configuración en tu aplicación
2. Ingresa las credenciales de Google
3. Prueba la conexión

## 📊 Datos que se Almacenan

### UserSessions
- ID de sesión
- Tiempo de inicio y última actividad
- Número de páginas vistas
- Cálculos realizados
- Tiempo total gastado
- Información del dispositivo

### CalculatorUsage
- Tipo de calculadora utilizada
- Datos de entrada y resultados
- Tiempo gastado en cada cálculo
- Si se completó el cálculo
- Errores encontrados

### UserBehaviors
- Acciones del usuario (clics, navegación)
- Elementos interactuados
- Metadatos adicionales
- Timestamps

### UserFeedback
- Calificaciones de 1-5 estrellas
- Comentarios de texto
- Categoría del feedback
- Tipo de calculadora evaluada

## 🔧 Uso del Sistema

### Inicializar Analytics
```typescript
import { useGoogleDriveAnalytics } from './hooks/useGoogleDriveAnalytics';

const { trackPageView, trackButtonClick, trackUserFeedback } = useGoogleDriveAnalytics();
```

### Rastrear Eventos
```typescript
// Rastrear vista de página
await trackPageView('break-even-calculator');

// Rastrear clic de botón
await trackButtonClick('calculate-button', { calculatorType: 'break-even' });

// Rastrear feedback
await trackUserFeedback({
  rating: 5,
  feedback: 'Excelente calculadora',
  category: 'usability'
});
```

### Ver Datos
1. **En la aplicación**: Ve al dashboard de analytics
2. **En Google Sheets**: Abre directamente tu hoja de cálculo
3. **Exportar**: Descarga los datos como CSV

## 📈 Crear Reportes Personalizados

En Google Sheets puedes crear:

### Gráficas Automáticas
- Uso por calculadora
- Tendencias de tiempo
- Satisfacción del usuario
- Dispositivos más usados

### Fórmulas Útiles
```
// Promedio de calificaciones
=AVERAGE(UserFeedback!C:C)

// Calculadora más usada
=MODE(CalculatorUsage!B:B)

// Sesiones por día
=COUNTIFS(UserSessions!B:B,">="&TODAY(),UserSessions!B:B,"<"&TODAY()+1)
```

### Dashboards Interactivos
- Usa Google Data Studio para dashboards avanzados
- Conecta directamente con tu hoja de Google Sheets
- Crea reportes automáticos y compartibles

## 🔒 Seguridad y Privacidad

- Los datos se almacenan en Google Cloud (muy seguro)
- Solo tú tienes acceso a tu hoja de cálculo
- Puedes compartir con tu equipo con permisos específicos
- Los datos están encriptados en tránsito y en reposo

## 🆘 Solución de Problemas

### Error de Autenticación
- Verifica que las credenciales sean correctas
- Asegúrate de que las APIs estén habilitadas
- Revisa que los dominios estén autorizados

### No se Guardan Datos
- Verifica la conexión a internet
- Revisa que el ID de la hoja de cálculo sea correcto
- Los datos se guardan localmente como respaldo si falla

### Límites de Google Sheets
- Máximo 10 millones de celdas por hoja
- 1000 solicitudes por 100 segundos por usuario
- Para alto volumen, considera usar Google BigQuery

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la consola del navegador para errores
2. Verifica la configuración paso a paso
3. Consulta la documentación de Google Sheets API
4. Contacta al equipo de desarrollo

¡Disfruta de tu sistema de analytics gratuito y poderoso! 🎉