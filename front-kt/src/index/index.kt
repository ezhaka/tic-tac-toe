package index

import app.*
import kotlinext.js.*
import react.dom.*
import kotlin.browser.*
import store.*
import redux.Store
import reactredux.*

fun main(args: Array<String>) {
    requireAll(require.context("src", true, js("/\\.css$/")))

    val store: Store = configureStore()

    render(document.getElementById("root")) {
        provider(store) {
            app()
        }
    }
}
