var ViewingRoom = ViewingRoom || {};

ViewingRoom.cssify = function(json) {
	var css = '';
	for (selector in json) {
		if (selector === '@import') {
			for (cssImport of json[selector]) {
				css += '@import ' + cssImport + '\n';
			}
			css += '\n';
		} else {
			css += selector.replace(/_/g, '-') + ' {\n';
			for (property in json[selector]) {
				css += '  ' + property.replace(/_/g, '-') + ': ' + json[selector][property] + ';\n';
			}
			css += '}\n\n';
		}
	}
	return css;
};

ViewingRoom.stylesheet = ViewingRoom.cssify({
	'@import': ['url(http://fonts.googleapis.com/css?family=Ubuntu+Mono:400,700,400italic,700italic&subset=latin,cyrillic-ext,greek-ext,greek,latin-ext,cyrillic)'],
	
	'::host': {
		background: 'black'
	},

	video: {
		background: 'black',
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
	},


	chat_room: {
		background: 'none',
		display: 'block',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		color: 'white',
		font_size: '16pt',		
		font_family: '"Ubuntu Mono", Monospace',
		transition: '-webkit-clip-path 113ms',
	},

	'chat_room.playing': {
		_webkit_clip_path: 'polygon(0 75%, 100% 75%, 100% 100%, 0 100%, 0 75%)',
	},

	'chat_room.hidden': {
		_webkit_clip_path: 'polygon(0 calc(100% - 50px), 100% calc(100% - 50px), 100% 100%, 0 100%, 0 calc(100% - 50px))',
	},

	chat_log: {
		display: 'block',
		flex_grow: 5,
		font_size: '16pt',
		margin_bottom: '9px',
		position: 'absolute',
		bottom: '50px',
		min_top: 0,
		max_height: '100%',
		width: '100%',
		overflow: 'auto',
		left: 0,
	},

	chat_from: {
		margin_right: '9px',
		color: '#999',
	},

	chat_message: {
		display: 'block'
	},

	form: {
		display: 'flex',
		flex_direction: 'row',
		background: '#222',
		padding: '9px',
		height: '32px',

		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0
	},

	input: {
		color: 'white',
		font_family: 'Ubuntu Mono, Monospace',
		font_size: '16pt',
		border: 0,
		outline: 0,
		padding: 0,
		background: 'none',
	},

	'input[type=submit]': {
		display: 'none',
	},

	'input#handle': {
		width: '100px',
	},

	'input#handle:after': {
		content: ': ',
	},

	'input#message': {
		background: '#444',		
		display: 'block',
		flex_grow: 2,
	}
});

ViewingRoom.room = Object.create(HTMLElement.prototype);

ViewingRoom.room.attachedCallback = function() {
	this.root = this.createShadowRoot();

	this.css = document.createElement('style');
	this.css.textContent = ViewingRoom.stylesheet;
	this.root.appendChild(this.css);

	this.player = document.createElement('video');
	this.root.appendChild(this.player);

	this.overlay = document.createElement('chat-room');
	this.overlay.onkeydown = this.onKey.bind(this);

	this.log = document.createElement('chat-log');
	this.overlay.appendChild(this.log);

	/** Form **/
	this.form = document.createElement('form');	
	this.handle = document.createElement('input');
	this.handle.id = 'handle';
	this.form.appendChild(this.handle);

	this.message = document.createElement('input');
	this.message.id = 'message';
	this.message.onkeydown = function(event) {
		if (!event.ctrlKey)
			event.stopPropagation();
	};
	this.message.oninput = function(event) {
		event.stopPropagation();
	};
	this.form.appendChild(this.message);

	this.submit = document.createElement('input');
	this.submit.setAttribute('type', 'submit');
	this.form.appendChild(this.submit);
	
	this.form.onsubmit = function(event) {
		event.preventDefault();
		this.say(this.handle.value, this.message.value);
		this.message.value = '';
	}.bind(this);

	this.overlay.appendChild(this.form);
	this.root.appendChild(this.overlay);	

	this.lastMessageTime = 0;
	window.addEventListener('keydown', this.onKey.bind(this));
	this.controlOverlayFade();
	this.connect();
};

ViewingRoom.room.onKey = function(event) {
	if (event.which == 32) {
		if (this.player.paused) {
			this.say(this.handle.value, '/play');
		} else {
			this.say(this.handle.value, '/pause');
		}
	}
};

ViewingRoom.room.connect = function() {
	this.db = new Firebase(this.attributes.src.value);
	this.messages = this.db.child('messages');
	this.messages.on('child_added', this.receive.bind(this));
};

ViewingRoom.room.controlOverlayFade = function() {
	if (!this.player.paused) {
		var now = Date.now();
		if (now - this.lastMessageTime > 1200) {
			this.overlay.setAttribute('class', 'hidden');
		} else {
			this.overlay.setAttribute('class', 'playing');
		}
	} else {
		this.overlay.removeAttribute('class');
	}
	window.requestAnimationFrame(this.controlOverlayFade.bind(this));
};

ViewingRoom.room.receive = function(snapshot) {
	var from = snapshot.val().from;
	var msg = snapshot.val().message;
	var time = snapshot.val().timestamp;
	var vidTime = snapshot.val().currentVideoTime;
	if (time > this.lastMessageTime) {
		this.lastMessageTime = time;
	}
	if (msg != '') {
		this.log.innerHTML += '<chat-message><chat-from>' + from + '</chat-from>' +
			'<chat-text>' + msg + '</chat-text></chat-message>';
		this.log.scrollTop = this.log.scrollHeight;
	}
	var command_re = /^\/([a-z]+) ?(.*)$/;
	var match = msg.match(command_re);
	if (match) {
		var command = match[1];
		var arg = match[2];
		switch(command) {
		case 'load':
			this.player.src = arg;
			break;

		case 'play':
			if (this.player.paused) {
				var diff = (Date.now() - time) / 1000;
				console.log(diff, vidTime);
				this.player.currentTime = diff + vidTime;
				this.player.play();
			}
			break;

		case 'pause':
			if (!this.player.paused) {
				this.player.pause();
				this.player.currentTime = vidTime;
			}
			break;

		case 'seek':
			var seekTo = 1.0 * arg;
			if (seekTo < 0) {
				seekTo = this.player.currentTime + seekTo;
			}
			this.player.currentTime = seekTo;
			break;
		}
	}
};

ViewingRoom.room.say = function(from, message) {
	if (message == '/play') {
		this.player.play();
	}
	if (message == '/pause') {
		this.player.pause();
	}
	if (message == '/vidtime') {
		message += ' ' + this.player.currentTime;
	}
	if (message === '/fs') {

	} else {
		var msg = {
			from: from,
			message: message,
			timestamp: Date.now(),
			currentVideoTime: this.player.currentTime,
		};
		this.messages.push(msg);
	}
}

document.registerElement('viewing-room', { prototype: ViewingRoom.room })