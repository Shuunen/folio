import { DarkMode, DEFAULT_ICON_CONFIGS, HamburgerButton, IconProvider } from '@icon-park/vue-next'
import '@icon-park/vue-next/styles/index.css'
import ColorGrid from '../../../components/color-grid.vue'
import ContactForm from '../../../components/contact-form.vue'
import DarkSwitch from '../../../components/dark-switch.vue'
import FooterBar from '../../../components/footer-bar.vue'
import NavBar from '../../../components/nav-bar.vue'
import PhotoGallery from '../../../components/photo-gallery.vue'
import PlaceHolder from '../../../components/place-holder.vue'
import PushButton from '../../../components/push-button.vue'
import Layout from './layout.vue'
import './styles.css'

export default {
  Layout,
  setup () {
    IconProvider({ ...DEFAULT_ICON_CONFIGS, prefix: 'icon' })
  },
  enhanceApp ({ app }) {
    app.component('color-grid', ColorGrid)
    app.component('contact-form', ContactForm)
    app.component('dark-mode', DarkMode)
    app.component('dark-switch', DarkSwitch)
    app.component('footer-bar', FooterBar)
    app.component('hamburger-button', HamburgerButton)
    app.component('nav-bar', NavBar)
    app.component('photo-gallery', PhotoGallery)
    app.component('place-holder', PlaceHolder)
    app.component('push-button', PushButton)
  }
}
