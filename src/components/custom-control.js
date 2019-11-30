const name = 'customControl'

export default {
  props: {
    google: { type: Object, required: true },
    map: { type: Object, required: true },
    position: { type: String, default: 'LEFT_TOP' }
  },
  render (h) {
    const el = 'div'
    const options = { ref: name }
    const slot = this.$slots.default[0]

    return h(el, options, [slot])
  },
  mounted () {
    this.addControl()
  },
  methods: {
    addControl () {
      const el = this.$refs[name]
      this.map.controls[this.google.maps.ControlPosition[this.position]].push(el)
    }
  }
}
