import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { Storage } from '../src/services/storage'

test('fake Storage', () => {
  const storage = new Storage()
  equal(storage.data, 14)
})

test.run()
