import { _decorator, Component, Node, Vec3 } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Vec3)
    offset: Vec3;

    @property(Player)
    player: Player;
    start() {

    }

    update(deltaTime: number) {
        if(this.player != null) {

            this.node.setPosition(this.player.node.getPosition().x, this.node.getPosition().y, this.node.getPosition().z)
        }
    }
}


