import { ButtplugWebsocketClient, ButtplugMessage, ButtplugDeviceMessage, Device, Log, StopDeviceCmd } from 'buttplug';


export default class ButtplugController {
    constructor () {
        this._firstMove = true;
        this._device = null;
        this._currentRate = 1;
        this._newPosition = 1;
        this._direction = 1;
        // assume initial position is 1 since the first thing we do after connecting is move it to 0;
        this.currentPosition = 1;
        this.onFinishedMove = null;
        this.onConnected = null;
        this.isConnected = false;
		this.bpClient = ButtplugWebsocketClient("webvr-experiment");
    }
    connect () {
        try { 
			
			this.move(0, 1);
			this.bpClient.Connect("ws://localhost:12345/buttplug");
        }
        catch(e) {
            console.log('ButtplugController failed. Retrying...', e);
            setTimeout(this.connect.bind(this), 1000);
        }
    }
    move (position, rate) {
        //if (!this._device) { throw new Error('not connected'); }
        //this._device.sendCommand(Math.floor(position * 99), Math.floor(rate * 99));
        this._direction = position >= this.currentPosition ? 1 : -1
        this._currentRate = rate;
        this._newPosition = position
    }
    update (delta) {
        if (this.currentPosition !== this._newPosition) {
            this.currentPosition = this.currentPosition + this._currentRate * 5.2 * delta * this._direction;
            if (Math.abs(this.currentPosition - this._newPosition) < 0.01 || this.currentPosition <= 0 || this.currentPosition >= 1) {
                this.currentPosition = this._newPosition;
                if (this._firstMove) {
                    this.isConnected = true;
                    if (this.onConnected) { this.onConnected(); }
                    this._firstMove = false;
                }
                if (this.onFinishedMove) {
                    this.onFinishedMove();
                }
            }
        }
    }
}