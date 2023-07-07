<script setup lang="ts">
import {
    ref
} from "vue-demi";
import {
    useRoute,
    useRouter
} from "vue-router";
import {
    useUserSession
} from "/@src/stores/userSession";
import {
    useFullscreen
} from '@vueuse/core'
import { computed } from "@vue/reactivity";
import usericon from '/@src/assets/icons/user-icon.json'

const router = useRouter()

const logout = (): any => {
    userSession.logoutUser()
    router.push({
        name: 'auth'
    })
}

const goto = (p: string) => {
    router.push({
        name: p
    })
}

const userSession = useUserSession()

const fullname = computed(() => userSession.username)



</script>

<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box">

                    <a class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="/src/assets/images/youdex-l.svg" />
                        </span>
                        <span class="logo-lg">
                            <img src="/src/assets/images/youdex-l.svg" />
                        </span>
                    </a>

                    <a class="logo logo-light" @click="goto('app')">
                        <span class="logo-sm">
                            <img src="/src/assets/images/youdex-l.svg" />
                        </span>
                        <span class="logo-lg">
                            <img src="/src/assets/images/youdex-l.svg" class="logo-l" />
                        </span>
                    </a>
                </div>

                <button type="button" class="btn btn-sm px-3 font-size-24 d-lg-none header-item"
                    data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
                    <i class="ri-menu-2-line align-middle"></i>
                </button>
            </div>

            <div class="d-flex">

                <div class="dropdown d-inline-block user-dropdown">
                    <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Vue3Lottie class="w-h-icon" :animationData="usericon" :height="40" :width="40" />
                        <span class="d-none d-xl-inline-block ms-1 ft-c">Hello, {{ fullname }} </span>
                        <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <!-- item-->
                        <a class="dropdown-item" @click="goto('user-profile')"><i
                                class="ri-user-line align-middle me-1"></i>
                            Profile</a>

                        <!--  <a class="dropdown-item d-block" href="#"><span class="badge bg-success float-end mt-1">11</span><i class="ri-settings-2-line align-middle me-1"></i> Settings</a> -->
                        <!-- <a class="dropdown-item" href="#"><i class="ri-lock-unlock-line align-middle me-1"></i> Lock screen</a> -->
                        <div class="dropdown-divider"></div>
                        <button @click="logout" class="dropdown-item text-danger" data-toggle="modal"><i
                                class="ri-shut-down-line align-middle me-1 text-danger"></i> Logout</button>
                    </div>
                </div>

            </div>
        </div>
    </header>
    <!-- end header -->

    <div class="topnav">
        <div class="container-fluid">
            <nav class="navbar navbar-light navbar-expand-lg topnav-menu">

                <div class="collapse navbar-collapse" id="topnav-menu-content">


                    <ul class="navbar-nav ">

                        <li class="nav-item">
                            <a class="nav-link" @click="goto('app')">
                                <i class="ri-dashboard-line me-2"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="goto('exchange')">
                                <i class="ri-apps-2-line me-2"></i> Exchange
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="goto('assets')">
                                <i class="ri-wallet-line me-2"></i> Assets
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="goto('stake')">
                                <i class="ri-lock-line me-2"></i> Stake
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="goto('referral')">
                                <i class="ri-team-line me-2"></i> Referral
                            </a>
                        </li>
                        <!-- end li -->

                    </ul>
                    <!-- end ul -->


                </div>



            </nav>

        </div>
    </div>
</template>

<style lang="scss">
.logo-l {
    height: 45px;
}

.nav-link {
    cursor: pointer;
}
</style>
