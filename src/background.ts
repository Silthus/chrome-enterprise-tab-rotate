import { TabRotator } from './models/tab-rotate'
import { configureContextMenu } from './util'
import analytics from './analytics'

analytics.backgroundPageview();

// will autostart based on json config
const tabRotator = new TabRotator()
tabRotator.init()
configureContextMenu(tabRotator)

tabRotator.StatusChanged.subscribe(() => {
  configureContextMenu(tabRotator)
})
