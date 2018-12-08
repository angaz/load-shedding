import json

with open('table.json') as f:
    values = json.load(f)

out_values = []

for i, row in enumerate(values):
    if i % 8 == 0:
        out_values.append({
            'start': row[0],
            'end': row[1],
            row[2]: [int(v) for v in row[3:]]
        })
    else:
        out_values[-1][row[0]] = [int(v) for v in row[1:]]


print(json.dumps(out_values))
