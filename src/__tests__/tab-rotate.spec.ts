import { TabRotator } from '../models/tab-rotate'
import { MockConfig } from '../models/config.mock'

describe('TabRotator', () => {
  let model: TabRotator
  let config: MockConfig

  beforeEach(() => {
    model = new TabRotator()
    config = new MockConfig()
    config.config = {
      autoStart: true
    }
    Object.defineProperty(model, '_options', { value: config })
  })

  describe('init()', () => {
    beforeEach(() => {
      jest.spyOn(model, 'reload')
      jest.spyOn(model, 'start')
    })

    it('should auto start if defined in config', (done) => {
      model.init().then(() => {
        expect(model.start).toHaveBeenCalled()
        done()
      })
    })
  })
})
