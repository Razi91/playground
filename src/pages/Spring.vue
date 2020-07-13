<template lang="pug">
  q-page()
    svg(
      width="1000px"
      height="600px"
      style="border: 1px solid black"
      @mousemove="mousemove"
      @mouseup="mouseup"
    )
      line(
        v-for="c in graph.connections"
        :x1="graph.nodes[c.nodes[0]].x"
        :y1="graph.nodes[c.nodes[0]].y"
        :x2="graph.nodes[c.nodes[1]].x"
        :y2="graph.nodes[c.nodes[1]].y"
        style="stroke:rgb(255,0,0);stroke-width:2"
      )
      g(
        v-for="node in graph.nodes"
        :transform="`translate(${node.x}, ${node.y})`"
        @mousedown="ev => mousedown(ev, node)"
      )
        circle(
          r="20"
          cx="0"
          cy="0"
          style="stroke: black; stroke-width: 2; fill: white;"
        )
        text(
          x="0"
          y="0"
          dominant-baseline="middle" text-anchor="middle"
        ) {{node.label}}
      line(
        v-for="(force, node) of forces"
        :x1="graph.nodes[node].x"
        :y1="graph.nodes[node].y"
        :x2="graph.nodes[node].x + force[0].ax"
        :y2="graph.nodes[node].y + force[0].ay"
        style="stroke: black; stroke-width: 2; fill: none;"
      )

    textarea(v-model="template" rows="40")
    button(@click="setTemplate") Ustaw
    br
    input(type="number" v-model="fps")
</template>

<script lang="ts">
import { ref, defineComponent, onUnmounted, Ref, reactive, watch } from '@vue/composition-api';
import { debounce } from 'lodash';
import useInterval from '../utils/useInterval';

/*
 * Works much better with Vue 3.0 for which it was written
 */

type GraphNode = {
  x: number;
  y: number;
  weight: number;
  label: string;
}

type Connection = {
  nodes: [string, string],
  length: number;
  calculatedLength?: number
}

type Graph = {
  nodes: { [key: string]: GraphNode },
  connections: Connection[]
}

const SampleGraph: Graph = {
  nodes: {
    'A': { x: 150, y: 150, label: 'A', weight: 1 },
    'B': { x: 350, y: 50, label: 'B', weight: 1 },
    'C': { x: 350, y: 350, label: 'C', weight: 1 },
    'D': { x: 50, y: 350, label: 'D', weight: 1 }
  },
  connections: [{
    nodes: ['A', 'B'],
    length: 100
  }, {
    nodes: ['B', 'C'],
    length: 200
  }, {
    nodes: ['B', 'D'],
    length: 200
  }, {
    nodes: ['D', 'A'],
    length: 150
  }, {
    nodes: ['C', 'A'],
    length: 300
  }, {
    nodes: ['D', 'C'],
    length: 200
  }]
};

type vec2 = {
    ax: number;
    ay: number;
  }

type Force = {
  [key: string]: vec2
}
type Forces = {
  [key: string]: vec2[]
}


