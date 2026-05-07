import json
import os

countries_path = r'C:\Users\Gatita\.gemini\antigravity\brain\d73ac793-abce-4c18-825c-2a717f779b60\.system_generated\steps\3592\content.md'
states_path = r'C:\Users\Gatita\.gemini\antigravity\brain\d73ac793-abce-4c18-825c-2a717f779b60\.system_generated\steps\3598\content.md'

target_iso2 = {
    'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE',
    'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA'
}

def clean_content(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        # Find where the JSON starts (first '[' or '{')
        start_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('[') or line.strip().startswith('{'):
                start_idx = i
                break
        content = ''.join(lines[start_idx:])
        return json.loads(content)

countries = clean_content(countries_path)
states = clean_content(states_path)

filtered_countries = [c for c in countries if c['iso2'] in target_iso2]
filtered_states = [s for s in states if s['country_code'] in target_iso2]

# Map country names to IDs for states
country_id_map = {c['id']: c['iso2'] for c in filtered_countries}

# Save filtered data
output_dir = r'C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\packages\database\data'
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(output_dir, 'latam_countries.json'), 'w', encoding='utf-8') as f:
    json.dump(filtered_countries, f, indent=2, ensure_ascii=False)

with open(os.path.join(output_dir, 'latam_states.json'), 'w', encoding='utf-8') as f:
    json.dump(filtered_states, f, indent=2, ensure_ascii=False)

print(f"Filtered {len(filtered_countries)} countries and {len(filtered_states)} states.")
