# 🗄️ Paquete Database (Prisma)

El corazón de los datos de **SaidonClub**. Este paquete centraliza el esquema Prisma, las migraciones y los scripts de seed.

## Responsabilidades
- **Esquema Único**: Define los modelos para usuarios, rangos, productos, servicios, transacciones y árbol genealógico (MLM).
- **Cliente Prisma**: Exporta el cliente de Prisma para ser consumido por el frontend y otros paquetes.
- **Seeds**: Contiene scripts deterministas para poblar el entorno de desarrollo y pruebas con datos coherentes.

## Comandos Principales
- `pnpm db:generate`: Genera los tipos de Prisma.
- `pnpm db:push` o `pnpm db:migrate`: Aplica el esquema a la BD PostgreSQL (Supabase).
