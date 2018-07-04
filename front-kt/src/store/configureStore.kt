package store

import redux.*

class State : ReduxState {

}

fun configureStore(): Store {
    return Redux.createStore<State>(
        { state, action -> state },
        State()
    )
}