import { _decorator, Button, Color, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property(Label)
    state: Label;

    @property(Label)
    level: Label;

    @property(Button)
    pre: Button;

    @property(Button)
    next: Button;
    onInit(check: string, levelCurrent: number, state: boolean): void {
        this.state.string = check;
        this.level.string = "Level " + levelCurrent; 
        if(state) {
            this.state.color = Color.GREEN;
        }
        else {
            this.state.color = Color.RED;
        }
    }

    setButton(preState: boolean, nextState: boolean): void {
        console.log(preState + " " + nextState);
        this.pre.interactable = preState;
        this.next.interactable = nextState;
    }
}


