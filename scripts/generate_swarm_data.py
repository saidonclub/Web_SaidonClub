import json

flows = ["Dashboard", "Marketplace", "Network Tree", "Profile", "Wallet", "Settings", "Audit Log"]
roles = ["Admin", "Socio", "Pionero", "Provider", "Cliente"]
devices = ["Desktop", "Mobile", "Tablet"]
actions = [
    "Verify UI alignment and responsiveness",
    "Check data loading latency",
    "Test interactive elements (buttons, inputs)",
    "Validate visual consistency with 'Ultra-Luxury' theme",
    "Check for overlapping elements",
    "Verify text readability and typography",
    "Test navigation transitions",
    "Check session persistence"
]

cases = []
for i in range(1, 201):
    case = {
        "id": i,
        "role": roles[i % len(roles)],
        "device": devices[i % len(devices)],
        "flow": flows[i % len(flows)],
        "action": actions[i % len(actions)],
        "persona": f"Agente_{i} - {roles[i % len(roles)]}"
    }
    cases.append(case)

with open("data/swarm_test_cases.json", "w", encoding="utf-8") as f:
    json.dump(cases, f, indent=2)

print(f"✅ Generados {len(cases)} casos de prueba.")
