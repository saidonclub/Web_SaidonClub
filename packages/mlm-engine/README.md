# 🧬 Paquete MLM-Engine

El núcleo matemático y financiero de **SaidonClub**. Este paquete gestiona toda la lógica de la red de mercadeo (MLM).

## Responsabilidades
- **Motor de Comisiones**: Algoritmo en cascada que calcula y distribuye comisiones a lo largo de 8 niveles jerárquicos de forma transaccional (ACID).
- **Gestión Genealógica**: Construcción y consulta eficiente del árbol de referidos, calculando el volumen grupal y personal.
- **Evaluación de Rangos**: Motor que monitorea el volumen (PV/GV) y los requisitos estructurales para promover usuarios a nuevos rangos automáticamente.
- **Estrés Operativo**: Minimiza las consultas a base de datos utilizando caché y cálculos pre-fetch para alta escala.
