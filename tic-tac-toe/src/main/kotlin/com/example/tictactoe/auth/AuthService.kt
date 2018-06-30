//package com.example.tictactoe.auth
//
//import org.springframework.security.authentication.AuthenticationProvider
//import org.springframework.security.core.Authentication
//import org.springframework.security.web.authentication.RememberMeServices
//import org.springframework.stereotype.Service
//import javax.servlet.http.HttpServletRequest
//import javax.servlet.http.HttpServletResponse
//
///**
// * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
// * @date 23.06.18
// */
//@Service
//class AuthService : AuthenticationProvider, RememberMeServices {
//    override fun authenticate(authentication: Authentication): Authentication {
//        return authentication
//    }
//
//    override fun supports(authentication: Class<*>?): Boolean {
//        return true
//    }
//
//    override fun loginSuccess(request: HttpServletRequest?, response: HttpServletResponse?, successfulAuthentication: Authentication?) {
//
//    }
//
//    override fun autoLogin(request: HttpServletRequest?, response: HttpServletResponse?): Authentication {
//        return GameAuthentication()
//    }
//
//    override fun loginFail(request: HttpServletRequest?, response: HttpServletResponse?) {
//    }
//}