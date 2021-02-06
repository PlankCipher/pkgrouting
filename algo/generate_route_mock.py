import sys
import json
from random import shuffle

def generateRoute(stops):
    shuffle(stops)
    return stops

stops = json.loads(sys.argv[1])['stops']
newStops = generateRoute(stops)
print(json.dumps({'stops': newStops}))
sys.stdout.flush()
