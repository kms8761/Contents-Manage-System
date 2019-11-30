export default {
  props: {
    google: { type: Object, required: true },
    map: { type: Object, required: true },
    position: { type: Object, required: true }
  },
  render (h) {
    return h()
  },
  mounted () {
    this.drawMarker()
  },
  destroyed () {
    this.clearMarker()
  },
  data () {
    return {
      marker: null
    }
  },
  methods: {
    drawMarker () {
      const marker = new this.google.maps.Marker({
        map: this.map,
        position: this.position
      })

      marker.addListener('click', (e) => {
        this.$emit('click', e)
      })

      this.marker = marker
    },
    clearMarker () {
      this.marker.setMap(null)
    }
  }
}
