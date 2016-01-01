import objectPath from 'object-path'

export const GAMEPAD_TOKEN = 'gamepad.token'

export const currentPhase = (gameState, phases) => {
  const phaseName = objectPath.get(gameState, ['currentPhase', 'phaseName'])
  return phases[phaseName || 'InitialPhase']
}

export const bindGameStateDecorator = (engine) => (component) => {
  const cwm = component.prototype.componentWillMount
  const cwu = component.prototype.componentWillUnmount

  component.prototype.componentWillMount = function() {
    engine.addStateListener(this.bindState)
    if (cwm) cwm.call(this)
  }

  component.prototype.componentWillUnmount = function() {
    engine.removeStateListener(this.bindState)
    if (cwu) cwu.call(this)
  }
}

export const fetchLocalToken = () => {
  return localStorage.getItem(GAMEPAD_TOKEN)
}

// Make a util enum for phase names phase.INITIAL, phase.SELECT_CARDS, etc
