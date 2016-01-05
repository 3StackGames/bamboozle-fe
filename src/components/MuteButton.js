import React from 'react'

const MuteButton = ({music, musicActs}) => {
	const muteIcon = (music) => {
		return music.muted ? 'muted.svg' : 'unmuted.svg'
	}

	return <button className="muteButton" onClick={() => {
		musicActs.toggleMute()
	}} style={{
		backgroundImage: `url(assets/img/${muteIcon(music)})`
	}}></button>

}

export default MuteButton