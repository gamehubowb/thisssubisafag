import { _decorator, Component, math, Node, Vec3 } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property(Player)
    public player: Player;

    start() {

    }

    update(dt: number) {
        this.node.setPosition(this.player.node.getPosition())
        if (this.player.closest) {
            var direction = this.node.getPosition().subtract(this.player.closest.node.getPosition())
            const angle = math.toDegree(Math.atan2(direction.y, direction.x))
            this.node.eulerAngles = new Vec3(0, 0, angle + 90);

        }
    }
}


