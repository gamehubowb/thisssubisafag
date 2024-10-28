import { _decorator, Component, director, Input, input, Node, Vec3, EventTarget, Label, sys, Prefab, instantiate, CCInteger} from 'cc';
import { Player } from './Player';
import { MapController } from './MapController';
import { StartMenu } from './StartMenu';
const { ccclass, property } = _decorator;
export const eventTarget = new EventTarget();

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END
}

declare global {
    var score: any;
}


globalThis.score = 0;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(StartMenu)
    public startMenu: StartMenu | null = null

    @property(Player)
    public player: Player | null = null

    @property({type: Label})
    public levelIngame: Label = null;

    @property(Prefab)
    public Map1: Prefab | null = null;

    @property({type: [Prefab]})
    public Map2: Prefab = null;

    @property({type: [Prefab]})
    public Map3: Prefab = null;

    @property({type: [Prefab]})
    public Map4: Prefab = null;

    private listMap: Array<Prefab> = new Array<Prefab>();
    private currentMapIndex: number = 1;
    private mapCurrent: Node;
    private isEnd: boolean = false;
    private state: boolean = false;

    onEnable(): void {
        this.listMap.push(this.Map1)
        this.listMap.push(this.Map2)
        this.listMap.push(this.Map3)
        this.listMap.push(this.Map4)
        if(sys.localStorage.getItem("Level") == null) {
            sys.localStorage.setItem("Level", "1")
        }
        this.currentMapIndex = parseInt(sys.localStorage.getItem("Level"));
    }

    onDisable(): void {
        
    }

    protected start(): void {
        this.setCurrentState(GameState.GS_INIT);
    }

    init() {
        if(this.startMenu) {
            this.startMenu.node.active = true;
            this.startMenu.onInit("Chơi thôi", this.currentMapIndex, true);
            this.startMenu.setButton(this.currentMapIndex > 1, this.currentMapIndex < this.listMap.length)
        }
        this.levelIngame.enabled = false;
        this.loadMap()
        this.player.resetActive(false);
    }

    playing() {
        this.isEnd = false;
        this.loadMap();
        sys.localStorage.setItem("Level", this.currentMapIndex)
        if(this.startMenu) {
            this.startMenu.node.active = false;
        }
        this.levelIngame.enabled = true;
        this.levelIngame.string = "Level " + this.currentMapIndex;
    }

    end() {
        
        if(this.state) {
            this.startMenu.node.active = true;
            this.startMenu.onInit("Win", this.currentMapIndex, this.state);
        }
        else {
            this.startMenu.node.active = true;
            this.startMenu.onInit("Fail", this.currentMapIndex, this.state);
        }
        this.levelIngame.enabled = false;
        this.startMenu.setButton(this.currentMapIndex > 1, this.currentMapIndex < this.listMap.length)
        this.player.reset();
        this.player.resetActive(false);
    }

    startGame() {
        
    }

    loadMap(): void {
        if(this.mapCurrent != null) {
            this.mapCurrent.destroy();
        }
        this.mapCurrent = instantiate(this.listMap[this.currentMapIndex - 1])
        console.log(this.listMap[this.currentMapIndex - 1])
        this.mapCurrent.setPosition(Vec3.ZERO)
        this.node.parent.addChild(this.mapCurrent);
        this.mapCurrent.setSiblingIndex(0)
        this.player.reset();
        this.player.resetActive(true);
    }

    onStartButtonClickedNext() {
        this.currentMapIndex += 1;
        this.setCurrentState(GameState.GS_PLAYING);
    }

    onStartButtonClickTry() {
        this.setCurrentState(GameState.GS_PLAYING);
    }

    onStartButtonClickPrevious() {
        this.currentMapIndex -= 1;
        this.setCurrentState(GameState.GS_PLAYING);
    }

    setCurrentState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                this.playing();
                break;
            case GameState.GS_END:
                this.end();
                break;
        }
    }

    onPlayerDie() {
        this.setCurrentState(GameState.GS_END)
    }

    protected update(dt: number): void {
        this.startMenu.node.setPosition(new Vec3(this.player.node.getPosition().x, this.startMenu.node.getPosition().y, this.startMenu.node.getPosition().z))
        if(this.mapCurrent) {
            if(this.isEnd) {
                return;
            }
            
            if(this.player.node.getPosition().x > MapController.Instance.win.getPosition().x) {
                this.state = true;
                this.setCurrentState(GameState.GS_END)
                this.isEnd = true;
            }
            else if(this.player.node.getPosition().y < MapController.Instance.die.getPosition().y && !this.player.isRoping) {
                this.state = false;
                this.setCurrentState(GameState.GS_END)
                this.isEnd = true;
            }
        }
    }
}


