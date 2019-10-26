Vue.component("tree", {
  data() {
    return {
      treeData: [
        {
          text: "Loqding..."
        }
      ]
    };
  },
  mounted: function() {
    window.addEventListener("message", event => {
      this.treeData = event.data.payload;
    });
  },
  template: `{{threeData}} <ul v-if="treeData.length" class="tree">
            <tree-element v-for="(element, index) in treeData" :key="index + 1" :element="element" />
        </ul>`
});

Vue.component("tree-element", {
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  template: `<li>{{ element.text }}
            <ul>
              <tree-element v-for="(node, index) in element.nodes" :key="index + 1" :element="node" />
            </ul>
        </li>`
});

var app = new Vue({
  el: "#app"
});
