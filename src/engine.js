import config from '../.env'
// Use local copy for development speed
// import dc from 'digital-compass-client'
import dc from '../digital-compass-client/lib'

let socketEngine = dc.SocketEngine(config)

export default socketEngine
