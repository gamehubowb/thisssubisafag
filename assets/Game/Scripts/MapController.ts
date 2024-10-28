import { _decorator, Component, Node, RigidBody2D, SpringJoint2D, UITransform, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapController')
export class MapController extends Component {
    public static Instance: MapController = null
    @property({ type: Node })
    parentPoint: Node;

    @property({ type: Node })
    win: Node;

    @property({ type: Node })
    die: Node;

    @property({ type: Node })
    startPlayer: Node;

    listPoint: Array<RigidBody2D>;

    onLoad() {
        MapController.Instance = this
        this.listPoint = new Array<RigidBody2D>();

        for (var i = 0; i < this.parentPoint.children.length; i++) {
            this.parentPoint.children[i].getComponent(UITransform).priority = 1;
            this.listPoint.push(this.parentPoint.children[i].getComponent(RigidBody2D))
        }
    }

    showList() {
        this.listPoint.forEach(childItem => {
            console.log(childItem.name)
        })
    }

    findNearest(pos:Vec3) : [RigidBody2D, number] {
        var closest : RigidBody2D = null;
        var distance : number = Number.POSITIVE_INFINITY;
        this.listPoint.forEach(childItem => {
            var diff: Vec3 = childItem.node.getPosition().subtract(pos);
            var curDistance: number = Math.sqrt(diff.lengthSqr());
            if(curDistance < distance) {
                closest = childItem;
                distance = curDistance;
            }
        })
        return [closest, distance];
    }
}


