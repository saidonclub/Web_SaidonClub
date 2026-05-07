import gzip
import json
import os

target_iso2 = {
    'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE',
    'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA'
}

input_path = r'C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\packages\database\data\cities.json.gz'
output_dir = r'C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\packages\database\data'
output_path = os.path.join(output_dir, 'latam_cities.json')

print("Starting to filter cities...")
try:
    with gzip.open(input_path, 'rt', encoding='utf-8') as f:
        cities = json.load(f)
        filtered_cities = [c for c in cities if c['country_code'] in target_iso2]
        
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_cities, f, indent=2, ensure_ascii=False)
        
    print(f"Filtered {len(filtered_cities)} cities.")
except Exception as e:
    print(f"Error: {e}")
