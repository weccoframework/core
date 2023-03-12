import * as wecco from "@weccoframework/core"

class Model {
    constructor(public readonly count: number, public readonly explanation: string) {}

    inc() {
        return new Model(this.count + 1, this.explanation)
    }
}

type Message = "inc"

function update(ctx: wecco.AppContext<Message>, model: Model, message: Message): Model {
    return model.inc()
}

function view (ctx: wecco.AppContext<Message>, model: Model) {
    return wecco.html`
    <p>${model.explanation}</p>
    <p>
        <button class="btn btn-primary" @click=${() => ctx.emit("inc")}>
            You clicked me ${model.count} times
        </button>
    </p>`
}

document.addEventListener("DOMContentLoaded", () => {
    wecco.app(() => new Model(0, "Click the button to increment the counter."), update, view, "#count-clicks-app")
})
