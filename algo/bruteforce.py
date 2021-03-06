import itertools
import numpy as np
from scipy import spatial

n= 3
cords = np.random.rand(n, 2) * n * 10 # Generating random data to test the algorithm.

distances = spatial.distance.cdist(cords, cords, metric='euclidean') # Calculating the distace between each two points.

cities = range(len(distances))

permutations = itertools.permutations(cities) # Generating all possible routes 


min_dist = float('inf')
best_perm = cities
for i in permutations:
    # this loop iterates over all the possible routes claulating the 
    # total distance of the route then returning the one with the shortest distance.
    cities = i
    current_dist = 0
    for j in range (len(cities)-1):
        current_dist += distances[cities[j]][cities[j+1]]
    if current_dist < min_dist:
        min_dist = current_dist
        best_perm = cities

print (min_dist, best_perm)