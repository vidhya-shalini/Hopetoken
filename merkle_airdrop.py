# Simplified merkle: use sorted hashes
import json, hashlib

def h(x): return hashlib.sha256(x.encode()).hexdigest()

recipients = [
    {"addr":"addr1","amount":100},
    {"addr":"addr2","amount":50},
]
leaves = [h(r['addr']+"|"+str(r['amount'])) for r in recipients]

while len(leaves)>1:
    nxt = []
    for i in range(0,len(leaves),2):
        a = leaves[i]
        b = leaves[i+1] if i+1<len(leaves) else a
        nxt.append(h(a+b))
    leaves = nxt

root = leaves[0]
print('merkle_root:', root)
