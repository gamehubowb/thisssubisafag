import { __private, _decorator, CCFloat, Component, EventMouse, Input, input, KeyCode, math, RigidBody2D, Size, SpringJoint2D, Sprite, UITransform, Vec2, Vec3, Animation, Collider2D, Contact2DType, IPhysics2DContact, MotionStreak } from 'cc';
import { MapController } from './MapController';
import { KeyConstants } from './KeyConstants';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(RigidBody2D)
    public rb: RigidBody2D;

    @property(SpringJoint2D)
    public spJoint: SpringJoint2D;

    @property(UITransform)
    public line: UITransform;

    @property(CCFloat)
    public jumpUp: number;

    @property(Animation)
    public anim: Animation = null;

    public isRoping: boolean = false;
    closest: RigidBody2D = null;
    distancePoint: number = 0;
    start() {
        this.line.node.getComponent(Sprite).enabled = false;

        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onPostSolve, this);
    }

    onPostSolve(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null): void {
        if (contact && other.tag == 2) {
            // // Lấy vector vận tốc hiện tại
            let velocity = this.rb.linearVelocity;
            console.log("Velocity: " + velocity.y);

            // Lấy vector pháp tuyến của bề mặt va chạm
            let normal = contact.getWorldManifold().normal;

            // Tính toán vector phản xạ dựa trên vector vận tốc và vector pháp tuyến
            let dot = velocity.dot(normal);
            let reflectVelocity = velocity.subtract(normal.multiplyScalar(2 * dot));
            // Thiết lập lại vận tốc cho vật thể
            this.rb.linearVelocity = new Vec2(0, 10)
        }
    }

    onMouseDown(event: EventMouse) {
        this.isRoping = true;
        const pair = MapController.Instance.findNearest(this.node.getPosition());
        this.closest = pair[0];
        const closestPos = this.closest.node.getPosition();
        const anchorX = closestPos.x + 960;
        const anchorY = closestPos.y + 540;

        // Assign the connectedAnchor relative to the connected body's position
        this.spJoint.connectedAnchor = new Vec2(anchorX, anchorY);

        if (this.closest) {
            this.distancePoint = pair[1] - this.jumpUp;
        }
        this.spJoint.distance = this.distancePoint;
        this.line.contentSize = new Size(2, this.spJoint.distance)
        this.spJoint.enabled = true;
        this.line.node.getComponent(Sprite).enabled = true;
        console.log("onTouchStart")
    }

    onMouseUp(event: EventMouse) {
        this.spJoint.enabled = false;
        this.closest = null;
        this.line.node.getComponent(Sprite).enabled = false;
        this.isRoping = false;
    }

    update(dt: number) {
        if (this.closest) {
            var direction = this.node.getPosition().subtract(this.closest.node.getPosition())
            const angle = math.toDegree(Math.atan2(direction.y, direction.x))
            this.node.eulerAngles = new Vec3(0, 0, angle + 90);

        }
        this.ChangeAnim();
    }

    ChangeAnim() {
        if (!this.isRoping) {
            this.anim.play(KeyConstants.ANIM_NOROPE)
        }
        else if (this.node.getPosition().x < this.closest.node.getPosition().x) {
            this.anim.play(KeyConstants.ANIM_LEFTROPE)
        }
        else if (this.node.getPosition().x >= this.closest.node.getPosition().x) {
            this.anim.play(KeyConstants.ANIM_RIGHTROPE)
        }
    }

    reset() {
        this.node.setPosition(MapController.Instance.startPlayer.getPosition());
        this.rb.linearVelocity = new Vec2(0, 0)
        this.line.enabled = false;
        
    }

    resetActive(check: boolean) {
        this.rb.enabled = check;
        this.node.getComponent(MotionStreak).enabled = check;
        if (check) {
            input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        else {
            input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }
}
