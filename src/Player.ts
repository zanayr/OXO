class PlayerBehavior extends Sup.Behavior {
    awake () {
        Game.squares();
        Game.start();
    }

    mouse (action, square) {
        switch (action) {
            case 0:
                square.spriteRenderer.setAnimation(STATE[1]);
                break;
            case 1:
                square.spriteRenderer.setAnimation(STATE[2]);
                break;
            default:
                square.spriteRenderer.setAnimation(STATE[0]);
                break;
        }
    }
    cycle () {
        state = 1;
        if (!Game.victory()) {
            state = 0;
            Game.ai();
            if (!Game.victory())
                state = 1;
        }
    }

    update () {
        ray.setFromCamera(Sup.getActor('Camera').camera, Sup.Input.getMousePosition());
        for (let square of SQUARE) {
            if (ray.intersectActor(square[0], false).length > 0) {
                if (!square[1]) {
                    square[1] = 1;
                    this.mouse(0, square[0]);
                }
                if (Sup.Input.wasMouseButtonJustPressed(0) && square[1] === 1) {
                    if (state) {
                        state = 0;
                        square[1] = 2;
                        this.mouse(1, square[0]);
                        Sup.setTimeout(600, this.cycle);
                    }
                }
            } else if (square[1] === 1) {
                square[1] = 0;
                this.mouse(2, square[0]);
            }
        }
    }
}

class ScreenBehavior extends Sup.Behavior {
    update () {
        if (Sup.Input.wasKeyJustPressed('SPACE')) {
            Sup.getActor('Screen').destroy();
            Game.start();
        }
    }
}

Sup.registerBehavior(PlayerBehavior);
Sup.registerBehavior(ScreenBehavior);