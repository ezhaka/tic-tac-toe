package reactredux

import redux.Store
import react.RBuilder
import react.RHandler
import react.RProps

fun RBuilder.provider(store: Store, handler: RHandler<RProps>) = child(Provider::class) {
    attrs.store = store
    handler?.invoke(this)
}