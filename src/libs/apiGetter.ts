import { AxiosResponse } from "axios"
import { useRoute, useRouter } from "vue-router"
import { useNotyf } from "../composable/useNotyf"
import { LoginData } from "../data/types"
import { getRemoteApp } from "../stores/appSettings"
import { useUserSession } from "../stores/userSession"
import { useApi } from '/@src/composable/useApi'

export const apiGetter = () => {

    const userSession = useUserSession()
    const api = useApi()
    const notif = useNotyf()


    const afterLogin = async (data) => {
        try {
            userSession.setUserSessions(data)
            await getRemoteApp()
            return
        } catch (error) {
            await userSession.logoutUser()
            throw (error)
        }
    }


    const login = async (values, redirect) => {
        return await new Promise(async (resolve, reject) => {
            try {
                var data: AxiosResponse = await api.post<LoginData[]>('login', values)

                await afterLogin(data);

                resolve(data);
            } catch (error: any) {
                await userSession.logoutUser()
                if (error.response.status == 401) {
                    reject(error.response.data.message)
                } else {
                    reject('Please try again')
                }
            }
        }).catch((error) => {
            console.log(error)
            notif.error(error)
        })

    }


    const register = async (values, setErrors, redirect) => {
        return await new Promise(async (resolve, reject) => {
            try {
                var data: AxiosResponse = await api.post<LoginData[]>('register', values)

                await afterLogin(data);

                resolve(data);

            } catch (error: any) {
                if (error.response.status == 422) {
                    setErrors(error.response.data.errors)
                    reject(error.response.data.message)
                } else {
                    reject('Please try again')
                }
            }
        }).catch((error) => {
            console.log(error)
            notif.error(error)
            throw (error)
        })

    }


    return {
        login,
        afterLogin,
        register
    }

}