import { TabRotator } from './models/tab-rotate'
import { configureContextMenu } from './util'

// will autostart based on json config
const tabRotator = new TabRotator()
tabRotator.init()
configureContextMenu(tabRotator)

tabRotator.StatusChanged.subscribe(() => {
  configureContextMenu(tabRotator)
})
