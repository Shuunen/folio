import PhotoGallery from '../../../components/photo-gallery.vue'
import Layout from './layout.vue'
import './styles.css'


export default {
  Layout,
  enhanceApp({ app }) {
    app.component('PhotoGallery', PhotoGallery)
  }
}
