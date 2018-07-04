@file:JsModule("react-redux")

package reactredux

import redux.Store
import react.RProps
import react.RState
import react.ReactElement
import react.Component

@JsName("connect")
external fun <P: RProps, S: RState, ST> connect(
    mapStateToProps: ((ST, P) -> dynamic)?,
    mapDispatchToProps: Any?
): (Any) -> ReactElement

external class PProps : RProps {
    var store: Store
}

external class Provider : Component<PProps, RState> {
    override fun render(): ReactElement?
}

