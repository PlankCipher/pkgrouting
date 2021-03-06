import sys
import json
import googlemaps
import numpy as np
from config import GOOGLE_API_KEY
from sko.GA import GA_TSP

def find_path(dist_mat, num_points, max_iter=1000):

    distance_matrix = dist_mat


    def cal_total_distance(routine):
        num_points, = routine.shape
        return sum([distance_matrix[routine[i % num_points], routine[(i + 1) % num_points]] for i in range(num_points)])


    ga_tsp = GA_TSP(func=cal_total_distance, n_dim=num_points, size_pop=200, max_iter=max_iter, prob_mut=0.4)
    
    return ga_tsp


def get_distances(cords):

    gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

    all_distances = []
    count = 0
    for i in cords:

        each = []
        if i == cords[0]:
            for j in cords:
                if i == j:
                    dist = 0
                else:
                    result = gmaps.distance_matrix(i, j, mode='driving')
                    dist = result["rows"][0]["elements"][0]["distance"]["value"]/1000
                each.append(dist)
        else:
            for j in range(count):
                each.append(all_distances[j][count])
            for j in range(count, len(cords)):
                if i == cords[j]:
                    dist = 0
                else:
                    result = gmaps.distance_matrix(i, cords[j], mode='driving')
                    dist = result["rows"][0]["elements"][0]["distance"]["value"]/1000
                each.append(dist)

        all_distances.append(each)
        count+=1
    return all_distances

def generateRoute(stops):
    cords = []

    for i in stops:
        cords.append(f"{i['lat']},{i['lng']}")

    iterations = 15*len(stops)

    distances = get_distances(cords)
    distance_matrix = np.asarray(distances)


    ga_tsp = find_path(distance_matrix, len(cords), max_iter=iterations)
    best_points, best_distance = ga_tsp.run()


    new_cords = [ stops[i] for i in best_points]

    return  new_cords



stops = json.loads(sys.argv[1])['stops']
newStops = generateRoute(stops)
print(json.dumps({'stops': newStops}))
sys.stdout.flush()
