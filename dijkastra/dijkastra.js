const graph = {
  A: { B: 5, C: 7 },
  B: { A: 5, E: 20, D: 15 },
  C: { A: 7, E: 35, D: 5 },
  D: { B: 15, C: 5, F: 20 },
  E: { B: 20, C: 35, F: 10 },
  F: { D: 20, E: 10 },
};

const dijkastra = (graph, start, end) => {
  let distances = {};
  let allNodes = Object.keys(graph);
  for (let node of allNodes) {
    distances[node] = 100000;
  }
  distances[start] = 0;
  let pq = [{ [start]: 0 }];
  while (pq.length > 0) {
    pq.sort((a, b) => {
      let value1 = Object.values(a)[0];
      let value2 = Object.values(b)[0];
      return value1 - value2;
    });
    let num = pq.shift();

    if (Object.keys(num)[0] == end) {
      return Object.values(num)[0];
    }
    num = Object.keys(num)[0];
    for (let child in graph[num]) {
      let newDist = distances[num] + graph[num][child];
      if (newDist < distances[child]) {
        distances[child] = distances[num] + graph[num][child];
        pq.push({ [child]: distances[child] });
      }
    }
  }
  return -1;
};
