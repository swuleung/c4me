f = open('highSchools.txt', 'r')

lines = f.readlines()

l1 = []
l2 = []
l3 = []
for line in lines: 
    splitted = line.split('-')

    l1.append(' '.join(splitted[:-2]))
    l2.append(' '.join(splitted[-4:-1]))
    l3.append(splitted[-1].strip().upper())

print(l1)
print(l2)
print(l3)