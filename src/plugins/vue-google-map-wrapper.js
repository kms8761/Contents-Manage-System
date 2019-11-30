import googleMapFactory from '@/components/map'
import googleMapMarker from '@/components/marker'
import googleMapCustomControl from '@/components/custom-control'

function install (Vue, options) {
  const { apiKey } = options

  const googleMap = googleMapFactory(apiKey)

  const components = {
    googleMap,
    googleMapMarker,
    googleMapCustomControl
  }

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component)
  })
}

export default install
