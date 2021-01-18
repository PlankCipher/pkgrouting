import googlemaps
import pandas as pd
import time
import csv
from config import GOOGLE_API_KEY
start = time.time()

data = pd.read_excel ('server\cords.xlsx' , 'data')

gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

destinations = data.coordinates

actual_distances = []
how1 = 0
n = 3

for i in destinations:

    each = []
    how = 0
    for j in destinations:
        result = gmaps.distance_matrix(i, j, mode='driving')["rows"][0]["elements"][0]["distance"]["value"]  
        result = result/1000
        each.append(result)
        how += 1
        if how == n:
            break

    actual_distances.append(each)

    how1 += 1
    if how1 == n:
            break


with open("server\distances.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(actual_distances)

end = time.time()

print (end - start)