import os
from crewai import Agent, Task, Crew, Process

# Configuración de LLM (usando Groq vía OpenAI compatible API o LangChain)
# Para este ejemplo, configuramos el entorno para que use las llaves cargadas
os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama-3.3-70b-versatile"
os.environ["OPENAI_API_KEY"] = os.getenv("GROQ_API_KEY", "")

class SaidonClubAgency:
    def __init__(self):
        # 1. UX/UI Designer
        self.designer = Agent(
            role='UX/UI Designer',
            goal='Generar interfaces de ultra-lujo con CSS premium y animaciones Framer Motion.',
            backstory='Eres un diseñador experto que trabajó en agencias de lujo. Tu especialidad es el estilo Obsidian & Safety Orange y el Glassmorphism.',
            verbose=True,
            allow_delegation=False
        )

        # 2. Full-Stack Developer
        self.developer = Agent(
            role='Full-Stack Developer',
            goal='Implementar la lógica MLM y estructura de base de datos en PostgreSQL.',
            backstory='Eres un arquitecto de software experto en sistemas escalables y algoritmos de comisiones multinivel.',
            verbose=True,
            allow_delegation=True
        )

        # 3. QA Tester
        self.tester = Agent(
            role='QA Tester',
            goal='Encontrar cada error, bug o vulnerabilidad en el código generado.',
            backstory='Eres un auditor obsesivo con la calidad. No dejas pasar ni un solo error de sintaxis o lógica.',
            verbose=True,
            allow_delegation=False
        )

    def create_project_crew(self, requirements):
        # Tarea de Diseño
        task_design = Task(
            description=f'Diseñar el componente para: {requirements}. Entregar CSS y configuración de animaciones.',
            agent=self.designer,
            expected_output='Código CSS y hooks de Framer Motion.'
        )

        # Tarea de Desarrollo
        task_dev = Task(
            description=f'Implementar la lógica backend y BD para: {requirements}.',
            agent=self.developer,
            expected_output='Esquema de base de datos y funciones lógicas.'
        )

        # Tarea de QA
        task_qa = Task(
            description='Revisar el diseño y el código generado por los otros agentes para asegurar que no hay errores.',
            agent=self.tester,
            expected_output='Reporte de auditoría y código corregido.'
        )

        # Instanciar la Agencia
        crew = Crew(
            agents=[self.designer, self.developer, self.tester],
            tasks=[task_design, task_dev, task_qa],
            process=Process.sequential
        )
        
        return crew

if __name__ == "__main__":
    agency = SaidonClubAgency()
    # Prueba inicial
    result = agency.create_project_crew("Marketplace Product Card con animaciones de brillo").kickoff()
    print("\n\n########################")
    print("## RESULTADO AGENCIA  ##")
    print("########################\n")
    print(result)
