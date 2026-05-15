from typing import TypedDict, List
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    code: str
    errors: List[str]
    iterations: int

def developer_node(state: AgentState):
    print("--- DEVELOPER: Generando lógica ---")
    state['code'] = "def m_l_m_logic(): return 'Commission calculated'"
    state['iterations'] += 1
    return state

def tester_node(state: AgentState):
    print("--- QA TESTER: Buscando errores ---")
    # Simulamos encontrar un error en la primera iteración
    if state['iterations'] < 2:
        state['errors'] = ["Error de sintaxis detectado"]
    else:
        state['errors'] = []
    return state

def router(state: AgentState):
    if state['errors']:
        return "developer"
    return END

# Construcción del grafo
workflow = StateGraph(AgentState)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)

workflow.set_entry_point("developer")
workflow.add_edge("developer", "tester")
workflow.add_conditional_edges("tester", router)

app = workflow.compile()

if __name__ == "__main__":
    inputs = {"code": "", "errors": [], "iterations": 0}
    for output in app.stream(inputs):
        print(output)