function physicStep(graph: Graph, forces: Forces, delta: number) {
  const sprintStrength = 1000;
  const _forces = {} as Forces;

  Object.entries(forces).forEach(([node, force]) => {
    _forces[node] = _forces[node] ? _forces[node] : [];
    _forces[node].push(
      ...force
    );
  });

  function calcAngle(a: GraphNode, b: GraphNode) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  graph.connections.forEach((conn: Connection) => {
    const [a, b] = [graph.nodes[conn.nodes[0]], graph.nodes[conn.nodes[1]]];
    const length = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    conn.calculatedLength = length;
    const desired = conn.length;
    if (length != desired) {
      const f = delta * sprintStrength * ((desired - length) / desired);
      const angle = calcAngle(a, b);
      _forces[a.label] = _forces[a.label] ? _forces[a.label] : [];
      _forces[b.label] = _forces[b.label] ? _forces[b.label] : [];

      const weightSum = (a.weight + b.weight) / 2;
      const ratioA = a.weight / weightSum;
      const ratioB = b.weight / weightSum;

      _forces[a.label].push({
        ax: -f * Math.cos(angle) * ratioA,
        ay: -f * Math.sin(angle) * ratioA
      });
      _forces[b.label].push({
        ax: f * Math.cos(angle) * ratioB,
        ay: f * Math.sin(angle) * ratioB
      });
    }
  });

  Object.keys(graph.nodes).forEach(node => {
    const connL = graph.connections.filter(c => c.nodes[0] == node);
    const connR = graph.connections.filter(c => c.nodes[1] == node);
    const sum = connL.length + connR.length;
    if (sum > 1) {
      const others: string[] = [];
      const vf: Array<[number, number]> = [];
      const self = graph.nodes[node];
      connL.forEach(conn => {
        vf.push([
          graph.nodes[conn.nodes[1]].x - self.x,
          graph.nodes[conn.nodes[1]].y - self.y
        ]);
        others.push(conn.nodes[1]);
      });
      connR.forEach(conn => {
        vf.push([
          graph.nodes[conn.nodes[0]].x - self.x,
          graph.nodes[conn.nodes[0]].y - self.y
        ]);
        others.push(conn.nodes[0]);
      });
      const [x, y] = vf.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [0, 0]);
      const direction = Math.atan2(y, x);
      _forces[node] = _forces[node] ? _forces[node] : [];
      const strength = Math.min(5, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
      const f = {
        ax: strength * Math.cos(direction),
        ay: strength * Math.sin(direction)
      };
      const fp = {
        ax: strength * -Math.cos(direction) / others.length,
        ay: strength * -Math.sin(direction) / others.length
      };
      others.forEach(node => {
        _forces[node].push(fp);
      });
      // console.log(direction, f)
      _forces[node].push(f);
    }
  });
  return _forces;
}

function applyForces(graph: Ref<Graph>, forces: Forces, delta: number) {
  const damping = 0.95;
  let _force = {} as Forces;
  Object.entries(forces).forEach(([node, forces]) => {
    let ax = 0, ay = 0;
    forces.forEach(force => {
      ax += force.ax;
      ay += force.ay;
    });
    graph.value.nodes[node].x += ax * delta;
    graph.value.nodes[node].y += ay * delta;
    ax *= damping;
    ay *= damping;
    if (Math.abs(ax) + Math.abs(ay) > 1) {
      _force[node] =
        [{ ax, ay }];
    }
  });
  return _force;
}

export default defineComponent({
  setup() {
    const template = ref(JSON.stringify(SampleGraph, null, 2));
    const graph = ref<Graph>(SampleGraph);
    let forces = ref<Forces>({});
    const fps = ref(30);

    watch(graph, () => {
      forces.value = {};
    });

    const updateFps = useInterval((delta: number) => {
      console.log(delta)
        const newForces = physicStep(graph.value, forces.value, delta/1000);
        forces.value = applyForces(graph, newForces, delta/1000);
    }, 1000 / fps.value);
    watch(fps, debounce((fps: number) => updateFps(1000/fps), 500), { immediate: false });

    let isDown = false;
    let selected: string | null = null;

    return {
      data: {
        forces
      },
      graph,
      fps,
      forces,
      mousedown(ev: MouseEvent, node: GraphNode) {
        isDown = true;
        selected = node.label;
      },
      mouseup() {
        isDown = false;
        selected = null;
      },
      mousemove(ev: MouseEvent) {
        if (!isDown || selected == null) {
          return;
        }
        graph.value.nodes[selected].x = ev.offsetX;
        graph.value.nodes[selected].y = ev.offsetY;
      },
      template,
      setTemplate() {
        graph.value = JSON.parse(template.value) as Graph;
      },
    };
  }
});
</script>

<style scoped>
  img {
    width: 200px;
  }

  h1 {
    font-family: Arial, Helvetica, sans-serif;
  }

  svg text {
    pointer-events: none;
    user-select: none;
  }

</style>
