package redux

external interface ReduxState

external class Store {
    @JsName("getState")
    fun getState(): ReduxState

    @JsName("dispatch")
    fun doDispatch(action: dynamic)
}

@JsModule("redux")
@JsNonModule
external object Redux {
    @JsName("createStore")
    fun <ST : ReduxState> createStore(
        reducer: (ST, dynamic) -> ReduxState,
        initialState: ST
    ): Store
}

fun Store.dispatch(action: dynamic) {
    this.doDispatch(action())
}